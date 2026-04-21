# Versioning Rule

Before **every push**, increment project version by `+1` patch.

## Format
- Use semantic versioning: `MAJOR.MINOR.PATCH`
- For normal development pushes, increase `PATCH` by 1

## Frontend Projects (npm)
1. Run: `npm version patch --no-git-tag-version`
2. Commit updated `package.json` and `package-lock.json` together with code changes
3. Push