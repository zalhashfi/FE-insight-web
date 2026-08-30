# Contributing to FE-insight-web

## Branch Naming

Branch per-issue using the `issue-<number>` format:

```bash
git checkout -b issue-7
```

For exploratory or long-running work, prefix with `feature/` or `docs/`:

```bash
git checkout -b docs/improve-readme
git checkout -b feature/new-chart
```

## Issue Templates

Use the templates under `.github/ISSUE_TEMPLATE/`:

| Template | When to use |
|---|---|
| `task.md` | Planned work, enhancements, refactors |
| `bug.md` | Defects, incorrect behavior |

Fill every section of the chosen template — especially **Acceptance Criteria** — before submitting.

## Pull Request Format

1. **Open against `main`** from your `issue-<number>` branch.
2. **Link to the issue** in the PR description with `Closes #<number>`.
3. **Describe changes** briefly — what changed, why.
4. **Include a test plan** — how you verified the change works.
5. **Keep the diff focused** — one issue per PR.

## Git Commit Standard

- Author is always `zalhashfi <211019493+zalhashfi@users.noreply.github.com>`.
- **Strictly no** `Co-authored-by` trailer or bot attribution.
- Write concise, imperative commit messages: `fix: correct OTA version comparison` (not `Fixed the thing`).

## Quality Gates

The CI `build-and-test` job must pass before a PR is merged:

```bash
# Verify locally before pushing
npm run build
npm test
```

Both must exit with code 0.
