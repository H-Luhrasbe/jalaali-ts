# 📦 Release Guide for jalaali-ts

This document explains everything required to release a new version of **jalaali-ts**.

---

## 🚀 1. Normal Development Flow

1. Create a new feature/fix branch:
   ```
   git checkout -b feat-new-converter
   ```
2. Write code as usual.
3. Commit using **Conventional Commits**:
   ```
   feat: add reverse conversion helper
   fix: incorrect parsing logic
   refactor: simplify div function
   ```
4. Push and open a Pull Request into `main`.
5. CI automatically runs:
   - lint
   - prettier
   - tests
   - build
6. Merge when CI passes.

---

## 🧠 2. Versioning is Automatic

You do **not** run:
- `npm version`
- `npm publish`
- manual tags
- manual CHANGELOG updates

**Release Please handles everything.**

After merging a PR into `main`, Release Please creates a special PR:

```
chore: release 1.2.0
```

This PR includes:
- updated package.json version  
- updated CHANGELOG.md  
- release notes  

Merging this PR → triggers npm publish.

---

## 📦 3. Publishing is Automatic (CD)

When the release PR is merged:

1. GitHub creates a tag (example: `v1.2.0`)
2. GitHub Actions publishes to npm
3. New version is available instantly

You never manually publish.

---

## 💥 4. Releasing Breaking Changes (Major Versions)

If you must release a breaking change:

```
feat: rename conversion APIs

BREAKING CHANGE: Old APIs have been removed.
```

Release Please automatically bumps:

```
1.x.x → 2.0.0
```

---

## 📋 5. Major Release Checklist (v2+)

- [ ] API review complete  
- [ ] Deprecation warnings added  
- [ ] README updated  
- [ ] Migration guide written  
- [ ] Tests updated  
- [ ] Breaking changes documented  
- [ ] Release note preview checked  

---

## 🧯 6. How to Trigger a Manual Release

Almost never needed.

But if you want to manually push a release:

```
git tag v1.8.0
git push origin v1.8.0
```

This bypasses Release Please and publishes instantly.

---

## 🗂 7. Important Files Overview

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | CI pipeline |
| `.github/workflows/release-please.yml` | Automated versioning + changelog |
| `.github/workflows/publish.yml` | Auto-publish to npm when tag created |
| `commitlint.config.cjs` | Commitlint rules |
| `.husky/commit-msg` | Commit message validator |
| `.github/release.yml` | Release notes template |
| `.husky/pre-commit` | Lint / formatting hooks |

---

## 🛠 8. Commands You’ll Use Often

Install deps:
```
npm ci
```

Run tests:
```
npm test
```

Lint:
```
npm run lint
```

Format:
```
npm run format
```

Build:
```
npm run build
```

---

## ✅ 9. Summary

**This repo now has fully automated CI/CD.**  
Just push → merge PR → Release Please → npm publish.

Your workflow is now as professional as top OSS projects 🚀

