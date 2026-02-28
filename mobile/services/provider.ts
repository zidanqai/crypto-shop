// ─── Provider Configuration ──────────────────────────────────────────
// Manages Ethereum JSON-RPC provider instances per network.

import { JsonRpcProvider } from "ethers";

export type NetworkId = "mainnet" | "sepolia";

interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  symbol: string;
}

export const NETWORKS: Record<NetworkId, NetworkConfig> = {
  mainnet: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: "https://eth.llamarpc.com",
    explorerUrl: "https://etherscan.io",
    symbol: "ETH",
  },
  sepolia: {
    name: "Sepolia Testnet",
    chainId: 11155111,
    rpcUrl: "https://rpc.sepolia.org",
    explorerUrl: "https://sepolia.etherscan.io",
    symbol: "SepoliaETH",
  },
};

let currentNetwork: NetworkId = "mainnet";
let providerCache: JsonRpcProvider | null = null;

export function setNetwork(network: NetworkId): void {
  if (network !== currentNetwork) {
    currentNetwork = network;
    providerCache = null; // invalidate cache
  }
}

export function getNetwork(): NetworkId {
  return currentNetwork;
}

export function getNetworkConfig(): NetworkConfig {
  return NETWORKS[currentNetwork];
}

export function getProvider(): JsonRpcProvider {
  if (!providerCache) {
    const config = NETWORKS[currentNetwork];
    providerCache = new JsonRpcProvider(config.rpcUrl, {
      name: config.name,
      chainId: config.chainId,
    });
  }
  return providerCache;
}

export function getExplorerTxUrl(txHash: string): string {
  return `${NETWORKS[currentNetwork].explorerUrl}/tx/${txHash}`;
}
