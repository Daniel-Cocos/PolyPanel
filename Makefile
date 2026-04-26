COMPOSE := docker compose --profile full

.PHONY: run down logs ps

run:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps
