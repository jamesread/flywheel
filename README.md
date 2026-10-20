<div align = "center">
  <img alt = "Flywheel logo" src = "https://raw.githubusercontent.com/jamesread/flywheel/main/logo.svg" width = "128" />
  <h1>Flywheel</h1>

  A simple, client-side only Progressive Web App (PWA) for building habits.
</div>

## Features

- Add and track daily habits
- Installable PWA
- Local storage (no backend required)
- Dark mode support
- Automated releases with semantic versioning

## Screenshots

### Today's habits

![Today's habits](var/marketing/screenshots/home.png)

Tick off each habit as you complete it today. Completed habits turn green, so you can see at a glance what is left.

### Edit your habit list

![Edit your habit list](var/marketing/screenshots/edit.png)

Add new habits, drag them into the order you do them, or remove the ones you no longer need.

### On your phone

<img alt="On your phone" src="var/marketing/screenshots/mobile.png" width="390" />

Flywheel is an installable Progressive Web App, so it works like a native app on your phone. Your habits stay on your device, with no account or server.

### Dark mode

![Dark mode](var/marketing/screenshots/home-dark.png)

Flywheel follows your system's light or dark setting automatically.

Screenshots use fictional test data and are regenerated with `make screenshots`
(see [`var/marketing/screenshots`](var/marketing/screenshots/README.md)).

## Quick Start

```bash
docker run -p 8080:80 ghcr.io/jamesread/flywheel:latest
```

The app will be available at `http://localhost:8080`.

See [frontend/README.md](./frontend/README.md) for detailed documentation.
