# Regenerates marketing screenshots against a throwaway frontend seeded with
# fictional habits. Run `make` here; everything is torn down afterwards.
#
# Flywheel is client-side only (all state is in the browser's localStorage),
# so there are no database or broker containers: the "stack" is a Vite dev
# server on a non-default port, and the seed is applied in the browser by
# scripts/seed.py from the files in seed/.

ROOT := $(abspath ../../..)
HERE := $(abspath .)
TMP := $(HERE)/tmp

FRONTEND_PORT := 18400
FRONTEND_URL := http://127.0.0.1:$(FRONTEND_PORT)/

.PHONY: all build up seed shoot manifest publish down clean

all:
	@$(MAKE) build up seed shoot manifest publish; rc=$$?; $(MAKE) down; exit $$rc

build:
	[ -d $(ROOT)/frontend/node_modules ] || (cd $(ROOT)/frontend && npm ci)

up:
	mkdir -p $(TMP)
	cd $(ROOT)/frontend && { npx vite --host 127.0.0.1 --port $(FRONTEND_PORT) --strictPort > $(TMP)/frontend.log 2>&1 & echo $$! > $(TMP)/frontend.pid; }
	@for i in $$(seq 60); do curl -fsS $(FRONTEND_URL) >/dev/null 2>&1 && exit 0; sleep 1; done; \
		echo "Frontend did not start; see $(TMP)/frontend.log"; exit 1

# Seed data lives in the browser, so it is loaded per capture by
# scripts/seed.py. This only checks the seed files are valid.
seed:
	jq -e 'length > 0' seed/habits.json >/dev/null
	jq -e '.ticked_today | length > 0' seed/ticks.json >/dev/null

shoot:
	repo-helper screenshot --config screenshots.ini

manifest:
	./generate-manifest.py

# The README references var/marketing/screenshots/*.png directly and there is
# no docs site, so there is nothing to copy.
publish:
	@true

down:
	-@for p in frontend; do \
		[ -f $(TMP)/$$p.pid ] && pkill -P $$(cat $(TMP)/$$p.pid) 2>/dev/null; \
		[ -f $(TMP)/$$p.pid ] && kill $$(cat $(TMP)/$$p.pid) 2>/dev/null; \
		rm -f $(TMP)/$$p.pid; done

clean: down
	rm -rf $(TMP)
