# OpenTitrator
OpenTitrator is an Open Source Titrator for everyone.

This project aims to create an open source automatic titrator that everyone can use.

## Principle
The automatic titrator measures the ion concentration by measuring the change in electrode potential.

First select the appropriate indicator electrode and reference electrode to form a working battery with the measured solution, and then add the titrant.

During the titration process, due to a chemical reaction, the concentration of the measured ion is constantly changing, so the potential of the indicator electrode changes accordingly.

Near the end of the titration, the concentration of the measured ion has a sudden change, causing a jump in the electrode potential. Therefore, the end of the titration can be determined according to the jump in the electrode potential and the measurement result is given.
## Features
* Use open source hardware
* Adopt Python as the main programming language
* Open structure drawings
## Advantage
* High-performance, low-cost
* Easy to source, quick to assemble
* Lab-ready customisation

## Application scenario
* Laboratory automation
* Dedicated titration
* Integration test

## Open source agreement
The MIT protocol is adopted.
## Support
This project has benefited from the support from the following funders:

* DFRobot（www.dfrobot.com)
* Mushroom Cloud Maker Space（www.mushroomcloud.cc）




---
# 开源滴定仪

本项目旨在打造一款人人可用的开源的自动滴定仪。
## 原理
全自动滴定仪是通过测量电极电位变化，来测量离子浓度。

首先选用适当的指示电极和参比电极，与被测溶液组成一个工作电池，然后加入滴定剂。

在滴定过程中，由于发生化学反应，被测离子的浓度不断发生变化，因而指示电极的电位随之变化。

在滴定终点附近，被测离子的浓度发生突变，引起电极电位的突跃，因此根据电极电位的突跃可确定滴定终点，并给出测定结果。


## 特点
* 采用开源硬件
* 采用Python作为主要编程语言
* 开放结构图纸
## 优势
* 成本可控
* 可扩展性强
* 易用性高
* 应用广泛
## 应用场景
* 实验室自动化
* 专用滴定
* 集成测试

## 开源协议
采用MIT协议。

## Quick Start

### Backend

```bash
cd backend
pip install -e .
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API docs available at http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

### Configuration

The system runs in **mock mode** by default (no hardware needed). To use real hardware, set the environment variable:

```bash
OT_HARDWARE_MODE=real uvicorn app.main:app
```

| Variable | Default | Description |
|----------|---------|-------------|
| `OT_HARDWARE_MODE` | `mock` | `mock` or `real` |
| `OT_SENSOR_READ_INTERVAL` | `0.5` | Sensor read interval (seconds) |
| `OT_DISTANCE_MIN` | `2.0` | Min motor position (cm) |
| `OT_DISTANCE_MAX` | `19.0` | Max motor position (cm) |
| `OT_DATABASE_PATH` | `data/opentitrator.db` | SQLite database path |

### Language

Click the language toggle button in the top-right corner to switch between English and Chinese.

## 感谢
该项目得到了以下资助者的支持:

* DFRobot（www.dfrobot.com)
* Mushroom Cloud Maker Space（www.mushroomcloud.cc）


