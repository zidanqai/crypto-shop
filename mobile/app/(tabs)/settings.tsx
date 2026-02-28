import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useWallet } from "@/hooks/useWallet";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants/theme";

type Network = "mainnet" | "sepolia";

export default function SettingsScreen() {
  const { wallet, clearWallet } = useWallet();
  const [network, setNetwork] = useState<Network>("mainnet");
  const [biometric, setBiometric] = useState(false);

  const handleExportKey = () => {
    Alert.alert(
      "Export Private Key",
      "Your private key gives full access to your wallet. Never share it with anyone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Show Key",
          style: "destructive",
          onPress: () => {
            Alert.alert("Private Key", wallet?.privateKey ?? "No wallet found");
          },
        },
      ]
    );
  };

  const handleClearWallet = () => {
    Alert.alert(
      "Delete Wallet",
      "This will permanently remove the wallet from this device. Make sure you have backed up your private key or mnemonic phrase.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: clearWallet,
        },
      ]
    );
  };

  const toggleNetwork = () => {
    setNetwork((prev) => (prev === "mainnet" ? "sepolia" : "mainnet"));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>

      {/* Network */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network</Text>
        <TouchableOpacity style={styles.row} onPress={toggleNetwork}>
          <View style={styles.rowLeft}>
            <Ionicons name="globe-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.rowLabel}>Network</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {network === "mainnet" ? "Ethereum Mainnet" : "Sepolia Testnet"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Security */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="finger-print" size={20} color={Colors.textSecondary} />
            <Text style={styles.rowLabel}>Biometric Unlock</Text>
          </View>
          <Switch
            value={biometric}
            onValueChange={setBiometric}
            trackColor={{ false: Colors.bgInput, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        </View>

        <TouchableOpacity style={styles.row} onPress={handleExportKey}>
          <View style={styles.rowLeft}>
            <Ionicons name="key-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.rowLabel}>Export Private Key</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: Colors.error }]}>
          Danger Zone
        </Text>
        <TouchableOpacity
          style={[styles.row, styles.dangerRow]}
          onPress={handleClearWallet}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
            <Text style={[styles.rowLabel, { color: Colors.error }]}>
              Delete Wallet
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          CryptoShop Wallet v{Constants.expoConfig?.version ?? "1.0.0"}
        </Text>
        <Text style={styles.footerText}>Made with care by zidanqai</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: "700",
    color: Colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dangerRow: {
    borderColor: Colors.error + "33",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  rowLabel: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  badge: {
    backgroundColor: Colors.primary + "22",
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    marginTop: Spacing.xl,
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
