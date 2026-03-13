---
name: GitHub Auth Manager
description: Handles GitHub authentication using a token from a local keys.md file.
---

# GitHub Auth Manager

This skill ensures that all GitHub interactions are authenticated using the token stored in `keys.md`.

## Token Location
The token is located at: `/Users/sergejivanov2/Documents/Projects/Html/icefish/keys.md`
Format: `GITHUB_TOKEN=ghp_...`

## How to use
1. Always read the `keys.md` file before performing any GitHub-related operations (clone, push, pull).
2. Extract the `GITHUB_TOKEN` value.
3. For Git operations, use the token in the URL or via environment variables.
   - Example (URL): `git clone https://<TOKEN>@github.com/username/repo.git`
   - Example (Env): `export GITHUB_TOKEN=<TOKEN>` (if using `gh` CLI or similar)

## Git Clone Command Pattern
When cloning a repository like `IceFishingAd`:
```bash
git clone https://<TOKEN>@github.com/sergejivanov2/IceFishingAd.git
```
