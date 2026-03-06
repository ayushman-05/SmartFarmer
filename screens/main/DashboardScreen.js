import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { COLORS } from '../../constants';

const QuickActionCard = ({ emoji, title, subtitle, onPress, color }) => (
  <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress} activeOpacity={0.85}>
    <Text style={styles.cardEmoji}>{emoji}</Text>
    <View style={styles.cardText}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.cardArrow}>›</Text>
  </TouchableOpacity>
);

const StatBox = ({ value, label, emoji }) => (
  <View style={styles.statBox}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const DashboardScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const firstName = user?.fullName?.split(' ')[0] || 'Farmer';

  // Opens the drawer via Expo Router's built-in navigation ref
  const openDrawer = () => {
    router.push('/(main)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <View>
            <Text style={styles.greetingText}>Good Morning,</Text>
            <Text style={styles.greetingName}>{firstName} 👋</Text>
          </View>
          <TouchableOpacity onPress={openDrawer} style={styles.menuBtn}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Location badge */}
        <View style={styles.locationBadge}>
          <Text style={styles.locationText}>📍 {user?.district}, {user?.state}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBox value="3" label="Active Crops" emoji="🌱" />
          <StatBox value="0" label="Alerts" emoji="⚠️" />
          <StatBox value="—" label="Weather" emoji="☀️" />
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <QuickActionCard
          emoji="🔍"
          title="Pest Detection"
          subtitle="Scan your crop for pests"
          color={COLORS.error}
          onPress={() => router.push('/(main)/pest-detection')}
        />
        <QuickActionCard
          emoji="🌤️"
          title="Weather Forecast"
          subtitle="Check local weather"
          color={COLORS.secondary}
          onPress={() => router.push('/(main)/weather')}
        />
        <QuickActionCard
          emoji="📊"
          title="Crop Advisory"
          subtitle="Get expert recommendations"
          color={COLORS.primary}
          onPress={() => router.push('/(main)/advisory')}
        />
        <QuickActionCard
          emoji="🛒"
          title="Market Prices"
          subtitle="Today's mandi rates"
          color={COLORS.primaryLight}
          onPress={() => router.push('/(main)/market')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 20 },
  greeting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  greetingText: { fontSize: 14, color: COLORS.textSecondary },
  greetingName: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  menuBtn: { padding: 8 },
  menuIcon: { fontSize: 22 },
  locationBadge: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  locationText: { color: COLORS.primaryDark, fontSize: 12, fontWeight: '600' },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statEmoji: { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 14 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardEmoji: { fontSize: 28, marginRight: 14 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: COLORS.textSecondary },
  cardArrow: { fontSize: 22, color: COLORS.textMuted },
});

export default DashboardScreen;
