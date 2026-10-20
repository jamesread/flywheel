# Marketing screenshots

The PNGs in this directory are the screenshots used in the project README.
They are generated, not hand-made, so anyone can regenerate them.

## Regenerate

```bash
make -C var/marketing/screenshots   # or `make screenshots` from the repo root
```

This:

1. installs frontend dependencies if needed;
2. starts a throwaway Vite dev server on `127.0.0.1:18400`;
3. for each screenshot, resets the browser's `localStorage` to the fictional
   habits in [`seed/`](seed/) (Flywheel is client-side only, so that is all
   of its state) and captures the page with `repo-helper screenshot`;
4. writes `screenshot-manifest.yaml` from `screenshots.ini`;
5. stops the dev server, even if a step failed.

Requirements: `repo-helper`, Chromium/Chrome with a matching `chromedriver`,
Node.js/npm, `jq` and `curl`. No containers are needed.

Only the date shown in the app changes between runs.

## Adding or changing a screenshot

Edit `screenshots.ini`. Every section needs `title` and `description` (and
`theme = dark` for dark variants), which become the README captions and
`screenshot-manifest.yaml`. That manifest is a well-known path read by
indexers. It is generated, so never edit it by hand; run `make` (or
`make manifest` if only the text changed).

## Browsing the seeded app

```bash
make up      # dev server on http://127.0.0.1:18400/
make down
```

The seed is applied by the capture scripts, not the server, so a browser you
open yourself starts empty.
