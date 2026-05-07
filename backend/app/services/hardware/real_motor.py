import logging
import time

from ...config import Settings

logger = logging.getLogger(__name__)


class RealMotor:
    """PWM motor via pinpong. Only works with real hardware connected."""

    def __init__(self, config: Settings) -> None:
        from pinpong.board import Board, Pin

        Board("leonardo").begin()
        self._pwm_down = Pin(Pin.D8, Pin.OUT)
        self._pwm_up = Pin(Pin.D9, Pin.OUT)
        self._position: float = 10.0
        self._moving: bool = False
        self._config = config
        logger.info("Real motor initialized")

    def move_to(self, target_cm: float) -> None:
        clamped = max(self._config.distance_min, min(self._config.distance_max, target_cm))
        self._moving = True
        for _ in range(self._config.move_max_iterations):
            if abs(clamped - self._position) <= self._config.position_tolerance:
                break
            diff = clamped - self._position
            if diff > 0:
                self._pwm_down.write_digital(1)
                self._pwm_up.write_digital(0)
            elif diff < 0:
                self._pwm_down.write_digital(0)
                self._pwm_up.write_digital(1)
            time.sleep(0.1)
            self._position += (1 if diff > 0 else -1) * 0.1
        self.stop()

    def get_position(self) -> float:
        return round(self._position, 2)

    def stop(self) -> None:
        self._pwm_down.write_digital(0)
        self._pwm_up.write_digital(0)
        self._moving = False

    def is_moving(self) -> bool:
        return self._moving
