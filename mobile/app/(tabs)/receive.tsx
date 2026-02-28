import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Share,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useWallet } from "@/hooks/useWallet";
import { QRCode } from "@/components/QRCode";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants/theme";

export default function ReceiveScreen() {
  const { wallet } = useWallet();
  const address = wallet?.address ?? "";

  const copyAddress = async () => {
    await Clipboard.setStringAsync(address);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert("Copied", "Address copied to clipboard");
  };

  const shareAddress = async () => {
    try {
      await Share.share({
        message: address,
        title: "My CryptoShop Wallet Address",
      });
    } catch (_) {}
  };

  if (!address) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Create a wallet first</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receive ETH</Text>
      <Text style={styles.subtitle}>
        Share your address or scan the QR code below
      </Text>

      {/* QR Code */}
      <View style={styles.qrCard}>
        <QRCode value={address} size={220} />
      </View>

      {/* Address */}
      <TouchableOpacity style={styles.addressCard} onPress={copyAddress}>
        <Text style={styles.addressText}>{address}</Text>
        <Ionicons name="copy-outline" size={18} color={Colors.primary} />
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={copyAddress}>
          <Ionicons name="copy" size={20} color={Colors.white} />
          <Text style={styles.actionLabel}>Copy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={shareAddress}>
          <Ionicons name="share-social" size={20} color={Colors.white} />
          <Text style={styles.actionLabel}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    padding: Spacing.lg,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bgDark,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: "800",
    color: Colors.textPrimary,
    alignSelf: "flex-start",
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    alignSelf: "flex-start",
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  qrCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    width: "100%",
  },
  addressText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textPrimary,
    fontFamily: "monospace",
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  actionLabel: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: FontSize.sm,
  },
});
