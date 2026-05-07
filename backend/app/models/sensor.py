from dataclasses import dataclass, field
from datetime import datetime


@dataclass(frozen=True)
class SensorReading:
    distance_cm: float
    temperature_c: float
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())


@dataclass(frozen=True)
class SensorHistory:
    readings: tuple[SensorReading, ...]
    count: int
