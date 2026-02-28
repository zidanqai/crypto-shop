# Developer Setup Guide

> Everything you need to get CryptoShop Wallet running locally.

---

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | JavaScript runtime |
| npm | 10+ | Package manager |
| Java (JDK) | 17 | Android build toolchain |
| Android SDK | 34+ | Android platform tools |
| Git | 2.40+ | Version control |
| Expo CLI | Latest | `npx expo` (no global install needed) |

### Install Node.js

```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
nvm use 20
```

### Install Java 17

```bash
# macOS
brew install openjdk@17

# Ubuntu/Debian
sudo apt install openjdk-17-jdk

# Verify
java -version
```

### Install Android SDK

Option A: Install [Android Studio](https://developer.android.com/studio) (includes SDK).

Option B: Command-line only:
```bash
# Download command-line tools from https://developer.android.com/studio#command-tools
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools/bin:$PATH

# Install required SDK packages
sdkmanager "platforms;android-34" "build-tools;34.0.0"
```

---

## Clone & Install

```bash
# Clone the repo
git clone https://github.com/zidanqai/crypto-shop.git
cd crypto-shop

# Install core library dependencies
cd packages/core
npm install

# Install mobile app dependencies
cd ../../mobile
npm install
```

---

## Running the Core Library

```bash
cd packages/core

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build TypeScript → dist/
npm run build

# Generate a wallet (CLI)
npm run dev
```

---

## Running the Mobile App

### Development server

```bash
cd mobile

# Start Expo dev server
npx expo start

# Start with tunnel (for physical devices on different networks)
npx expo start --tunnel
```

### Android Emulator

```bash
# List available emulators
emulator -list-avds

# Start an emulator
emulator -avd <NAME>

# Run the app on the emulator
cd mobile && npx expo run:android
```

### Physical Device

1. Install **Expo Go** from Play Store / App Store.
2. Run `npx expo start` in the `mobile/` directory.
3. Scan the QR code with Expo Go.

---

## Building APK Locally

```bash
cd mobile

# Generate native Android project
npx expo prebuild --platform android --no-install

# Install Android deps and build debug APK
cd android
./gradlew assembleDebug

# APK location:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Environment Variables (Optional)

Create a `.env` file in `mobile/` for custom RPC endpoints:

```bash
# mobile/.env
RPC_URL_MAINNET=https://mainnet.infura.io/v3/YOUR_KEY
RPC_URL_SEPOLIA=https://sepolia.infura.io/v3/YOUR_KEY
```

> Default public RPCs are used if these are not set.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `expo: command not found` | Use `npx expo` instead of global `expo` |
| Java version mismatch | Ensure JAVA_HOME points to JDK 17 |
| Android SDK not found | Set `ANDROID_HOME` environment variable |
| Metro bundler port in use | Kill process on port 8081: `lsof -ti:8081 \| xargs kill` |
| Gradle build fails | Run `cd android && ./gradlew clean` then retry |
| SecureStore not available | SecureStore requires a native build (not Expo Go for some features) |
