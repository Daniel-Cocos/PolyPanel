import pika
import json
import time
import sys
import serial
import serial.tools.list_ports

# ============================================================
#  CONFIGURATION — adjust these to match your setup
# ============================================================
RABBITMQ_HOST = "localhost"
RABBITMQ_PORT = 5673
RABBITMQ_USER = "guest"
RABBITMQ_PASS = "guest"
QUEUE_NAME    = "mode.queue"

# Arduino serial port — change to match your system:
#   Linux:   "/dev/ttyUSB0" or "/dev/ttyACM0"
#   macOS:   "/dev/cu.usbmodem1101"
#   Windows: "COM3"
ARDUINO_PORT  = "/dev/ttyUSB0"
ARDUINO_BAUD  = 9600


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
def connect_arduino():
    """Try to open the Arduino serial port."""
    try:
        ser = serial.Serial(
            port=ARDUINO_PORT,
            baudrate=ARDUINO_BAUD,
            timeout=1,
        )
        # Wait for Arduino to reset after serial connect
        time.sleep(2)
        ser.reset_input_buffer()
        print(f"Arduino connected on {ARDUINO_PORT}")
        return ser
    except serial.SerialException as e:
        print(f"WARNING: Could not open Arduino "
              f"on {ARDUINO_PORT}: {e}")
        print("Listing available ports:")
        ports = serial.tools.list_ports.comports()
        for p in ports:
            print(f"  {p.device} - {p.description}")
        return None


def send_to_arduino(arduino_serial, mode):
    """Send the mapped mode command to the Arduino."""
    if arduino_serial is None:
        print("No Arduino connected — "
              "skipping serial write.")
        return

    command = MODE_MAP.get(mode)
    if command is None:
        print(f"ERROR: Unknown mode {mode}, "
              f"cannot send to Arduino.")
        return

    # Send the character ('1', '2', or '3')
    arduino_serial.write(command.encode("utf-8"))
    print(f"Sent '{command}' to Arduino "
          f"-> {MODE_NAMES.get(mode, 'UNKNOWN')}")

    # Read Arduino's response
    time.sleep(0.1)
    if arduino_serial.in_waiting > 0:
        response = arduino_serial.readline() \
                    .decode("utf-8").strip()
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
            credentials=pika.PlainCredentials(
                RABBITMQ_USER, RABBITMQ_PASS
            ),
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
            print(f"Connecting to RabbitMQ "
                  f"(attempt {attempt}/{max_retries})...")
            connection = create_rabbitmq_connection()
            print("Connected to RabbitMQ!")
            break
        except pika.exceptions.AMQPConnectionError:
            if attempt == max_retries:
                print("ERROR: Could not connect to "
                      "RabbitMQ after all retries.")
                sys.exit(1)
            print("RabbitMQ not ready, "
                  "retrying in 5 seconds...")
            time.sleep(5)

    channel = connection.channel()

    # Declare the same queue (idempotent)
    channel.queue_declare(queue=QUEUE_NAME, durable=True)

    # Fair dispatch: prefetch only 1 at a time
    channel.basic_qos(prefetch_count=1)

    # Start consuming — pass arduino_serial via
    # the callback's extra argument
    channel.basic_consume(
        queue=QUEUE_NAME,
        on_message_callback=lambda ch, method, props, body:
            callback(ch, method, props, body, arduino_serial),
        auto_ack=False,
    )

    print("\nPython worker ready!")
    print("  RabbitMQ: listening on mode.queue")
    print("  Arduino:  "
          + (f"{ARDUINO_PORT}" if arduino_serial
             else "NOT CONNECTED"))
    print("Press Ctrl+C to exit\n")
    channel.start_consuming()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nWorker stopped.")
