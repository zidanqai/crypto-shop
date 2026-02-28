# TASKS.md — CryptoShop Wallet

> Project task tracker organized by milestone. Check off items as completed.
> Priority: 🔴 Critical · 🟡 Important · 🟢 Nice-to-have

---

## Milestone 1: Core Library ✅

> Pure TypeScript wallet logic — no UI, no side effects.

- [x] 🔴 HD wallet generation (BIP-39 mnemonic + private key)
- [x] 🔴 Wallet restoration from private key
- [x] 🔴 Wallet restoration from mnemonic phrase
- [x] 🔴 Ethereum address validation (checksum-aware)
- [x] 🔴 ETH balance query via JSON-RPC
- [x] 🔴 Send ETH transaction (sign + broadcast)
- [x] 🟡 Unit tests with Vitest (generation, validation, restoration)
- [x] 🟡 TypeScript strict mode, declaration maps
- [x] 🟢 API documentation in docs/API.md

---

## Milestone 2: Mobile App MVP 🔄

> React Native (Expo) app with core wallet functionality.

- [x] 🔴 Expo project scaffold with Expo Router
- [x] 🔴 Tab navigation (Wallet, Send, Receive, Settings)
- [x] 🔴 Wallet creation flow (generate + store in SecureStore)
- [x] 🔴 Wallet dashboard — address display + ETH balance
- [x] 🔴 Send ETH screen — address input, amount, gas estimate, confirm
- [x] 🔴 Receive screen — QR code display, copy address, share
- [x] 🔴 Settings screen — network switch, export key, delete wallet
- [x] 🟡 Secure key storage via expo-secure-store
- [x] 🟡 Network provider service (mainnet + Sepolia)
- [x] 🟡 useWallet hook for state management
- [x] 🟡 Reusable UI components (Button, QRCode, TransactionCard)
- [x] 🟡 Dark theme with consistent design tokens
- [ ] 🟡 Wallet import flow (mnemonic + private key input screens)
- [ ] 🟡 Transaction history display
- [ ] 🟢 Pull-to-refresh balance
- [ ] 🟢 Haptic feedback on actions
- [ ] 🟢 Error boundary + crash handling

---

## Milestone 3: CI/CD Pipeline ✅

> Automated build, test, and release via GitHub Actions.

- [x] 🔴 Core library CI — test + build on push (Node 18/20/22 matrix)
- [x] 🔴 Mobile CI — build debug APK on push to `mobile/` paths
- [x] 🔴 Release workflow — build signed APK on version tag (`v*`)
- [x] 🔴 Upload APK as GitHub Release asset
- [x] 🟡 Auto-generated release notes
- [x] 🟡 Concurrency groups to prevent duplicate builds
- [x] 🟡 Path filters to avoid unnecessary CI runs
- [ ] 🟡 Keystore signing setup (requires GitHub Secrets)
- [ ] 🟢 Build status badges in README

---

## Milestone 4: Security Hardening 📋

> Harden the app for real-world self-custody use.

- [ ] 🔴 Biometric / PIN unlock before showing wallet
- [ ] 🔴 Encrypt mnemonic at rest (beyond SecureStore)
- [ ] 🔴 Transaction signing confirmation with amount + recipient
- [ ] 🟡 Auto-lock after N minutes of inactivity
- [ ] 🟡 Prevent screenshots on sensitive screens
- [ ] 🟡 SSL pinning for RPC calls
- [ ] 🟢 Security audit checklist

---

## Milestone 5: Polish & UX 📋

> Make the app feel production-ready and delightful.

- [ ] 🟡 Custom app icon and splash screen
- [ ] 🟡 Onboarding flow (welcome → create/import → backup mnemonic)
- [ ] 🟡 Light / dark theme toggle
- [ ] 🟡 Smooth animations (Reanimated)
- [ ] 🟡 Loading skeletons for balance + history
- [ ] 🟢 Localization (i18n) — English, Arabic
- [ ] 🟢 App Store / Play Store listing prep

---

## Milestone 6: Token Support (Future) 📋

> ERC-20 token management.

- [ ] 🟡 Token list (popular ERC-20 tokens)
- [ ] 🟡 Token balance display
- [ ] 🟡 Send ERC-20 tokens
- [ ] 🟡 Token approval management
- [ ] 🟢 Custom token import (by contract address)
- [ ] 🟢 NFT display (ERC-721 / ERC-1155)

---

## Milestone 7: Advanced Features (Future) 📋

> Power-user and ecosystem features.

- [ ] 🟢 WalletConnect v2 integration
- [ ] 🟢 DApp browser
- [ ] 🟢 Multi-wallet support
- [ ] 🟢 Address book / contacts
- [ ] 🟢 Push notifications for incoming tx
- [ ] 🟢 Fiat on-ramp integration
