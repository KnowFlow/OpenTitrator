from dataclasses import dataclass
from enum import Enum


class PumpType(str, Enum):
    ACID = "acid"
    ALKALI = "alkali"
    TEST = "test"


@dataclass(frozen=True)
class PumpState:
    pump_type: PumpType
    angle: int
    dispensed_ml: float
