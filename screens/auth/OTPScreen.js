import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Alert, TextInput,
  TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

const OTPScreen = () => {
  const router = useRouter();
  const { mobile, purpose } = useLocalSearchParams();
  const { verifyRegistration, verifyLogin, sendLoginOTP } = useAuth();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(RESEND_COOLDOWN);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    startCooldown();
  }, []);

  const startCooldown = () => {
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    // Cleanup on unmount
    return () => clearInterval(interval);
  };

  const handleVerify = async () => {
    if (otp.length !== OTP_LENGTH) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      if (purpose === 'registration') {
        await verifyRegistration(mobile, otp);
      } else {
        await verifyLogin(mobile, otp);
      }
      // AuthContext state change triggers RootLayout to redirect to (main)
    } catch (error) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP');
      if (error.requiresLogout) {
        router.replace('/(auth)/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    try {
      if (purpose === 'registration') {
        Alert.alert('OTP Resent', 'A new OTP has been sent to your number');
      } else {
        await sendLoginOTP(mobile);
        Alert.alert('OTP Resent', 'A new OTP has been sent to your number');
      }
      setResendCooldown(RESEND_COOLDOWN);
      startCooldown();
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    }
  };

  const renderOTPBoxes = () => {
    return Array.from({ length: OTP_LENGTH }).map((_, i) => {
      const char = otp[i] || '';
      const isActive = otp.length === i || (otp.length === OTP_LENGTH && i === OTP_LENGTH - 1);
      return (
        <TouchableOpacity
          key={i}
          style={[styles.otpBox, isActive && styles.otpBoxActive, char && styles.otpBoxFilled]}
          onPress={() => inputRef.current?.focus()}
          activeOpacity={0.8}
        >
          <Text style={styles.otpChar}>{char}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        {/* Hidden actual input */}
        <TextInput
          ref={inputRef}
          value={otp}
          onChangeText={(text) => setOtp(text.replace(/\D/g, '').slice(0, OTP_LENGTH))}
          keyboardType="numeric"
          maxLength={OTP_LENGTH}
          style={styles.hiddenInput}
          caretHidden
        />

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.emoji}>📱</Text>
          <Text style={styles.title}>Verify Mobile</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit OTP sent to{'\n'}
            <Text style={styles.mobile}>{mobile}</Text>
          </Text>

          <View style={styles.otpRow}>{renderOTPBoxes()}</View>

          <Button
            title="Verify OTP"
            onPress={handleVerify}
            loading={loading}
            disabled={otp.length !== OTP_LENGTH}
            style={styles.verifyBtn}
            size="large"
          />

          <TouchableOpacity
            onPress={handleResend}
            disabled={resendCooldown > 0}
            style={styles.resendBtn}
          >
            <Text style={[styles.resendText, resendCooldown > 0 && styles.resendDisabled]}>
              {resendCooldown > 0
                ? `Resend OTP in ${resendCooldown}s`
                : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 24 },
  hiddenInput: { position: 'absolute', opacity: 0, height: 0 },
  backBtn: { marginTop: 8, marginBottom: 16 },
  backText: { color: COLORS.primary, fontWeight: '600', fontSize: 16 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 10 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },
  mobile: { color: COLORS.primary, fontWeight: '700' },
  otpRow: { flexDirection: 'row', gap: 10, marginTop: 36, marginBottom: 36 },
  otpBox: {
    width: 48, height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxActive: { borderColor: COLORS.primary },
  otpBoxFilled: { borderColor: COLORS.primaryLight, backgroundColor: '#F1F8F1' },
  otpChar: { fontSize: 22, fontWeight: '700', color: COLORS.textPrimary },
  verifyBtn: { width: '100%' },
  resendBtn: { marginTop: 20 },
  resendText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  resendDisabled: { color: COLORS.textMuted },
});

export default OTPScreen;
