import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/Button";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants/theme";

export default function WalletScreen() {
  const {
    wallet,
    balance,
    loading,
    refreshBalance,
    createNewWallet,
    hasWallet,
  } = useWallet();

  const [refreshing, setRefreshing] = useState(false);
  const [showAddress, setShowAddress] = useState(true);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshBalance();
    setRefreshing(false);
  }, [refreshBalance]);

  const copyAddress = async () => {
    if (!wallet?.address) return;
    await Clipboard.setStringAsync(wallet.address);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Copied", "Wallet address copied to clipboard");
  };

  const truncateAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  if (!hasWallet) {
    return (
      <View style={styles.centered}>
        <Ionicons
          name="wallet-outline"
          size={80}
          color={Colors.primary}
          style={{ marginBottom: Spacing.lg }}
        />
        <Text style={styles.heroTitle}>CryptoShop Wallet</Text>
        <Text style={styles.heroSub}>
          Your gateway to Ethereum. Generate a secure HD wallet to get started.
        </Text>
        <Button
          title="Create New Wallet"
          onPress={createNewWallet}
          loading={loading}
          style={{ marginTop: Spacing.xl }}
        />
        <Button
          title="Import Existing Wallet"
          variant="outline"
          onPress={() => Alert.alert("Coming soon", "Import via mnemonic or private key")}
          style={{ marginTop: Spacing.md }}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>
          {loading ? "..." : `${parseFloat(balance).toFixed(6)} ETH`}
        </Text>
        <TouchableOpacity style={styles.addressRow} onPress={copyAddress}>
          <Text style={styles.addressText}>
            {showAddress
              ? truncateAddress(wallet?.address ?? "")
              : "••••••••••••"}
          </Text>
          <Ionicons name="copy-outline" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsRow}>
        <ActionButton icon="arrow-up" label="Send" href="/(tabs)/send" />
        <ActionButton icon="arrow-down" label="Receive" href="/(tabs)/receive" />
        <ActionButton icon="swap-horizontal" label="Swap" disabled />
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.emptyState}>
          <Ionicons
            name="receipt-outline"
            size={40}
            color={Colors.textMuted}
          />
          <Text style={styles.emptyText}>No transactions yet</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function ActionButton({
  icon,
  label,
  href,
  disabled,
}: {
  icon: string;
  label: string;
  href?: string;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionBtn, disabled && styles.actionBtnDisabled]}
      disabled={disabled}
    >
      <View style={styles.actionIconWrap}>
        <Ionicons
          name={icon as any}
          size={22}
          color={disabled ? Colors.textMuted : Colors.white}
        />
      </View>
      <Text
        style={[
          styles.actionLabel,
          disabled && { color: Colors.textMuted },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
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
  centered: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.xl,
  },
  heroTitle: {
    fontSize: FontSize.xxl,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  heroSub: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  balanceCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  balanceAmount: {
    fontSize: FontSize.hero,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginVertical: Spacing.sm,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  addressText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontFamily: "monospace",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: Spacing.lg,
  },
  actionBtn: {
    alignItems: "center",
    gap: Spacing.xs,
  },
  actionBtnDisabled: {
    opacity: 0.4,
  },
  actionIconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  actionLabel: {
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  section: {
    marginTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  emptyState: {
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.xl,
    alignItems: "center",
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
