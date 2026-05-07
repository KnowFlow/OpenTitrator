import { useState, useCallback, useEffect } from "react";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./components/dashboard/Dashboard";
import { SensorPage } from "./components/sensor/SensorPage";
import { PumpPage } from "./components/pump/PumpPage";
import { MotorPage } from "./components/motor/MotorPage";
import { TitrationPage } from "./components/titration/TitrationPage";
import { ExperimentList } from "./components/experiment/ExperimentList";
import { SettingsPage } from "./components/settings/SettingsPage";
import { useWebSocket } from "./hooks/useWebSocket";
import { useSensorData } from "./hooks/useSensorData";
import { useTitration } from "./hooks/useTitration";
import { stopMotor } from "./api/motor";
import { stopTitration } from "./api/titration";
import client from "./api/client";

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [hardwareMode, setHardwareMode] = useState("mock");
  const [positionCm, setPositionCm] = useState(10.0);
  const { lastMessage, connected, send } = useWebSocket();
  const { readings, latest } = useSensorData(lastMessage);
  const { state: titrationState, steps, endpoint, currentVolume, reset: resetTitration } = useTitration(lastMessage);

  useEffect(() => {
    client.get("/health").then(({ data }) => setHardwareMode(data.hardware_mode)).catch(() => {});
  }, []);

  useEffect(() => {
    if (lastMessage?.type === "sensor_data" && lastMessage.payload.position_cm !== undefined) {
      setPositionCm(lastMessage.payload.position_cm as number);
    }
  }, [lastMessage]);

  const handleEmergencyStop = useCallback(async () => {
    await stopMotor();
    await stopTitration();
    send({ type: "command", payload: { action: "emergency_stop" } });
  }, [send]);

  let content;
  switch (page) {
    case "sensor":
      content = <SensorPage readings={readings} latest={latest} />;
      break;
    case "pump":
      content = <PumpPage />;
      break;
    case "motor":
      content = <MotorPage positionCm={positionCm} moving={false} />;
      break;
    case "titration":
      content = <TitrationPage state={titrationState} steps={steps} endpoint={endpoint} currentVolume={currentVolume} onReset={resetTitration} />;
      break;
    case "experiments":
      content = <ExperimentList />;
      break;
    case "settings":
      content = <SettingsPage />;
      break;
    default:
      content = <Dashboard latest={latest} positionCm={positionCm} titrationState={titrationState} onEmergencyStop={handleEmergencyStop} />;
  }

  return (
    <Layout activePage={page} onNavigate={setPage} hardwareMode={hardwareMode} connected={connected}>
      {content}
    </Layout>
  );
}
