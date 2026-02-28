import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useWallet } from "@/hooks/useWallet";
import { Button } from "@/components/Button";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants/theme";

export default function SendScreen() {
  const { wallet, balance, sendEth } = useWallet();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);

  const isValidAmount = () => {
    const num = parseFloat(amount);
    return !isNaN(num) && num > 0 && num <= parseFloat(balance);
  };

  const isValidAddress = () => /^0x[a-fA-F0-9]{40}$/.test(recipient);

  const handleSend = async () => {
    if (!isValidAddress()) {
      Alert.alert("Invalid Address", "Please enter a valid Ethereum address.");
      return;
    }
    if (!isValidAmount()) {
      Alert.alert("Invalid Amount", "Please enter a valid ETH amount within your balance.");
      return;
    }

    Alert.alert(
      "Confirm Transaction",
      `Send ${amount} ETH to ${recipient.slice(0, 6)}...${recipient.slice(-4)}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send",
          style: "destructive",
          onPress: async () => {
            setSending(true);
            try {
              const result = await sendEth(recipient, amount);
              Alert.alert(
                "Transaction Sent",
                `Hash: ${result.hash.slice(0, 10)}...${result.hash.slice(-8)}\n\nThe transaction has been broadcast and is awaiting confirmation.`
              );
              setRecipient("");
              setAmount("");
            } catch (err: any) {
              Alert.alert("Transaction Failed", err.message ?? "Unknown error");
            } finally {
              setSending(false);
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Send ETH</Text>
        <Text style={styles.subtitle}>
          Available: {parseFloat(balance).toFixed(6)} ETH
        </Text>

        {/* Recipient */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Recipient Address</Text>
          <TextInput
            style={[
              styles.input,
              recipient.length > 0 && !isValidAddress() && styles.inputError,
            ]}
            placeholder="0x..."
            placeholderTextColor={Colors.textMuted}
            value={recipient}
            onChangeText={setRecipient}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {recipient.length > 0 && !isValidAddress() && (
            <Text style={styles.errorText}>Invalid Ethereum address</Text>
          )}
        </View>

        {/* Amount */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Amount (ETH)</Text>
          <TextInput
            style={[
              styles.input,
              amount.length > 0 && !isValidAmount() && styles.inputError,
            ]}
            placeholder="0.00"
            placeholderTextColor={Colors.textMuted}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          {amount.length > 0 && !isValidAmount() && (
            <Text style={styles.errorText}>
              Enter a valid amount within your balance
            </Text>
          )}
        </View>

        {/* Gas Estimate */}
        <View style={styles.feeRow}>
          <Text style={styles.feeLabel}>Est. Network Fee</Text>
          <Text style={styles.feeValue}>~0.000021 ETH</Text>
        </View>

        <Button
          title={sending ? "Sending..." : "Send ETH"}
          onPress={handleSend}
          loading={sending}
          disabled={!isValidAddress() || !isValidAmount() || sending}
          style={{ marginTop: Spacing.lg }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  },
  subtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.bgInput,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  feeLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  feeValue: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
});
