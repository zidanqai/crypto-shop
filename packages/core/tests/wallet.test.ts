import { describe, expect, it } from "vitest";
import {
  createWallet,
  validateWalletAddress,
  walletFromPrivateKey,
  walletFromMnemonic,
} from "../src/wallet";

describe("wallet generation", () => {
  it("creates a wallet with valid address, private key, and mnemonic", () => {
    const wallet = createWallet();

    expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(wallet.mnemonic).toBeDefined();
    expect(wallet.mnemonic!.split(" ")).toHaveLength(12);
  });

  it("generates unique wallets on each call", () => {
    const a = createWallet();
    const b = createWallet();
    expect(a.address).not.toBe(b.address);
    expect(a.privateKey).not.toBe(b.privateKey);
  });
});

describe("wallet restoration", () => {
  it("restores the same wallet from its private key", () => {
    const original = createWallet();
    const restored = walletFromPrivateKey(original.privateKey);

    expect(restored.address).toBe(original.address);
    expect(restored.privateKey).toBe(original.privateKey);
    expect(restored.mnemonic).toBeUndefined(); // lost when importing via key
  });

  it("restores the same wallet from its mnemonic", () => {
    const original = createWallet();
    const restored = walletFromMnemonic(original.mnemonic!);

    expect(restored.address).toBe(original.address);
    expect(restored.privateKey).toBe(original.privateKey);
    expect(restored.mnemonic).toBe(original.mnemonic);
  });
});

describe("address validation", () => {
  it("accepts a valid checksummed address", () => {
    const { address } = createWallet();
    expect(validateWalletAddress(address)).toBe(true);
  });

  it("accepts the zero address", () => {
    expect(
      validateWalletAddress("0x0000000000000000000000000000000000000000")
    ).toBe(true);
  });

  it("rejects garbage strings", () => {
    expect(validateWalletAddress("not-an-address")).toBe(false);
    expect(validateWalletAddress("")).toBe(false);
    expect(validateWalletAddress("0x123")).toBe(false);
  });
});
