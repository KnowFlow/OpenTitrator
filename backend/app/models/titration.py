from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum

from .pump import PumpType


class TitrationState(str, Enum):
    IDLE = "idle"
    POSITIONING = "positioning"
    READY = "ready"
    TITRATING = "titrating"
    ENDPOINT_DETECTED = "endpoint_detected"
    COMPLETE = "complete"
    ERROR = "error"


@dataclass(frozen=True)
class TitrationConfig:
    pump_id: PumpType
    step_volume_ml: float = 0.5
    max_volume_ml: float = 50.0
    endpoint_threshold: float = 0.3
    settling_time_s: float = 1.0


@dataclass(frozen=True)
class TitrationStep:
    volume_ml: float
    reading: float
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())


@dataclass(frozen=True)
class EndpointResult:
    volume_ml: float
    reading: float
    first_deriv: float
    second_deriv: float


@dataclass(frozen=True)
class TitrationResult:
    config: TitrationConfig
    steps: tuple[TitrationStep, ...]
    endpoint: EndpointResult | None
    state: TitrationState
    started_at: str
    completed_at: str | None = None


@dataclass(frozen=True)
class TitrationStatus:
    state: TitrationState
    current_volume: float
    step_count: int
    total_steps: int
