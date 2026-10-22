.PHONY: lint test frontend-lint frontend-build screenshots

lint: frontend-lint

# No unit tests yet; a production build is the smoke test.
test: frontend-build

frontend-lint:
	cd frontend && npm run lint

frontend-build:
	cd frontend && npm run build

# Regenerates the README screenshots; needs a browser and repo-helper.
screenshots:
	$(MAKE) -wC var/marketing/screenshots
