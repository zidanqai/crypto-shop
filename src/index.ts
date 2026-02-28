import {
  createWallet,
  validateWalletAddress,
  walletFromPrivateKey
} from "./wallet";

function runCli(): void {
  const [command, value] = process.argv.slice(2);

  if (!command || command === "generate") {
    const wallet = createWallet();
    console.log(JSON.stringify(wallet, null, 2));
    return;
  }

  if (command === "validate") {
    if (!value) {
      console.error("Usage: npm run dev -- validate <address>");
      process.exitCode = 1;
      return;
    }

    console.log(validateWalletAddress(value));
    return;
  }

  if (command === "from-private-key") {
    if (!value) {
      console.error("Usage: npm run dev -- from-private-key <privateKey>");
      process.exitCode = 1;
      return;
    }

    console.log(JSON.stringify(walletFromPrivateKey(value), null, 2));
    return;
  }

  console.error(
    "Unknown command. Use: generate | validate <address> | from-private-key <privateKey>"
  );
  process.exitCode = 1;
}

if (require.main === module) {
  runCli();
}

export { createWallet, validateWalletAddress, walletFromPrivateKey };