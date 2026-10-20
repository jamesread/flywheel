.PHONY: screenshots

# Regenerates the README screenshots; needs a browser and repo-helper.
screenshots:
	$(MAKE) -wC var/marketing/screenshots
