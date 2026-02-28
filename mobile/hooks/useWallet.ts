import { useState, useEffect, useCallback } from "react";
import {
  WalletData,
  TransactionResult,
  createAndStoreWallet,
  loadStoredWallet,
  deleteWallet,
  fetchBalance,
  sendEthTransaction,
} from "@/services/wallet";

interface UseWalletReturn {
  wallet: WalletData | null;
  balance: string;
  loading: boolean;
  hasWallet: boolean;
  createNewWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  sendEth: (to: string, amount: string) => Promise<TransactionResult>;
  clearWallet: () => Promise<void>;
}

export function useWallet(): UseWalletReturn {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [balance, setBalance] = useState("0.0");
  const [loading, setLoading] = useState(true);

  // Load from secure store on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await loadStoredWallet();
        if (stored) {
          setWallet(stored);
        }
      } catch {
        // first launch — no wallet yet
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch balance whenever wallet changes
  useEffect(() => {
    if (wallet?.address) {
      refreshBalance();
    }
  }, [wallet?.address]);

  const refreshBalance = useCallback(async () => {
    if (!wallet?.address) return;
    try {
      const bal = await fetchBalance(wallet.address);
      setBalance(bal);
    } catch {
      // network error — keep stale balance
    }
  }, [wallet?.address]);

  const createNewWallet = useCallback(async () => {
    setLoading(true);
    try {
      const w = await createAndStoreWallet();
      setWallet(w);
    } finally {
      setLoading(false);
    }
  }, []);

  const sendEth = useCallback(
    async (to: string, amount: string) => {
      if (!wallet) throw new Error("No wallet loaded");
      return sendEthTransaction(wallet.privateKey, to, amount);
    },
    [wallet]
  );

  const clearWallet = useCallback(async () => {
    await deleteWallet();
    setWallet(null);
    setBalance("0.0");
  }, []);

  return {
    wallet,
    balance,
    loading,
    hasWallet: wallet !== null,
    createNewWallet,
    refreshBalance,
    sendEth,
    clearWallet,
  };
}
