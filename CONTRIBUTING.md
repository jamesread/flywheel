# Contributing to Flywheel

## Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning and releases.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

### Examples

```bash
feat: add dark mode support
fix(ui): resolve checkbox alignment issue
docs: update installation instructions
refactor(storage): simplify local storage utilities
chore: update dependencies
```

## Pre-commit Hooks

Pre-commit hooks are automatically installed and will run on every commit to:
- Check for trailing whitespace
- Validate commit message format
- Check YAML/JSON syntax
- Detect merge conflicts
- Check for large files

## Releases

Releases are automatically created using [semantic-release](https://semantic-release.gitbook.io/) when you push commits to `main` that follow the conventional commit format.

- `feat:` commits trigger a **minor** version bump
- `fix:` commits trigger a **patch** version bump
- Commits with `BREAKING CHANGE:` in the footer trigger a **major** version bump

The release process will:
1. Analyze commits since the last release
2. Determine the next version number
3. Generate release notes
4. Create a GitHub release
5. Update CHANGELOG.md
6. Update package.json version
