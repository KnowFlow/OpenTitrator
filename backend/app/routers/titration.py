from fastapi import APIRouter, Request

from ..models.pump import PumpType
from ..models.titration import TitrationConfig, TitrationState

router = APIRouter(prefix="/api/titration", tags=["titration"])


@router.post("/start")
async def start_titration(request: Request) -> dict:
    body = await request.json()
    config = TitrationConfig(
        pump_id=PumpType(body.get("pump_id", "acid")),
        step_volume_ml=float(body.get("step_volume_ml", 0.5)),
        max_volume_ml=float(body.get("max_volume_ml", 50.0)),
        endpoint_threshold=float(body.get("endpoint_threshold", 0.3)),
        settling_time_s=float(body.get("settling_time_s", 1.0)),
    )
    engine = request.app.state.titration_engine
    await engine.start(config)
    return {"state": "titrating", "config": config.__dict__}


@router.post("/stop")
async def stop_titration(request: Request) -> dict:
    engine = request.app.state.titration_engine
    await engine.stop()
    return {"state": "idle"}


@router.get("/status")
async def get_titration_status(request: Request) -> dict:
    engine = request.app.state.titration_engine
    status = engine.get_status()
    return status.__dict__
