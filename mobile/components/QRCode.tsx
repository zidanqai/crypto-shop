import React from "react";
import { View, StyleSheet } from "react-native";
import QRCodeSVG from "react-native-qrcode-svg";

interface QRCodeProps {
  value: string;
  size?: number;
}

export function QRCode({ value, size = 200 }: QRCodeProps) {
  return (
    <View style={styles.container}>
      <QRCodeSVG value={value} size={size} backgroundColor="#FFFFFF" color="#000000" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
