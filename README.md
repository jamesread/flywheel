<div align = "center">
  <img alt = "Flywheel logo" src = "https://raw.githubusercontent.com/jamesread/flywheel/main/frontend/public/icon.svg" width = "128" />
  <h1>Flywheel</h1>

  A simple, client-side only Progressive Web App (PWA) for building habits.
</div>

## Features

- ✅ Add and track daily habits
- 📱 Installable PWA
- 💾 Local storage (no backend required)
- 🌙 Dark mode support
- 🤖 Automated releases with semantic versioning

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

## Development

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). Commit messages must follow the format:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `build`: Build system changes
- `ci`: CI configuration changes
- `chore`: Other changes

**Examples:**
```bash
feat: add dark mode toggle
fix(ui): resolve checkbox alignment issue
docs: update installation instructions
```

### Pre-commit Hooks

Pre-commit hooks are automatically installed and will:
- Check for trailing whitespace
- Validate commit message format
- Check YAML/JSON syntax
- Detect merge conflicts

### Releases

Releases are automated using [semantic-release](https://semantic-release.gitbook.io/). Simply push commits following the conventional commit format to `main`, and releases will be created automatically based on the commit types.

## Docker

```bash
docker run -p 8080:80 ghcr.io/jamesread/flywheel/flywheel-frontend:latest
```

## Tech Stack

- Vue 3 + Vite
- PWA (vite-plugin-pwa)
- Docker + Nginx
- Semantic Release
- Commitlint + Pre-commit

See [frontend/README.md](./frontend/README.md) for detailed documentation.
