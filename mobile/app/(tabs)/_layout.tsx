import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  name,
  color,
  size,
}: {
  name: IoniconsName;
  color: string;
  size: number;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}

export default function TabLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: Colors.bgDark },
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: { fontWeight: "700" },
          tabBarStyle: {
            backgroundColor: Colors.bgDark,
            borderTopColor: Colors.border,
            borderTopWidth: 1,
            paddingBottom: 4,
            height: 60,
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.textMuted,
          tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Wallet",
            headerTitle: "CryptoShop Wallet",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="wallet-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="send"
          options={{
            title: "Send",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="arrow-up-circle-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="receive"
          options={{
            title: "Receive",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="arrow-down-circle-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color, size }) => (
              <TabIcon name="settings-outline" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
