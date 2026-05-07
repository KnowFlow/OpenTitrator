from fastapi import APIRouter, Request

from ..models.pump import PumpType

router = APIRouter(prefix="/api/pump", tags=["pump"])


@router.post("/{pump_id}/angle")
async def set_pump_angle(pump_id: PumpType, request: Request) -> dict:
    body = await request.json()
    angle = int(body.get("angle", 90))
    angle = max(0, min(180, angle))
    hardware = request.app.state.hardware
    pump = hardware.pumps[pump_id.value]
    pump.set_angle(angle)
    return {"pump_type": pump_id.value, "angle": pump.get_angle()}


@router.post("/{pump_id}/dispense")
async def dispense_pump(pump_id: PumpType, request: Request) -> dict:
    body = await request.json()
    volume_ml = float(body.get("volume_ml", 0.5))
    hardware = request.app.state.hardware
    pump = hardware.pumps[pump_id.value]
    from ..services.hardware.mock_pump import MockPump
    if isinstance(pump, MockPump):
        pump.add_dispensed(volume_ml)
    return {"pump_type": pump_id.value, "dispensed_ml": pump.get_dispensed()}


@router.get("/{pump_id}/state")
async def get_pump_state(pump_id: PumpType, request: Request) -> dict:
    hardware = request.app.state.hardware
    pump = hardware.pumps[pump_id.value]
    return {
        "pump_type": pump_id.value,
        "angle": pump.get_angle(),
        "dispensed_ml": pump.get_dispensed(),
    }
