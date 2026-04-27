# PolyPanel

> Sun tracking moving soloar panels

![Demo](assets/PolyPanel.gif)

**Live Demo:** [https://daniel-cocos.github.io/PolyPanel/](https://daniel-cocos.github.io/PolyPanel/)


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


