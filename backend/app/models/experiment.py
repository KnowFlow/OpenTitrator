from dataclasses import dataclass, field
from datetime import datetime

from .titration import EndpointResult, TitrationConfig, TitrationStep


@dataclass(frozen=True)
class Experiment:
    id: str
    name: str
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    config: TitrationConfig | None = None
    status: str = "running"
    steps: tuple[TitrationStep, ...] = ()
    endpoint: EndpointResult | None = None
    notes: str = ""


@dataclass(frozen=True)
class ExperimentListItem:
    id: str
    name: str
    created_at: str
    status: str
    step_count: int
