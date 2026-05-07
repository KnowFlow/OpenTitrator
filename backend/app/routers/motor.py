from fastapi import APIRouter, Request

router = APIRouter(prefix="/api/motor", tags=["motor"])


@router.get("/position")
async def get_motor_position(request: Request) -> dict:
    hardware = request.app.state.hardware
    position = hardware.motor.get_position()
    return {
        "position_cm": position,
        "moving": hardware.motor.is_moving(),
    }


@router.post("/move-to")
async def move_motor(request: Request) -> dict:
    body = await request.json()
    target_cm = float(body.get("target_cm", 10.0))
    hardware = request.app.state.hardware
    hardware.motor.move_to(target_cm)
    return {"target_cm": target_cm, "moving": True}


@router.post("/stop")
async def stop_motor(request: Request) -> dict:
    hardware = request.app.state.hardware
    hardware.motor.stop()
    return {"position_cm": hardware.motor.get_position(), "moving": False}
