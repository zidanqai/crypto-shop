# Release Process

> How to cut a new release of CryptoShop Wallet with automated APK builds.

---

## Overview

Releases are triggered by **git tags** matching `v*` (e.g., `v1.0.0`, `v1.2.3`).
When a tag is pushed, the `release.yml` GitHub Actions workflow:

1. Checks out the code at the tagged commit
2. Sets up Node 20 + Java 17 + Android SDK
3. Runs `expo prebuild` to generate the native Android project
4. Builds a release APK via Gradle
5. Signs the APK (if keystore secrets are configured)
6. Creates a GitHub Release with auto-generated release notes
7. Uploads the APK as a release asset

---

## Step-by-Step

### 1. Ensure tests pass

```bash
cd packages/core && npm test
```

### 2. Bump version numbers

Update **both** of these:

| File | Field | Example |
|------|-------|---------|
| `mobile/app.json` | `expo.version` | `"1.2.0"` |
| `mobile/app.json` | `expo.android.versionCode` | `3` (increment by 1) |

```bash
# Edit mobile/app.json
# "version": "1.2.0"
# "versionCode": 3
```

### 3. Commit and tag

```bash
git add .
git commit -m "chore: bump version to v1.2.0"
git tag v1.2.0
```

### 4. Push with tags

```bash
git push origin main --tags
```

### 5. Verify

1. Go to **Actions** tab → watch `Release: Build & Publish APK` workflow.
2. Once complete, go to **Releases** → verify the new release exists.
3. Download the APK and test on a device.

---

## Setting Up APK Signing

To produce signed release APKs, configure these GitHub Secrets:

### Generate a keystore

```bash
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore crypto-shop.keystore \
  -alias crypto-shop \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD
```

### Add secrets to GitHub

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|--------|-------|
| `ANDROID_KEYSTORE_BASE64` | `base64 -w 0 crypto-shop.keystore` |
| `ANDROID_KEY_ALIAS` | `crypto-shop` |
| `ANDROID_KEY_PASSWORD` | Your key password |
| `ANDROID_STORE_PASSWORD` | Your store password |

> ⚠️ **Never commit the keystore file.** It's in `.gitignore`.

---

## Versioning Convention

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (v2.0.0) — breaking changes, major UX overhaul
- **MINOR** (v1.1.0) — new features, backward-compatible
- **PATCH** (v1.0.1) — bug fixes, minor improvements

Android `versionCode` increments by 1 with every release, regardless of
semver bump.

---

## Release Checklist

- [ ] All tests pass (`npm test`)
- [ ] Version bumped in `mobile/app.json`
- [ ] `versionCode` incremented
- [ ] Changelog / notable changes documented in commit messages
- [ ] Tag created and pushed
- [ ] GitHub Actions workflow succeeded
- [ ] APK downloads and installs correctly
- [ ] Release notes are accurate
