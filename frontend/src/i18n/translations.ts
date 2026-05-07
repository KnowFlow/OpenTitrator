export type Lang = "en" | "zh";

const translations = {
  en: {
    // Nav
    nav_dashboard: "Dashboard",
    nav_sensor: "Sensor",
    nav_pumps: "Pumps",
    nav_motor: "Motor",
    nav_titration: "Titration",
    nav_experiments: "Experiments",
    nav_settings: "Settings",

    // Header
    connected: "Connected",
    disconnected: "Disconnected",

    // Dashboard
    dashboard_title: "Dashboard",
    dashboard_distance: "Distance",
    dashboard_temperature: "Temperature",
    dashboard_motor_position: "Motor Position",
    dashboard_titration_state: "Titration State",
    dashboard_emergency_stop: "EMERGENCY STOP",
    dashboard_unit_cm: "cm",
    dashboard_unit_celsius: "°C",

    // Sensor
    sensor_title: "Sensor Data",
    sensor_current_distance: "Current Distance",
    sensor_current_temperature: "Current Temperature",
    sensor_realtime_chart: "Real-Time Chart",
    sensor_distance_label: "Distance (cm)",
    sensor_temperature_label: "Temperature (°C)",

    // Pump
    pump_title: "Pump Control",
    pump_acid: "Acid Pump",
    pump_alkali: "Alkali Pump",
    pump_test: "Test Pump",
    pump_dispense: "Dispense",
    pump_unit_ml: "mL",

    // Motor
    motor_title: "Motor Control",
    motor_current_position: "Current Position",
    motor_move_to: "Move To Position",
    motor_target: "Target (cm)",
    motor_move: "Move",
    motor_stop: "Stop",
    motor_moving: "MOVING",
    motor_stopped: "STOPPED",

    // Titration
    titration_title: "Titration",
    titration_config: "Configuration",
    titration_pump: "Pump",
    titration_step_volume: "Step Volume (mL)",
    titration_max_volume: "Max Volume (mL)",
    titration_endpoint_threshold: "Endpoint Threshold",
    titration_start: "Start",
    titration_stop: "Stop",
    titration_reset: "Reset",
    titration_status: "Status",
    titration_volume: "Volume",
    titration_steps: "Steps",
    titration_endpoint_detected: "Endpoint Detected",
    titration_reading: "Reading",
    titration_first_deriv: "1st Deriv",
    titration_second_deriv: "2nd Deriv",
    titration_curve: "Titration Curve",
    titration_endpoint: "Endpoint",

    // Experiment
    experiment_title: "Experiments",
    experiment_refresh: "Refresh",
    experiment_empty: "No experiments yet. Run a titration to create one.",
    experiment_readings: "readings",
    experiment_delete: "Delete",

    // Settings
    settings_title: "Settings",
    settings_system_config: "System Configuration",
    settings_env_vars: "Environment Variables",
    settings_env_desc: 'Override settings with "OT_" prefix environment variables.',
    settings_env_example: 'to switch to real hardware mode.',

    // General
    loading: "Loading...",
  },
  zh: {
    nav_dashboard: "控制面板",
    nav_sensor: "传感器",
    nav_pumps: "泵控制",
    nav_motor: "电机控制",
    nav_titration: "滴定",
    nav_experiments: "实验记录",
    nav_settings: "设置",

    connected: "已连接",
    disconnected: "未连接",

    dashboard_title: "控制面板",
    dashboard_distance: "距离",
    dashboard_temperature: "温度",
    dashboard_motor_position: "电机位置",
    dashboard_titration_state: "滴定状态",
    dashboard_emergency_stop: "紧急停止",
    dashboard_unit_cm: "cm",
    dashboard_unit_celsius: "°C",

    sensor_title: "传感器数据",
    sensor_current_distance: "当前距离",
    sensor_current_temperature: "当前温度",
    sensor_realtime_chart: "实时图表",
    sensor_distance_label: "距离 (cm)",
    sensor_temperature_label: "温度 (°C)",

    pump_title: "泵控制",
    pump_acid: "酸液泵",
    pump_alkali: "碱液泵",
    pump_test: "测试泵",
    pump_dispense: "注射",
    pump_unit_ml: "mL",

    motor_title: "电机控制",
    motor_current_position: "当前位置",
    motor_move_to: "移动到指定位置",
    motor_target: "目标位置 (cm)",
    motor_move: "移动",
    motor_stop: "停止",
    motor_moving: "运行中",
    motor_stopped: "已停止",

    titration_title: "滴定",
    titration_config: "配置",
    titration_pump: "泵",
    titration_step_volume: "步进体积 (mL)",
    titration_max_volume: "最大体积 (mL)",
    titration_endpoint_threshold: "终点阈值",
    titration_start: "开始",
    titration_stop: "停止",
    titration_reset: "重置",
    titration_status: "状态",
    titration_volume: "体积",
    titration_steps: "步数",
    titration_endpoint_detected: "终点已检测",
    titration_reading: "读数",
    titration_first_deriv: "一阶导数",
    titration_second_deriv: "二阶导数",
    titration_curve: "滴定曲线",
    titration_endpoint: "终点",

    experiment_title: "实验记录",
    experiment_refresh: "刷新",
    experiment_empty: "暂无实验记录。运行一次滴定以创建记录。",
    experiment_readings: "条数据",
    experiment_delete: "删除",

    settings_title: "设置",
    settings_system_config: "系统配置",
    settings_env_vars: "环境变量",
    settings_env_desc: "使用 OT_ 前缀的环境变量覆盖配置。",
    settings_env_example: "切换到真实硬件模式。",

    loading: "加载中...",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];

export function t(lang: Lang, key: TranslationKey): string {
  return translations[lang][key];
}
