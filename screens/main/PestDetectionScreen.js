import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { COLORS } from '../../constants';

const PestDetectionScreen = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraText}>Camera Preview</Text>
          <Text style={styles.cameraSub}>Point at your crop</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>Pest Detection</Text>
          <Text style={styles.subtitle}>
            Take a photo of your crop and our AI will identify pests, diseases, and recommend treatments.
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.galleryBtn}>
            <Text style={styles.galleryIcon}>🖼️</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.captureBtn}>
            <View style={styles.captureInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryBtn}>
            <Text style={styles.galleryIcon}>⚡</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.comingSoon}>
          <Text style={styles.comingSoonText}>🚧 AI Model Integration Coming Soon</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#111' },
  container: { flex: 1, justifyContent: 'space-between', padding: 20 },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    borderStyle: 'dashed',
  },
  cameraIcon: { fontSize: 52 },
  cameraText: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: 12 },
  cameraSub: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  info: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 32, marginBottom: 16 },
  galleryBtn: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  galleryIcon: { fontSize: 24 },
  captureBtn: {
    width: 74, height: 74, borderRadius: 37,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  captureInner: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: COLORS.primary,
  },
  comingSoon: {
    backgroundColor: 'rgba(255,143,0,0.2)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  comingSoonText: { color: COLORS.secondaryLight, fontSize: 12, fontWeight: '600' },
});

export default PestDetectionScreen;
