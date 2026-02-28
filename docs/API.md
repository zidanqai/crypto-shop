# API Reference — @crypto-shop/core

> Complete API documentation for the core wallet library.
>
> Install: `npm install @crypto-shop/core` (or use via monorepo workspace)

---

## Table of Contents

- [createWallet()](#createwallet)
- [walletFromMnemonic()](#walletfrommnemonic)
- [walletFromPrivateKey()](#walletfromprivatekey)
- [validateWalletAddress()](#validatewalletaddress)
- [getBalance()](#getbalance)
- [sendTransaction()](#sendtransaction)
- [Types](#types)

---

## `createWallet()`

Generate a brand-new random HD wallet with a BIP-39 mnemonic.

```typescript
function createWallet(): WalletInfo
```

**Returns:** `WalletInfo`

**Example:**

```typescript
import { createWallet } from "@crypto-shop/core";

const wallet = createWallet();
console.log(wallet.address);    // "0x742d35Cc6634C0532925a3b844Bc9e7595f..."
console.log(wallet.privateKey);  // "0xac0974bec39a17e36ba4a6b4d238ff944b..."
console.log(wallet.mnemonic);    // "abandon abandon abandon ... about"
```

---

## `walletFromMnemonic()`

Restore a wallet from its BIP-39 mnemonic phrase.

```typescript
function walletFromMnemonic(mnemonic: string): WalletInfo
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `mnemonic` | `string` | 12-word BIP-39 mnemonic phrase |

**Returns:** `WalletInfo`

**Example:**

```typescript
import { walletFromMnemonic } from "@crypto-shop/core";

const wallet = walletFromMnemonic(
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about"
);

console.log(wallet.address); // deterministic address from mnemonic
```

---

## `walletFromPrivateKey()`

Restore a wallet from a raw private key.

```typescript
function walletFromPrivateKey(privateKey: string): WalletInfo
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `privateKey` | `string` | Hex-encoded private key starting with `0x` |

**Returns:** `WalletInfo` (without `mnemonic` field)

**Example:**

```typescript
import { walletFromPrivateKey } from "@crypto-shop/core";

const wallet = walletFromPrivateKey(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
);

console.log(wallet.address);
console.log(wallet.mnemonic); // undefined — lost when importing via key
```

---

## `validateWalletAddress()`

Check whether a string is a valid Ethereum address.

```typescript
function validateWalletAddress(address: string): boolean
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `address` | `string` | String to validate |

**Returns:** `boolean`

**Example:**

```typescript
import { validateWalletAddress } from "@crypto-shop/core";

validateWalletAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e"); // true
validateWalletAddress("not-an-address"); // false
validateWalletAddress("0x123"); // false
```

---

## `getBalance()`

Fetch ETH balance for an address via JSON-RPC.

```typescript
async function getBalance(address: string, rpcUrl: string): Promise<string>
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `address` | `string` | Ethereum address to query |
| `rpcUrl` | `string` | JSON-RPC endpoint URL |

**Returns:** `Promise<string>` — balance in ETH as a human-readable string

**Example:**

```typescript
import { getBalance } from "@crypto-shop/core";

const balance = await getBalance(
  "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD3e",
  "https://eth.llamarpc.com"
);

console.log(balance); // "1.234567890123456789"
```

---

## `sendTransaction()`

Send ETH from one wallet to another.

```typescript
async function sendTransaction(
  privateKey: string,
  tx: TransactionRequest,
  rpcUrl: string
): Promise<TransactionResult>
```

**Parameters:**

| Name | Type | Description |
|------|------|-------------|
| `privateKey` | `string` | Sender's private key |
| `tx` | `TransactionRequest` | Transaction details |
| `rpcUrl` | `string` | JSON-RPC endpoint URL |

**Returns:** `Promise<TransactionResult>`

**Example:**

```typescript
import { sendTransaction } from "@crypto-shop/core";

const result = await sendTransaction(
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  {
    to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    value: "0.1", // ETH
  },
  "https://rpc.sepolia.org"
);

console.log(result.hash);        // "0xabc123..."
console.log(result.blockNumber); // 12345678
```

---

## Types

### `WalletInfo`

```typescript
interface WalletInfo {
  address: string;      // Ethereum address (0x-prefixed, checksummed)
  privateKey: string;   // Private key (0x-prefixed hex, 64 chars)
  mnemonic?: string;    // BIP-39 mnemonic (12 words, space-separated) — absent for key-only imports
}
```

### `TransactionRequest`

```typescript
interface TransactionRequest {
  to: string;          // Recipient address
  value: string;       // Amount in ETH (e.g., "0.01")
  gasLimit?: bigint;   // Optional gas limit override
}
```

### `TransactionResult`

```typescript
interface TransactionResult {
  hash: string;         // Transaction hash
  from: string;         // Sender address
  to: string;           // Recipient address
  value: string;        // Amount sent (ETH)
  blockNumber?: number; // Block number (may be undefined if pending)
}
```
