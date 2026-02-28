# Architecture — CryptoShop Wallet

> System architecture and data flow for the CryptoShop Wallet project.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App (Expo)                     │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌─────────┐  ┌─────────┐ │
│  │  Wallet   │  │   Send   │  │ Receive │  │Settings │ │
│  │  Screen   │  │  Screen  │  │ Screen  │  │ Screen  │ │
│  └────┬─────┘  └────┬─────┘  └────┬────┘  └────┬────┘ │
│       │              │             │             │      │
│  ┌────┴──────────────┴─────────────┴─────────────┴───┐ │
│  │              React Hooks Layer                     │ │
│  │              (useWallet, useNetwork)                │ │
│  └────────────────────┬──────────────────────────────┘ │
│                       │                                 │
│  ┌────────────────────┴──────────────────────────────┐ │
│  │             Services Layer                         │ │
│  │  ┌──────────────┐  ┌───────────────┐              │ │
│  │  │ wallet.ts    │  │ provider.ts   │              │ │
│  │  │ (CRUD, tx)   │  │ (RPC config)  │              │ │
│  │  └──────┬───────┘  └───────┬───────┘              │ │
│  └─────────┼──────────────────┼──────────────────────┘ │
│            │                  │                         │
│  ┌─────────┴──────┐  ┌───────┴─────────┐              │
│  │ SecureStore     │  │   ethers.js     │              │
│  │ (Key Storage)   │  │ (Blockchain)    │              │
│  └────────────────┘  └────────┬────────┘              │
└───────────────────────────────┼────────────────────────┘
                                │
                    ┌───────────┴───────────┐
                    │   Ethereum Network    │
                    │  (Mainnet / Sepolia)  │
                    └───────────────────────┘
```

---

## Layer Responsibilities

### 1. UI Layer (Screens)

| Screen | File | Responsibility |
|--------|------|----------------|
| Wallet | `app/(tabs)/index.tsx` | Dashboard — balance, address, quick actions |
| Send | `app/(tabs)/send.tsx` | Address input, amount, gas estimation, broadcast |
| Receive | `app/(tabs)/receive.tsx` | QR code display, copy/share address |
| Settings | `app/(tabs)/settings.tsx` | Network switch, key export, wallet deletion |

- Screens are **thin** — they call hooks and render UI.
- No direct blockchain or storage access from screens.

### 2. Hooks Layer

| Hook | Responsibility |
|------|----------------|
| `useWallet()` | Wallet state (address, balance, loading), CRUD operations, send ETH |

- Bridges services → UI.
- Manages React state and side effects.
- Handles loading/error states.

### 3. Services Layer

| Service | Responsibility |
|---------|----------------|
| `wallet.ts` | Wallet CRUD (create, import, load, delete), balance fetch, send tx |
| `provider.ts` | Network config (mainnet/sepolia), `JsonRpcProvider` caching |

- **Pure business logic** — no React imports.
- Handles SecureStore persistence and ethers.js interactions.

### 4. Core Library (`packages/core/`)

- **Standalone TypeScript package** — zero UI or React Native dependencies.
- Exposes: `createWallet()`, `walletFromMnemonic()`, `walletFromPrivateKey()`,
  `validateWalletAddress()`, `getBalance()`, `sendTransaction()`.
- Can be used independently (CLI, backend, other apps).
- Published as `@crypto-shop/core`.

---

## Data Flow: Wallet Creation

```
User taps "Create New Wallet"
        │
        ▼
  useWallet.createNewWallet()
        │
        ▼
  wallet.createAndStoreWallet()
        │
        ├── Wallet.createRandom()          → generates HD wallet
        ├── SecureStore.setItemAsync(pk)    → stores private key
        └── SecureStore.setItemAsync(mn)    → stores mnemonic
        │
        ▼
  Returns WalletData { address, privateKey, mnemonic }
        │
        ▼
  Hook updates React state → UI re-renders with wallet info
```

## Data Flow: Send ETH

```
User enters recipient + amount → taps "Send"
        │
        ▼
  Validation (address format, balance check)
        │
        ▼
  Confirmation Alert
        │
        ▼
  useWallet.sendEth(to, amount)
        │
        ▼
  wallet.sendEthTransaction(privateKey, to, amount)
        │
        ├── new Wallet(pk, provider)       → creates signer
        ├── signer.sendTransaction(tx)     → broadcasts to network
        └── response.wait()                → waits for confirmation
        │
        ▼
  Returns TransactionResult { hash, from, to, value, blockNumber }
        │
        ▼
  Success Alert with tx hash → balance refreshed
```

---

## Security Architecture

```
┌─────────────────────────────┐
│     Application Layer       │
│  (screens, hooks, services) │
│         │                   │
│    Never stores keys in     │
│    React state long-term    │
└────────┬────────────────────┘
         │
┌────────┴────────────────────┐
│   expo-secure-store         │
│   ─────────────────         │
│   • Hardware-backed keychain│
│   • Encrypted at rest       │
│   • Per-app sandboxed       │
│   • Keys:                   │
│     - crypto_shop_private_key│
│     - crypto_shop_mnemonic  │
└─────────────────────────────┘
```

**Key principles:**
- Private keys exist in memory only during active operations.
- SecureStore uses the platform's hardware-backed keychain (Keychain on iOS,
  EncryptedSharedPreferences on Android).
- No key material is ever logged, transmitted, or persisted outside SecureStore.

---

## CI/CD Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│ Push to       │     │ Push to       │     │ Push tag         │
│ packages/core │     │ mobile/       │     │ v*               │
└──────┬───────┘     └──────┬───────┘     └──────┬───────────┘
       │                    │                     │
       ▼                    ▼                     ▼
  ┌─────────┐        ┌───────────┐         ┌───────────────┐
  │ ci.yml  │        │mobile-ci  │         │ release.yml   │
  │         │        │  .yml     │         │               │
  │ • test  │        │ • prebuild│         │ • prebuild    │
  │ • build │        │ • gradle  │         │ • gradle rel. │
  │ • matrix│        │ • upload  │         │ • sign APK    │
  │   18/20 │        │   artifact│         │ • gh release  │
  │   /22   │        │           │         │ • upload APK  │
  └─────────┘        └───────────┘         └───────────────┘
```
