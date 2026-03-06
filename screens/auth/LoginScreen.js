import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Alert, TouchableOpacity,
  SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants';

const LoginScreen = () => {
  const router = useRouter();
  const { sendLoginOTP } = useAuth();
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!mobile.trim()) { setError('Mobile number is required'); return false; }
    if (!/^\+?[1-9]\d{9,14}$/.test(mobile.trim())) {
      setError('Enter valid number e.g. +919876543210');
      return false;
    }
    setError('');
    return true;
  };

  const handleSendOTP = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await sendLoginOTP(mobile.trim());
      router.push({
        pathname: '/(auth)/otp',
        params: { mobile: mobile.trim(), purpose: 'login' },
      });
    } catch (err) {
      if (err.status === 404) {
        Alert.alert(
          'Not Registered',
          'No account found. Would you like to register?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Register', onPress: () => router.push('/(auth)/register') },
          ]
        );
      } else {
        Alert.alert('Error', err.message || 'Failed to send OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.logo}>🌾</Text>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Enter your mobile number to login</Text>

          <View style={styles.form}>
            <Input
              label="Mobile Number"
              value={mobile}
              onChangeText={(val) => { setMobile(val); setError(''); }}
              placeholder="+919876543210"
              keyboardType="phone-pad"
              autoCapitalize="none"
              error={error}
            />

            <Button
              title="Send OTP"
              onPress={handleSendOTP}
              loading={loading}
              size="large"
              style={styles.btn}
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/register')}
              style={styles.registerLink}
            >
              <Text style={styles.registerText}>
                New here? <Text style={styles.linkBold}>Create Account</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  logo: { fontSize: 60, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 40 },
  form: {},
  btn: { marginTop: 4 },
  registerLink: { marginTop: 24, alignItems: 'center' },
  registerText: { color: COLORS.textSecondary, fontSize: 14 },
  linkBold: { color: COLORS.primary, fontWeight: '700' },
});

export default LoginScreen;
