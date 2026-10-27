SHELL := /bin/bash
PORT ?= 4321
PID_FILE := .dev.pid
LOG_FILE := .dev.log

.PHONY: dev stop
.DEFAULT_GOAL := dev

dev:
	@PORT_PIDS=$$(lsof -ti :$(PORT) 2>/dev/null || true); \
	if [ -n "$$PORT_PIDS" ]; then \
		echo "Dev server is already running (PID: $$(echo $$PORT_PIDS | tr '\n' ' ')) on http://127.0.0.1:$(PORT)"; \
		echo "Logs: tail -f $(LOG_FILE)"; \
		exit 0; \
	fi; \
	pnpm astro dev stop >/dev/null 2>&1 || true; \
	echo "Starting dev server in background..."; \
	if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		. "$$HOME/.nvm/nvm.sh" && nvm use >/dev/null 2>&1 || true; \
	fi; \
	nohup pnpm dev > "$(LOG_FILE)" 2>&1 & \
	PNPM_PID=$$!; \
	echo "$$PNPM_PID" > "$(PID_FILE)"; \
	sleep 1.5; \
	PORT_PIDS=$$(lsof -ti :$(PORT) 2>/dev/null || true); \
	if [ -n "$$PORT_PIDS" ]; then \
		echo "$$PORT_PIDS" > "$(PID_FILE)"; \
		echo "Dev server started successfully!"; \
		echo "  - Local URL: http://127.0.0.1:$(PORT)"; \
		echo "  - PID:       $$(echo $$PORT_PIDS | tr '\n' ' ')"; \
		echo "  - Logs:      tail -f $(LOG_FILE)"; \
	elif kill -0 "$$PNPM_PID" 2>/dev/null; then \
		echo "Dev server is launching (PID: $$PNPM_PID)..."; \
		echo "  - Local URL: http://127.0.0.1:$(PORT)"; \
		echo "  - Logs:      tail -f $(LOG_FILE)"; \
	else \
		echo "Failed to start dev server. Check $(LOG_FILE):"; \
		cat "$(LOG_FILE)"; \
		rm -f "$(PID_FILE)"; \
		exit 1; \
	fi

stop:
	@STOPPED=0; \
	pnpm astro dev stop >/dev/null 2>&1 && STOPPED=1 || true; \
	if [ -f "$(PID_FILE)" ]; then \
		for pid in $$(cat "$(PID_FILE)"); do \
			if kill -0 "$$pid" 2>/dev/null; then \
				kill "$$pid" 2>/dev/null || true; \
				STOPPED=1; \
			fi; \
		done; \
		rm -f "$(PID_FILE)"; \
	fi; \
	PORT_PIDS=$$(lsof -ti :$(PORT) 2>/dev/null || true); \
	if [ -n "$$PORT_PIDS" ]; then \
		kill $$PORT_PIDS 2>/dev/null || true; \
		sleep 0.5; \
		REMAINING=$$(lsof -ti :$(PORT) 2>/dev/null || true); \
		if [ -n "$$REMAINING" ]; then \
			kill -9 $$REMAINING 2>/dev/null || true; \
		fi; \
		STOPPED=1; \
	fi; \
	if [ "$$STOPPED" -eq 1 ]; then \
		echo "Dev server stopped."; \
	else \
		echo "No dev server is currently running."; \
	fi
