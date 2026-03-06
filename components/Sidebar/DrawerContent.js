import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { COLORS } from "../../constants";

const MenuItem = ({ emoji, label, onPress, danger }) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.menuEmoji}>{emoji}</Text>
    <Text style={[styles.menuLabel, danger && styles.dangerText]}>{label}</Text>
  </TouchableOpacity>
);

const DrawerContent = () => {
  const router = useRouter();

  // Safe call — DrawerContent renders inside Drawer which is inside AuthProvider
  // but guard against any edge-case timing issues
  let user = null;
  let logout = () => {};
  try {
    const auth = useAuth();
    user = auth.user;
    logout = auth.logout;
  } catch (_) {}

  const handleLogout = () => {
    Alert.alert("Sign Out", "Sign out from your account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  // Routes are relative to the Drawer root (app/_layout.js), so
  // (main) group is at /(main)/... and tabs are at /(main)/(tabs)/...
  const navigate = (path) => {
    router.push(path);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* User info */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.fullName?.charAt(0)?.toUpperCase() || "?"}
          </Text>
        </View>
        <Text style={styles.userName} numberOfLines={1}>
          {user?.fullName || "Farmer"}
        </Text>
        <Text style={styles.userMobile}>{user?.mobile}</Text>
        <Text style={styles.userLocation}>
          📍 {user?.district}, {user?.state}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Navigation items */}
      <Text style={styles.sectionLabel}>MAIN</Text>
      <MenuItem
        emoji="🏠"
        label="Dashboard"
        onPress={() => navigate("/(main)/(tabs)/")}
      />
      <MenuItem
        emoji="🔍"
        label="Pest Detection"
        onPress={() => navigate("/(main)/(tabs)/")}
      />
      <MenuItem
        emoji="🌤️"
        label="Weather"
        onPress={() => navigate("/(main)/(tabs)/weather")}
      />
      <MenuItem
        emoji="🛒"
        label="Market Prices"
        onPress={() => navigate("/(main)/(tabs)/market")}
      />
      <MenuItem
        emoji="📊"
        label="Crop Advisory"
        onPress={() => navigate("/(main)/(tabs)/advisory")}
      />

      <View style={styles.divider} />

      <Text style={styles.sectionLabel}>ACCOUNT</Text>
      <MenuItem
        emoji="👤"
        label="My Profile"
        onPress={() => navigate("/(main)/(tabs)/profile")}
      />
      <MenuItem
        emoji="🌐"
        label="Language"
        onPress={() => {
          /* Azure — coming soon */
        }}
      />
      <MenuItem emoji="❓" label="Help & Support" onPress={() => {}} />

      <View style={styles.divider} />

      <MenuItem emoji="🚪" label="Sign Out" onPress={handleLogout} danger />

      {/* App version */}
      <Text style={styles.version}>SmartFarmer v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  container: { flexGrow: 1, paddingBottom: 32 },
  userSection: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: COLORS.primary,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 26, fontWeight: "800", color: "#fff" },
  userName: { fontSize: 17, fontWeight: "800", color: "#fff", marginBottom: 3 },
  userMobile: { fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 4 },
  userLocation: { fontSize: 12, color: "rgba(255,255,255,0.7)" },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginLeft: 20,
    marginBottom: 4,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 8,
  },
  menuEmoji: { fontSize: 20, marginRight: 14, width: 26, textAlign: "center" },
  menuLabel: { fontSize: 15, fontWeight: "500", color: COLORS.textPrimary },
  dangerText: { color: COLORS.error },
  version: {
    textAlign: "center",
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 20,
  },
});

export default DrawerContent;
