"""RabbitMQ worker that forwards mode commands to Arduino."""

import json
import os
import sys
import time

import pika
from pika.exceptions import AMQPConnectionError
from serial import Serial, SerialException
from serial.tools import list_ports

# ============================================================
#  CONFIGURATION — adjust these to match your setup
# ============================================================
RABBITMQ_HOST = "localhost"
RABBITMQ_PORT = 5673
RABBITMQ_USER = "guest"
RABBITMQ_PASS = "guest"
QUEUE_NAME = "mode.queue"

# Arduino serial port. If unset, the worker scans common
# USB serial devices and Arduino-like ports automatically.
ARDUINO_PORT = os.getenv("ARDUINO_PORT")
ARDUINO_BAUD = 9600


# ============================================================
#  MODE MAPPING:  API 0,1,2  -->  Arduino 1,2,3
# ============================================================
MODE_MAP = {
    0: "1",  # Sun Tracking
    1: "2",  # Rain Shield (90 deg)
    2: "3",  # Open Roof (0 deg)
}

MODE_NAMES = {
    0: "SUN TRACKING",
    1: "RAIN SHIELD (90 Degrees)",
    2: "OPEN ROOF (0 Degrees)",
}


# ============================================================
#  ARDUINO SERIAL CONNECTION
# ============================================================
def list_candidate_ports():
    """Return likely Arduino serial ports, best match first."""
    ports = list(list_ports.comports())
    preferred_ports = []
    usb_like_ports = []

    for port in ports:
        details = " ".join(
            filter(
                None, [port.device, port.description, port.manufacturer, port.product]
            )
        ).lower()

        device_name = port.device.lower()

        if any(
            keyword in details
            for keyword in [
                "arduino",
                "wch",
                "usb serial",
                "cp210",
                "ch340",
                "ttyusb",
                "ttyacm",
                "usbmodem",
                "usbserial",
            ]
        ):
            preferred_ports.append(port.device)
            continue

        if (
            device_name.startswith("/dev/ttyusb")
            or device_name.startswith("/dev/ttyacm")
            or device_name.startswith("/dev/cu.")
            or device_name.startswith("/dev/tty.")
            or device_name.startswith("com")
        ):
            usb_like_ports.append(port.device)

    if ARDUINO_PORT:
        return [ARDUINO_PORT] + [
            port for port in preferred_ports + usb_like_ports if port != ARDUINO_PORT
        ]

    return preferred_ports + usb_like_ports


def open_serial_port(port_name):
    """Open a serial port and wait for Arduino reset."""
    serial_connection = Serial(
        port=port_name,
        baudrate=ARDUINO_BAUD,
        timeout=1,
    )
    time.sleep(2)
    serial_connection.reset_input_buffer()
    print(f"Arduino connected on {port_name}")
    return serial_connection


def connect_arduino():
    """Open the first available Arduino-compatible serial port."""
    candidate_ports = list_candidate_ports()

    if not candidate_ports:
        print("WARNING: No serial ports detected.")
        return None

    for port_name in candidate_ports:
        try:
            return open_serial_port(port_name)
        except SerialException as error:
            print(f"WARNING: Could not open Arduino on {port_name}: {error}")

    print("Listing available ports:")
    for port in list_ports.comports():
        print(f"  {port.device} - {port.description}")
    return None


def send_to_arduino(arduino_serial, mode):
    """Send the mapped mode command to the Arduino."""
    if arduino_serial is None:
        print("No Arduino connected — skipping serial write.")
        return

    command = MODE_MAP.get(mode)
    if command is None:
        print(f"ERROR: Unknown mode {mode}, cannot send to Arduino.")
        return

    # Send the character ('1', '2', or '3')
    arduino_serial.write(command.encode("utf-8"))
    print(f"Sent '{command}' to Arduino -> {MODE_NAMES.get(mode, 'UNKNOWN')}")

    # Read Arduino's response
    time.sleep(0.1)
    if arduino_serial.in_waiting > 0:
        response = arduino_serial.readline().decode("utf-8").strip()
        if response:
            print(f"Arduino: {response}")


# ============================================================
#  RABBITMQ CONSUMER
# ============================================================
def callback(ch, method, properties, body, arduino_ser):
    """Called for every message from RabbitMQ."""
    # Parse the JSON message
    message = json.loads(body)
    mode = message.get("mode")

    # Output in the requested list format
    output = ["mode", mode]
    print(f"\nReceived from RabbitMQ: {message}")
    print(f"Output format: {output}")

    # Send to Arduino
    send_to_arduino(arduino_ser, mode)

    # Acknowledge the message
    ch.basic_ack(delivery_tag=method.delivery_tag)


def create_rabbitmq_connection():
    """Create a connection to RabbitMQ."""
    return pika.BlockingConnection(
        pika.ConnectionParameters(
            host=RABBITMQ_HOST,
            port=RABBITMQ_PORT,
            credentials=pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS),
            connection_attempts=5,
            retry_delay=5,
            blocked_connection_timeout=300,
        )
    )


def main():
    # --- Connect to Arduino ---
    arduino_serial = connect_arduino()

    # --- Connect to RabbitMQ ---
    max_retries = 10
    connection = None
    for attempt in range(1, max_retries + 1):
        try:
            print(f"Connecting to RabbitMQ (attempt {attempt}/{max_retries})...")
            connection = create_rabbitmq_connection()
            print("Connected to RabbitMQ!")
            break
        except AMQPConnectionError:
            if attempt == max_retries:
                print("ERROR: Could not connect to RabbitMQ after all retries.")
                sys.exit(1)
            print("RabbitMQ not ready, retrying in 5 seconds...")
            time.sleep(5)

    if connection is None:
        print("ERROR: RabbitMQ connection was not established.")
        sys.exit(1)

    channel = connection.channel()

    # Declare the same queue (idempotent)
    channel.queue_declare(queue=QUEUE_NAME, durable=True)

    # Fair dispatch: prefetch only 1 at a time
    channel.basic_qos(prefetch_count=1)

    # Start consuming — pass arduino_serial via
    # the callback's extra argument
    channel.basic_consume(
        queue=QUEUE_NAME,
        on_message_callback=lambda ch, method, props, body: callback(
            ch, method, props, body, arduino_serial
        ),
        auto_ack=False,
    )

    print("\nPython worker ready!")
    print("  RabbitMQ: listening on mode.queue")
    print(
        "  Arduino:  "
        + (f"{arduino_serial.port}" if arduino_serial else "NOT CONNECTED")
    )
    print("Press Ctrl+C to exit\n")
    channel.start_consuming()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nWorker stopped.")
