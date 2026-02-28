# agents.md — CryptoShop Wallet

> AI agent instructions for working on this repository. Read this file in full
> before making any changes. It contains project structure, conventions, security
> rules, and step-by-step guides for common tasks.

---

## 1. Project Overview

**CryptoShop Wallet** is an open-source, self-custody Ethereum wallet shipped as
a React Native (Expo) mobile app with a shared TypeScript core library.

| Layer | Path | Purpose |
|-------|------|---------|
| Core library | `packages/core/` | Pure-TypeScript wallet logic (generate, validate, sign, broadcast). Zero UI dependencies. |
| Mobile app | `mobile/` | React Native (Expo) app with Expo Router, tab navigation, send/receive ETH, QR codes. |
| CI / CD | `.github/workflows/` | Three pipelines — core tests, mobile APK build, versioned release with APK assets. |
| Docs | `docs/` | Architecture, setup, release, security, task tracking. |

## 2. Tech Stack

- **Language:** TypeScript 5 (strict mode)
- **Core deps:** ethers v6
- **Mobile:** Expo SDK 52, React Native, Expo Router, expo-secure-store
- **Testing:** Vitest (core), Jest + React Native Testing Library (mobile)
- **CI:** GitHub Actions (Node 20, Java 17, Android SDK)
- **Package management:** npm workspaces (root → packages/core, mobile)

## 3. Repository Structure

```
/
├── packages/
│   └── core/                      # @crypto-shop/core
│       ├── src/
│       │   ├── wallet.ts          # Wallet generation, import, balance, tx
│       │   └── index.ts           # Public API re-exports
│       ├── tests/
│       │   └── wallet.test.ts     # Unit tests (Vitest)
│       ├── package.json
│       └── tsconfig.json
├── mobile/                        # React Native Expo app
│   ├── app/
│   │   ├── _layout.tsx            # Root layout (Stack)
│   │   └── (tabs)/
│   │       ├── _layout.tsx        # Tab navigator
│   │       ├── index.tsx          # Wallet dashboard
│   │       ├── send.tsx           # Send ETH screen
│   │       ├── receive.tsx        # Receive / QR screen
│   │       └── settings.tsx       # Settings screen
│   ├── components/                # Reusable UI components
│   ├── hooks/                     # React hooks (useWallet, etc.)
│   ├── services/                  # Business logic (wallet, provider)
│   ├── constants/                 # Theme, colors, spacing
│   ├── assets/                    # Icons, splash, images
│   ├── app.json                   # Expo config
│   ├── package.json
│   └── tsconfig.json
├── docs/                          # Project documentation
│   ├── TASKS.md                   # Task tracker by milestone
│   ├── ARCHITECTURE.md            # System architecture
│   ├── SETUP.md                   # Developer setup guide
│   ├── RELEASE.md                 # Release process
│   ├── SECURITY.md                # Security model
│   └── API.md                     # Core library API reference
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                 # Core: build & test
│   │   ├── mobile-ci.yml         # Mobile: build APK on push
│   │   └── release.yml            # Release: APK on version tag
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── FUNDING.yml
├── agents.md                      # ← You are here
├── README.md
├── LICENSE
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── .gitignore
```

## 4. Conventions

### Code Style
- **Strict TypeScript** — no `any` unless absolutely necessary (document why).
- **Named exports** — avoid default exports except for React screen components.
- **Barrel exports** — each package has an `index.ts` that re-exports the public API.
- **Functional style** — prefer pure functions in core; React hooks in mobile.
- **ESM-friendly** — core compiles to CommonJS but avoids CommonJS-only patterns.

### Naming
- Files: `kebab-case.ts` for utilities, `PascalCase.tsx` for React components.
- Functions: `camelCase` — verb-first (`createWallet`, `fetchBalance`).
- Types/Interfaces: `PascalCase` — noun-based (`WalletInfo`, `TransactionResult`).
- Constants: `UPPER_SNAKE_CASE` for env-level, `PascalCase` for theme objects.

### Git
- Branch naming: `feat/`, `fix/`, `docs/`, `chore/`, `refactor/`.
- Commit messages: conventional commits (`feat:`, `fix:`, `docs:`, `ci:`, `chore:`).
- PRs: always reference an issue or explain the "why".
- Tags: `v{major}.{minor}.{patch}` for releases (e.g. `v1.2.0`).

