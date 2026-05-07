import math
import random
import time

from .protocols import SensorProtocol


class MockSensor(SensorProtocol):
    def __init__(self, noise: float = 0.2) -> None:
        self._noise = noise
        self._start_time = time.time()
        self._base_distance = 10.0
        self._base_temperature = 25.0

    def read(self) -> tuple[float, float]:
        elapsed = time.time() - self._start_time
        drift = math.sin(elapsed * 0.1) * 0.3
        distance = self._base_distance + drift + random.gauss(0, self._noise)
        temperature = self._base_temperature + random.gauss(0, 0.1)
        return (round(distance, 2), round(temperature, 2))
