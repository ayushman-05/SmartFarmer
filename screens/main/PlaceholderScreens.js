import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants';

const PlaceholderScreen = ({ emoji, title, subtitle }) => (
  <SafeAreaView style={styles.safe}>
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Coming Soon</Text>
      </View>
    </View>
  </SafeAreaView>
);

export const WeatherScreen = () => (
  <PlaceholderScreen
    emoji="🌤️"
    title="Weather Forecast"
    subtitle="Hyperlocal weather data for your farm"
  />
);

export const MarketScreen = () => (
  <PlaceholderScreen
    emoji="🛒"
    title="Market Prices"
    subtitle="Live mandi rates near you"
  />
);

export const AdvisoryScreen = () => (
  <PlaceholderScreen
    emoji="📊"
    title="Crop Advisory"
    subtitle="Expert crop recommendations"
  />
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 20 },
  badge: {
    backgroundColor: COLORS.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
