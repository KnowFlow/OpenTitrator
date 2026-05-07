import { useState, useEffect, useCallback } from "react";
import type { WsMessage } from "../types/websocket";
import type { TitrationState, TitrationStep, EndpointResult } from "../types/titration";
import { getTitrationStatus } from "../api/titration";

export function useTitration(lastMessage: WsMessage | null) {
  const [state, setState] = useState<TitrationState>("idle");
  const [steps, setSteps] = useState<TitrationStep[]>([]);
  const [endpoint, setEndpoint] = useState<EndpointResult | null>(null);
  const [currentVolume, setCurrentVolume] = useState(0);

  useEffect(() => {
    if (!lastMessage) return;

    if (lastMessage.type === "titration_data_point") {
      const p = lastMessage.payload;
      setSteps((prev) => [
        ...prev,
        { volume_ml: p.volume_ml as number, reading: p.reading as number, timestamp: lastMessage.timestamp },
      ]);
      setCurrentVolume(p.volume_ml as number);
    }

    if (lastMessage.type === "endpoint_detected") {
      const p = lastMessage.payload;
      setEndpoint({
        volume_ml: p.volume_ml as number,
        reading: p.reading as number,
        first_deriv: p.first_deriv as number,
        second_deriv: p.second_deriv as number,
      });
      setState("endpoint_detected");
    }

    if (lastMessage.type === "titration_status") {
      const p = lastMessage.payload;
      setState(p.state as TitrationState);
    }
  }, [lastMessage]);

  const refreshStatus = useCallback(async () => {
    try {
      const status = await getTitrationStatus();
      setState(status.state);
      setCurrentVolume(status.current_volume);
    } catch {
      // ignore
    }
  }, []);

  const reset = useCallback(() => {
    setState("idle");
    setSteps([]);
    setEndpoint(null);
    setCurrentVolume(0);
  }, []);

  return { state, steps, endpoint, currentVolume, refreshStatus, reset };
}
