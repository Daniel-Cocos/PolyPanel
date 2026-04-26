import json
import sys
import time

import pika
import serial
import serial.tools.list_ports

RABBITMQ_CONFIG = {
    "host": "localhost",
    "port": 5673,
    "credentials": ("guest", "guest"),
    "connection_attempts": 5,
    "retry_delay": 5,
    "blocked_connection_timeout": 300,
}

ARDUINO_CONFIG = {
    "port": "/dev/ttyUSB0",
    "baudrate": 9600,
    "timeout": 1,
}

QUEUE_NAME = "mode.queue"

MODE_MAP = {
    0: "1",
    1: "2",
    2: "3",
}

MODE_NAMES = {
    0: "SUN TRACKING",
    1: "RAIN SHIELD (90 Degrees)",
    2: "OPEN ROOF (0 Degrees)",
}

RABBITMQ_MAX_RETRIES = 10
RABBITMQ_RETRY_DELAY = 5
ARDUINO_RESET_DELAY = 2


def connect_arduino():
    try:
        ser = serial.Serial(**ARDUINO_CONFIG)
        time.sleep(ARDUINO_RESET_DELAY)
        ser.reset_input_buffer()
        print(f"Arduino connected on {ARDUINO_CONFIG['port']}")
        return ser
    except serial.SerialException as e:
        print(f"WARNING: Could not open Arduino on {ARDUINO_CONFIG['port']}: {e}")
        print("Listing available ports:")
        for p in serial.tools.list_ports.comports():
            print(f"  {p.device} - {p.description}")
        return None


def send_to_arduino(arduino_serial, mode):
    if arduino_serial is None:
        print("No Arduino connected — skipping serial write.")
        return

    command = MODE_MAP.get(mode)
    if command is None:
        print(f"ERROR: Unknown mode {mode}, cannot send to Arduino.")
        return

    arduino_serial.write(command.encode("utf-8"))
    print(f"Sent '{command}' to Arduino -> {MODE_NAMES.get(mode, 'UNKNOWN')}")

    time.sleep(0.1)
    if arduino_serial.in_waiting > 0:
        response = arduino_serial.readline().decode("utf-8").strip()
        if response:
            print(f"Arduino: {response}")


def handle_message(ch, method, properties, body, arduino_serial):
    message = json.loads(body)
    mode = message.get("mode")

    print(f"\nReceived from RabbitMQ: {message}")
    print(f"Output format: {['mode', mode]}")

    send_to_arduino(arduino_serial, mode)
    ch.basic_ack(delivery_tag=method.delivery_tag)


def create_rabbitmq_connection():
    return pika.BlockingConnection(
        pika.ConnectionParameters(
            host=RABBITMQ_CONFIG["host"],
            port=RABBITMQ_CONFIG["port"],
            credentials=pika.PlainCredentials(*RABBITMQ_CONFIG["credentials"]),
            connection_attempts=RABBITMQ_CONFIG["connection_attempts"],
            retry_delay=RABBITMQ_CONFIG["retry_delay"],
            blocked_connection_timeout=RABBITMQ_CONFIG["blocked_connection_timeout"],
        )
    )


def connect_rabbitmq():
    for attempt in range(1, RABBITMQ_MAX_RETRIES + 1):
        try:
            print(f"Connecting to RabbitMQ (attempt {attempt}/{RABBITMQ_MAX_RETRIES})...")
            return create_rabbitmq_connection()
        except pika.exceptions.AMQPConnectionError:
            if attempt == RABBITMQ_MAX_RETRIES:
                print("ERROR: Could not connect to RabbitMQ after all retries.")
                sys.exit(1)
            print("RabbitMQ not ready, retrying in 5 seconds...")
            time.sleep(RABBITMQ_RETRY_DELAY)


def start_consuming(channel, arduino_serial):
    channel.queue_declare(queue=QUEUE_NAME, durable=True)
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(
        queue=QUEUE_NAME,
        on_message_callback=lambda ch, method, props, body:
            handle_message(ch, method, props, body, arduino_serial),
        auto_ack=False,
    )

    port_status = ARDUINO_CONFIG["port"] if arduino_serial else "NOT CONNECTED"
    print(f"  RabbitMQ: listening on {QUEUE_NAME}")
    print(f"  Arduino:  {port_status}")
    print("Press Ctrl+C to exit\n")

    channel.start_consuming()


def main():
    arduino_serial = connect_arduino()
    connection = connect_rabbitmq()
    print("Connected to rabbitMQ")
    start_consuming(connection.channel(), arduino_serial)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nWorker stopped.")
