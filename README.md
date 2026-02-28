# crypto-shop

Starter project for a crypto wallet module (Ethereum) with TypeScript and GitHub Actions CI.

## Features

- Generate a new wallet (address + private key + mnemonic)
- Validate wallet addresses
- Recreate wallet from private key
- Run tests and build automatically on push/PR via GitHub Actions

## Setup

```bash
npm install
```

## Run locally

Generate a wallet:

```bash
npm run dev
```

Validate an address:

```bash
npm run dev -- validate 0x0000000000000000000000000000000000000000
```

Create wallet details from private key:

```bash
npm run dev -- from-private-key <PRIVATE_KEY>
```

Run tests:

```bash
npm test
```

Build:

```bash
npm run build
```

## GitHub push + build system

CI workflow is defined at `.github/workflows/ci.yml`.

It runs on:

- every `push`
- every `pull_request`

To push your code and trigger build:

```bash
git add .
git commit -m "Initialize crypto wallet starter"
git push origin main
```

## Security note

Never commit real private keys or mnemonics. Use test wallets only for development.