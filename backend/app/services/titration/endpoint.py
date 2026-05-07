import numpy as np

from ...models.titration import EndpointResult


def find_endpoint(
    volumes: list[float],
    readings: list[float],
    threshold: float = 0.3,
) -> EndpointResult | None:
    if len(volumes) < 3:
        return None

    vol = np.array(volumes)
    read = np.array(readings)

    dvol = np.diff(vol)
    first_deriv = np.diff(read) / dvol
    vol_mid = (vol[:-1] + vol[1:]) / 2.0

    if len(first_deriv) < 2:
        return None

    dvol2 = np.diff(vol_mid)
    second_deriv = np.diff(first_deriv) / dvol2

    max_idx = int(np.argmax(np.abs(first_deriv)))
    if np.abs(first_deriv[max_idx]) < threshold:
        return None

    endpoint_volume = float(vol_mid[max_idx])
    endpoint_reading = float(read[max_idx])
    endpoint_fd = float(first_deriv[max_idx])
    endpoint_sd = float(second_deriv[min(max_idx, len(second_deriv) - 1)])

    return EndpointResult(
        volume_ml=round(endpoint_volume, 4),
        reading=round(endpoint_reading, 4),
        first_deriv=round(endpoint_fd, 4),
        second_deriv=round(endpoint_sd, 4),
    )
