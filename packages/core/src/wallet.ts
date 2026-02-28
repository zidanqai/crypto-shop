import { Wallet, HDNodeWallet, isAddress, JsonRpcProvider } from "ethers";

// ─── Types ───────────────────────────────────────────────────────────

export interface WalletInfo {
  address: string;
  privateKey: string;
  mnemonic?: string;
}

export interface TransactionRequest {
  to: string;
  value: string; // ETH amount as string (e.g. "0.01")
  gasLimit?: bigint;
}

export interface TransactionResult {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber?: number;
}

// ─── Wallet Generation ──────────────────────────────────────────────

/**
 * Create a brand-new random HD wallet with a BIP-39 mnemonic.
 */
export function createWallet(): WalletInfo {
  const wallet = Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase,
  };
}

/**
 * Restore a wallet from its BIP-39 mnemonic phrase.
 */
export function walletFromMnemonic(mnemonic: string): WalletInfo {
  const wallet = HDNodeWallet.fromPhrase(mnemonic);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase,
  };
}

/**
 * Restore a wallet from a raw private key (hex string starting with 0x).
 */
export function walletFromPrivateKey(privateKey: string): WalletInfo {
  const wallet = new Wallet(privateKey);
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}

// ─── Validation ─────────────────────────────────────────────────────

/**
 * Check whether the given string is a valid Ethereum address.
 */
export function validateWalletAddress(address: string): boolean {
  return isAddress(address);
}

// ─── Balance ────────────────────────────────────────────────────────

/**
 * Fetch the ETH balance for an address using a JSON-RPC provider.
 * Returns balance in ETH as a human-readable string.
 */
export async function getBalance(
  address: string,
  rpcUrl: string
): Promise<string> {
  const provider = new JsonRpcProvider(rpcUrl);
  const balance = await provider.getBalance(address);
  const { formatEther } = await import("ethers");
  return formatEther(balance);
}

// ─── Transactions ───────────────────────────────────────────────────

/**
 * Send ETH from one wallet to another.
 * @param privateKey  Sender's private key.
 * @param tx          Transaction details (to, value in ETH).
 * @param rpcUrl      JSON-RPC endpoint.
 */
export async function sendTransaction(
  privateKey: string,
  tx: TransactionRequest,
  rpcUrl: string
): Promise<TransactionResult> {
  const { parseEther } = await import("ethers");
  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);

  const response = await wallet.sendTransaction({
    to: tx.to,
    value: parseEther(tx.value),
    gasLimit: tx.gasLimit,
  });

  const receipt = await response.wait();

  return {
    hash: response.hash,
    from: response.from,
    to: tx.to,
    value: tx.value,
    blockNumber: receipt?.blockNumber,
  };
}
