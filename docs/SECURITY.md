# Security Model

> Security architecture and practices for CryptoShop Wallet.

---

## Threat Model

### Assets to Protect

| Asset | Sensitivity | Storage |
|-------|-------------|---------|
| Private key | 🔴 Critical | expo-secure-store (hardware keychain) |
| Mnemonic phrase | 🔴 Critical | expo-secure-store (hardware keychain) |
| Wallet address | 🟡 Public | React state / SecureStore |
| Transaction history | 🟢 Public (on-chain) | Not persisted locally |
| Network config | 🟢 Low | In-memory / constants |

### Threat Vectors

| Threat | Mitigation |
|--------|------------|
| Device theft | Keys in SecureStore (encrypted, hardware-backed). Biometric unlock (M4). |
| Malware / screen capture | Prevent screenshots on sensitive screens (M4). |
| Network MITM | HTTPS-only RPC endpoints. SSL pinning (M4). |
| Supply chain attack | Locked dependency versions. Minimal deps. |
| Memory dump | Keys loaded only during operations, not held in global state. |
| Phishing | Address validation before sending. Confirm dialogs. |

---

## Key Storage

### expo-secure-store

- Uses **iOS Keychain** (hardware-backed Secure Enclave on modern devices).
- Uses **Android EncryptedSharedPreferences** (backed by Android Keystore).
- Data is:
  - Encrypted at rest
  - Sandboxed to the app
  - Not included in device backups (by default)
  - Not accessible via USB debugging

### What We Store

| Key | Content | When Written |
|-----|---------|--------------|
| `crypto_shop_private_key` | Hex private key (0x...) | Wallet creation / import |
| `crypto_shop_mnemonic` | BIP-39 12-word phrase | Wallet creation / mnemonic import |

### What We Never Do

- ❌ Store keys in AsyncStorage
- ❌ Store keys in React state long-term
- ❌ Log keys to console
- ❌ Send keys over the network
- ❌ Include keys in error reports or analytics
- ❌ Store keys in plain-text files

---

## Transaction Security

1. **Input validation** — recipient address is validated via `ethers.isAddress()`.
2. **Amount validation** — checked against available balance before broadcasting.
3. **Confirmation dialog** — user must explicitly confirm with recipient + amount.
4. **Gas estimation** — displayed before confirmation.
5. **Error handling** — failed transactions show clear error, no funds lost.

---

## Network Security

- Default RPC endpoints use HTTPS.
- No sensitive data sent to RPC providers (only public tx data).
- Users can configure custom endpoints (Infura, Alchemy) via environment variables.
- Future: SSL certificate pinning for hardcoded endpoints.

---

## Build Security

- CI builds use GitHub Actions (isolated runners).
- APK signing keystore stored as GitHub Secret (never in repo).
- Dependencies are version-locked via `package-lock.json`.
- No post-install scripts in core library.

---

## Responsible Disclosure

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue.
2. Email: **security@zidanqai.dev** (or use GitHub private vulnerability reporting).
3. Include: description, steps to reproduce, potential impact.
4. We will acknowledge within 48 hours and provide a fix timeline.

See [SECURITY.md](../SECURITY.md) in the repo root for the full policy.

---

## Security Audit Status

| Area | Status | Notes |
|------|--------|-------|
| Key storage | ✅ Implemented | expo-secure-store |
| Input validation | ✅ Implemented | Address + amount checks |
| Confirmation dialogs | ✅ Implemented | Send, export, delete |
| Biometric unlock | 📋 Planned (M4) | |
| Screenshot prevention | 📋 Planned (M4) | |
| SSL pinning | 📋 Planned (M4) | |
| Third-party audit | 📋 Not started | |
