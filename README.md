# PolyPanel <a href="https://daniel-cocos.github.io/PolyPanel/"><img align="right" alt="Live Demo" src="https://img.shields.io/badge/Live_Demo-24292f?style=for-the-badge"></a>

A practical route to solar on working farmland.

## Product Demo

### Prototype showcase

Below you can see a video of the prototype we made. This prototype makes use of 3D-printed components and uses an Arduino board to power and control the panel movement. The design also includes various sensors for measuring crop metrics, along with three panel modes: sun tracking, letting sunlight in, and shielding crops from the sun.

<p align="center">
  <img src="assets/PolyPanel.gif" alt="Prototype demo">
</p>

### Dashboard showcase

Below you can see a video of our product dashboard. This dashboard allows users to link to and control already built panels. It also allows for the creation of proposed panels and the running of calculations using historical data to generate reports on solar panel performance and how our infrastructure could affect crop yield. This helps when presenting proposals to farmers and local councils to support planning permission applications.

<p align="center">
  <img src="assets/dashboard.gif" alt="Dashboard demo">
</p>

## Installation & Usage 

### Prerequisites

- Docker
- Docker Compose
- Make

### Getting Started

1. Clone the repository.
2. Start the full local stack:

```bash
make run
```

3. Open the frontend at `http://localhost:5173`.
4. The backend API will be available at `http://localhost:8080`.

## Technical details

### Tech Stack

- Frontend: React 19, TypeScript, Vite, React Router, MUI
- Backend: Spring Boot 4, Java 25, Spring AMQP, Springdoc OpenAPI
- Messaging: RabbitMQ
- Data: PostgreSQL
- Worker: Python with `pika` and `pyserial`
- Hardware: Arduino
- DevOps: Docker, Docker Compose, Make

### Architecture

```
┌--------------┐     ┌---------------┐     ┌----------┐      ┌--------┐      ┌---------┐
│   Frontend   │<--->│    Backend    │<--->│ RabbitMQ │ <--->│ Python │ <--->│ Arduino │
│  (React/Vite)│     │ (Spring Boot) │     └----------┘      │ Worker │      └---------┘
└--------------┘     └-------┬-------┘                       └--------┘
                             │
                      ┌------------┐
                      │ PostgreSQL │
                      └------------┘
```

## Contributors

[![GitHub](https://img.shields.io/badge/GitHub-Sonny_Pullen-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=24292f)](https://github.com/Sonny-Pullen)

[![GitHub](https://img.shields.io/badge/GitHub-Aleksander_Tacconi-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=24292f)](https://github.com/Aleks-Tacconi)

[![GitHub](https://img.shields.io/badge/GitHub-Daniel_Cocos-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=24292f)](https://github.com/Daniel-Cocos)
