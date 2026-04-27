# PolyPanel <a href="https://daniel-cocos.github.io/PolyPanel/"><img align="right" alt="Live Demo" src="https://img.shields.io/badge/Live_Demo-24292f?style=for-the-badge"></a>

> Sun tracking moving soloar panels

![Demo](assets/PolyPanel.gif)
![Demo](assets/dashboard.gif)

## Quick Start

```bash
make run
```

## Architecture

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
