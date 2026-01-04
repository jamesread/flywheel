# Flywheel - Habit Tracker

A simple, client-side only Progressive Web App (PWA) built with Vue 3 and Vite to help you build habits.

## Features

- **Two Modes:**
  - **Check List** (default): View and tick off your habits for today
  - **Add to List**: Add new habits or delete existing ones

- **Daily Tracking**: Ticks are stored per day in local storage
- **PWA Support**: Installable as a Progressive Web App
- **Modern UI**: Clean, responsive design with dark mode support

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How to Use

1. **Add Habits**: Switch to "Add to List" mode and enter habit names (e.g., "Brush Teeth")
2. **Track Daily**: Switch to "Check List" mode (default) and tick off completed habits for today
3. **Manage Habits**: In "Add to List" mode, you can delete habits you no longer want to track

All data is stored locally in your browser's local storage.

## Docker

### Build Docker Image

```bash
docker build -t flywheel-frontend .
```

### Run Docker Container

```bash
docker run -p 8080:80 flywheel-frontend
```

The app will be available at `http://localhost:8080`

### Using GitHub Container Registry

After the GitHub Actions workflow runs, you can pull and run the image:

```bash
# Login to ghcr.io (if needed)
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull the image
docker pull ghcr.io/OWNER/REPO/flywheel-frontend:latest

# Run the container
docker run -p 8080:80 ghcr.io/OWNER/REPO/flywheel-frontend:latest
```

Replace `OWNER/REPO` with your GitHub username and repository name.

## Tech Stack

- Vue 3 (Composition API)
- Vite
- vite-plugin-pwa
- Local Storage API
- Docker & Nginx (for production)
