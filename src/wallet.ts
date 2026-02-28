import { Wallet, isAddress } from "ethers";

export type GeneratedWallet = {
  address: string;
  privateKey: string;
  mnemonic?: string;
};

export function createWallet(): GeneratedWallet {
  const wallet = Wallet.createRandom();

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase
  };
}

export function validateWalletAddress(address: string): boolean {
  return isAddress(address);
}

export function walletFromPrivateKey(privateKey: string): GeneratedWallet {
  const wallet = new Wallet(privateKey);

  return {
    address: wallet.address,
    privateKey: wallet.privateKey
  };
}