## 5. Security Rules

> These are NON-NEGOTIABLE. Violating any of these should block a PR.

1. **Never log private keys or mnemonics** — not in console, not in error messages,
   not in analytics, not in crash reports. Period.
2. **SecureStore only** — private keys and mnemonics are stored ONLY via
   `expo-secure-store` (hardware-backed keychain). Never AsyncStorage, never
   filesystem, never state that persists to disk.
3. **Mnemonic shown once** — after wallet creation, the mnemonic is shown to the
   user for backup. It is then encrypted and stored, never displayed again unless
   explicitly re-authenticated.
4. **Confirm destructive actions** — sending ETH, exporting keys, deleting wallet
   all require explicit user confirmation with clear warning text.
5. **No hardcoded secrets** — RPC API keys, keystores, etc. come from environment
   variables or GitHub Secrets. Never commit them.
6. **Validate all inputs** — addresses, amounts, and transaction parameters are
   validated before any blockchain interaction.

## 6. How to Add Features

### Adding a new core function
1. Write the function in `packages/core/src/wallet.ts` (or a new file).
2. Export it from `packages/core/src/index.ts`.
3. Add tests in `packages/core/tests/`.
4. Run `cd packages/core && npm test` to verify.
5. Update `docs/API.md` with the new function signature and examples.

### Adding a new mobile screen
1. Create the screen file in `mobile/app/(tabs)/` or a nested route.
2. Add navigation entry in `mobile/app/(tabs)/_layout.tsx`.
3. If it needs wallet data, use the `useWallet()` hook.
4. If it needs new business logic, add it to `mobile/services/`.
5. Use components from `mobile/components/` — create new ones as needed.
6. Follow the existing theme tokens from `mobile/constants/theme.ts`.

### Adding a new CI job
1. Create or edit a workflow in `.github/workflows/`.
2. Use path filters to avoid unnecessary runs.
3. Add concurrency groups to prevent duplicate builds.
4. Test locally with `act` if possible before pushing.

## 7. Testing Strategy

| Layer | Framework | Location | Command |
|-------|-----------|----------|---------|
| Core unit tests | Vitest | `packages/core/tests/` | `cd packages/core && npm test` |
| Mobile unit tests | Jest + RNTL | `mobile/__tests__/` | `cd mobile && npm test` |
| E2E (future) | Detox | `mobile/e2e/` | TBD |

- **Core:** Test every exported function. Mock `ethers` provider for network calls.
- **Mobile:** Test hooks and services. Component tests for critical UI interactions.
- **CI:** All tests run automatically on push via GitHub Actions.

## 8. Release Process

1. Ensure all tests pass on `main`.
2. Update `mobile/app.json` — bump `version` and `android.versionCode`.
3. Commit: `git commit -m "chore: bump version to X.Y.Z"`.
4. Tag: `git tag vX.Y.Z`.
5. Push: `git push origin main --tags`.
6. GitHub Actions automatically builds the APK and creates a GitHub Release
   with the APK attached as an asset.
7. Verify the release at `https://github.com/zidanqai/crypto-shop/releases`.

## 9. Environment Variables

| Variable | Used In | Purpose |
|----------|---------|---------|
| `ANDROID_KEYSTORE_BASE64` | CI (release.yml) | Base64-encoded Android keystore |
| `ANDROID_KEY_ALIAS` | CI (release.yml) | Key alias for APK signing |
| `ANDROID_KEY_PASSWORD` | CI (release.yml) | Key password for APK signing |
| `ANDROID_STORE_PASSWORD` | CI (release.yml) | Keystore password |
| `RPC_URL_MAINNET` | Mobile app (optional) | Custom mainnet RPC endpoint |
| `RPC_URL_SEPOLIA` | Mobile app (optional) | Custom testnet RPC endpoint |

## 10. Useful Commands

```bash
# Core library
cd packages/core && npm install && npm test && npm run build

# Mobile app
cd mobile && npm install && npx expo start

# Build Android APK locally
cd mobile && npx expo prebuild --platform android && cd android && ./gradlew assembleDebug

# Create a release
git tag v1.0.0 && git push origin --tags
```
