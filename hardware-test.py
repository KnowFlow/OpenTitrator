# -*- coding: UTF-8 -*-
import logging
import time

from pinpong.board import Board, Pin, Servo
from pinpong.libs.dfrobot_urm09 import URM09

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# --- Constants ---
URM09_I2C_ADDR = 0x11
URM09_MEASURE_MODE = URM09._MEASURE_MODE_AUTOMATIC
URM09_MEASURE_RANGE = URM09._MEASURE_RANG_500

PIN_PWM_DOWN = Pin.D8
PIN_PWM_UP = Pin.D9
PIN_ACID_PUMP = Pin.D11
PIN_ALKALI_PUMP = Pin.D12
PIN_TEST_PUMP = Pin.D13

DISTANCE_MIN = 2
DISTANCE_MAX = 19
POSITION_TOLERANCE = 0.5
SERVO_STEP_DELAY = 2.0
SENSOR_READ_INTERVAL = 0.5
MOVE_MAX_ITERATIONS = 1000


def init_board() -> None:
    try:
        Board("leonardo").begin()
    except Exception as exc:
        logging.error("Board initialization failed: %s", exc)
        raise


def init_sensor() -> URM09:
    try:
        urm = URM09(i2c_addr=URM09_I2C_ADDR)
        urm.set_mode_range(URM09_MEASURE_MODE, URM09_MEASURE_RANGE)
        return urm
    except Exception as exc:
        logging.error("Sensor initialization failed: %s", exc)
        raise


def init_pwm_pins() -> tuple[Pin, Pin]:
    pwm_down = Pin(PIN_PWM_DOWN, Pin.OUT)
    pwm_up = Pin(PIN_PWM_UP, Pin.OUT)
    return pwm_down, pwm_up


def init_pumps() -> tuple[Servo, Servo, Servo]:
    acid_pump = Servo(Pin(PIN_ACID_PUMP))
    alkali_pump = Servo(Pin(PIN_ALKALI_PUMP))
    test_pump = Servo(Pin(PIN_TEST_PUMP))
    return acid_pump, alkali_pump, test_pump


def test_pump(pump: Servo, name: str) -> None:
    for angle in (0, 90, 180, 90):
        pump.write_angle(angle)
        time.sleep(SERVO_STEP_DELAY)
    logging.info("%s pump tested", name)


def test_all_pumps(acid_pump: Servo, alkali_pump: Servo, test_pump: Servo) -> None:
    test_pump(alkali_pump, "alkali")
    test_pump(test_pump, "test")
    test_pump(acid_pump, "acid")


def read_sensor(urm: URM09) -> tuple[float, float]:
    distance = urm.distance_cm()
    temperature = urm.temp_c()
    return distance, temperature


def move_to(
    target: int,
    urm: URM09,
    pwm_down: Pin,
    pwm_up: Pin,
) -> None:
    current_distance, _ = read_sensor(urm)

    if target < DISTANCE_MIN or target > DISTANCE_MAX:
        logging.warning(
            "Target %d out of range [%d, %d], using current distance %.1f",
            target, DISTANCE_MIN, DISTANCE_MAX, current_distance,
        )
        target = int(current_distance)

    for _ in range(MOVE_MAX_ITERATIONS):
        if abs(target - current_distance) <= POSITION_TOLERANCE:
            break
        current_distance, _ = read_sensor(urm)
        diff = target - current_distance

        if diff > 0:
            pwm_down.write_digital(1)
            pwm_up.write_digital(0)
            logging.info("down %.1f", current_distance)
        elif diff < 0:
            pwm_down.write_digital(0)
            pwm_up.write_digital(1)
            logging.info("up %.1f", current_distance)
    else:
        logging.warning("move_to timed out after %d iterations", MOVE_MAX_ITERATIONS)

    pwm_down.write_digital(0)
    pwm_up.write_digital(0)
    time.sleep(0.5)
    logging.info("stop at %.1f", current_distance)


def main() -> None:
    init_board()
    urm = init_sensor()
    pwm_down, pwm_up = init_pwm_pins()
    acid_pump, alkali_pump, test_pump = init_pumps()

    try:
        while True:
            distance, temperature = read_sensor(urm)
            logging.info("Distance: %.1f cm | Temperature: %.2f °C", distance, temperature)
            time.sleep(SENSOR_READ_INTERVAL)

            test_all_pumps(acid_pump, alkali_pump, test_pump)

            try:
                user_input = input("Enter target distance (or 'q' to quit): ")
            except (EOFError, KeyboardInterrupt):
                logging.info("Exiting...")
                break

            if user_input.strip().lower() == "q":
                logging.info("Exiting...")
                break

            try:
                target = int(user_input)
            except ValueError:
                logging.warning("Invalid input '%s', please enter a number", user_input)
                continue

            move_to(target, urm, pwm_down, pwm_up)

    except KeyboardInterrupt:
        logging.info("Interrupted, exiting...")


if __name__ == "__main__":
    main()
