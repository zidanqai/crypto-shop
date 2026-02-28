// ─── Wallet Service ──────────────────────────────────────────────────
// Handles wallet creation, storage (secure store), balance, and tx.

import {
  Wallet,
  HDNodeWallet,
  isAddress,
  formatEther,
  parseEther,
} from "ethers";
import * as SecureStore from "expo-secure-store";
import { getProvider } from "./provider";

// ── Keys ─────────────────────────────────────────────────────────────

const STORAGE_KEY_PK = "crypto_shop_private_key";
const STORAGE_KEY_MNEMONIC = "crypto_shop_mnemonic";

// ── Types ────────────────────────────────────────────────────────────

export interface WalletData {
  address: string;
  privateKey: string;
  mnemonic?: string;
}

export interface TransactionResult {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber?: number;
}

// ── Wallet Lifecycle ────────────────────────────────────────────────

/**
 * Create a brand-new HD wallet and persist it in SecureStore.
 */
export async function createAndStoreWallet(): Promise<WalletData> {
  const wallet = Wallet.createRandom();

  await SecureStore.setItemAsync(STORAGE_KEY_PK, wallet.privateKey);
  if (wallet.mnemonic?.phrase) {
    await SecureStore.setItemAsync(STORAGE_KEY_MNEMONIC, wallet.mnemonic.phrase);
  }

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase,
  };
}

/**
 * Import wallet from mnemonic and persist.
 */
export async function importFromMnemonic(
  mnemonic: string
): Promise<WalletData> {
  const wallet = HDNodeWallet.fromPhrase(mnemonic);

  await SecureStore.setItemAsync(STORAGE_KEY_PK, wallet.privateKey);
  await SecureStore.setItemAsync(STORAGE_KEY_MNEMONIC, mnemonic);

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic,
  };
}

/**
 * Import wallet from private key and persist.
 */
export async function importFromPrivateKey(pk: string): Promise<WalletData> {
  const wallet = new Wallet(pk);

  await SecureStore.setItemAsync(STORAGE_KEY_PK, wallet.privateKey);
  await SecureStore.deleteItemAsync(STORAGE_KEY_MNEMONIC);

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

/**
 * Load a previously-stored wallet from SecureStore.
 * Returns null if no wallet exists.
 */
export async function loadStoredWallet(): Promise<WalletData | null> {
  const pk = await SecureStore.getItemAsync(STORAGE_KEY_PK);
  if (!pk) return null;

  const wallet = new Wallet(pk);
  const mnemonic =
    (await SecureStore.getItemAsync(STORAGE_KEY_MNEMONIC)) ?? undefined;

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic,
  };
}

/**
 * Delete wallet data from SecureStore.
 */
export async function deleteWallet(): Promise<void> {
  await SecureStore.deleteItemAsync(STORAGE_KEY_PK);
  await SecureStore.deleteItemAsync(STORAGE_KEY_MNEMONIC);
}

// ── Validation ──────────────────────────────────────────────────────

export function validateAddress(address: string): boolean {
  return isAddress(address);
}

// ── Balance ────────────────────────────────────────────────────────

export async function fetchBalance(address: string): Promise<string> {
  const provider = getProvider();
  const balance = await provider.getBalance(address);
  return formatEther(balance);
}

// ── Transactions ───────────────────────────────────────────────────

export async function sendEthTransaction(
  privateKey: string,
  to: string,
  amountEth: string
): Promise<TransactionResult> {
  const provider = getProvider();
  const signer = new Wallet(privateKey, provider);

  const tx = await signer.sendTransaction({
    to,
    value: parseEther(amountEth),
  });

  const receipt = await tx.wait();

  return {
    hash: tx.hash,
    from: tx.from,
    to,
    value: amountEth,
    blockNumber: receipt?.blockNumber,
  };
}
