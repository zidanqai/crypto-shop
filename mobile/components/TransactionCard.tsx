import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, FontSize, BorderRadius } from "@/constants/theme";

interface TransactionCardProps {
  type: "send" | "receive";
  address: string;
  amount: string;
  hash: string;
  timestamp?: string;
}

export function TransactionCard({
  type,
  address,
  amount,
  hash,
  timestamp,
}: TransactionCardProps) {
  const isSend = type === "send";
  const truncate = (s: string) => `${s.slice(0, 6)}...${s.slice(-4)}`;

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.iconWrap,
          { backgroundColor: isSend ? Colors.error + "22" : Colors.success + "22" },
        ]}
      >
        <Ionicons
          name={isSend ? "arrow-up" : "arrow-down"}
          size={18}
          color={isSend ? Colors.error : Colors.success}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.label}>{isSend ? "Sent" : "Received"}</Text>
        <Text style={styles.address}>{truncate(address)}</Text>
        {timestamp && <Text style={styles.time}>{timestamp}</Text>}
      </View>

      <View style={styles.amountWrap}>
        <Text
          style={[
            styles.amount,
            { color: isSend ? Colors.error : Colors.success },
          ]}
        >
          {isSend ? "-" : "+"}
          {amount} ETH
        </Text>
        <Text style={styles.hash}>tx {truncate(hash)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bgCard,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.md,
  },
  details: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  address: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontFamily: "monospace",
    marginTop: 2,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  amountWrap: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: FontSize.md,
    fontWeight: "700",
  },
  hash: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
