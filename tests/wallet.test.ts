import { describe, expect, it } from "vitest";
import {
  createWallet,
  validateWalletAddress,
  walletFromPrivateKey
} from "../src/wallet";

describe("wallet", () => {
  it("creates a valid wallet", () => {
    const wallet = createWallet();

    expect(wallet.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    expect(wallet.privateKey).toMatch(/^0x[a-fA-F0-9]{64}$/);
    expect(validateWalletAddress(wallet.address)).toBe(true);
  });

  it("rejects an invalid address", () => {
    expect(validateWalletAddress("not-an-address")).toBe(false);
  });

  it("recreates wallet from private key", () => {
    const wallet = createWallet();
    const recreated = walletFromPrivateKey(wallet.privateKey);

    expect(recreated.address).toBe(wallet.address);
  });
});