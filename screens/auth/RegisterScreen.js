import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, Alert,
  TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants';

const RegisterScreen = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    address: '',
    district: '',
    state: '',
    dateOfBirth: '',
  });

  const updateField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile is required';
    else if (!/^\+?[1-9]\d{9,14}$/.test(form.mobile.trim()))
      newErrors.mobile = 'Use format: +919876543210';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.district.trim()) newErrors.district = 'District is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    if (!form.dateOfBirth.trim()) newErrors.dateOfBirth = 'Date of birth is required';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dateOfBirth.trim()))
      newErrors.dateOfBirth = 'Format: YYYY-MM-DD';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await register({
        ...form,
        mobile: form.mobile.trim(),
        fullName: form.fullName.trim(),
      });
      router.push({
        pathname: '/(auth)/otp',
        params: { mobile: form.mobile.trim(), purpose: 'registration' },
      });
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🌾</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Fill in your details to get started</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Input
              label="Full Name"
              value={form.fullName}
              onChangeText={updateField('fullName')}
              placeholder="Enter your full name"
              error={errors.fullName}
              autoCapitalize="words"
            />
            <Input
              label="Mobile Number"
              value={form.mobile}
              onChangeText={updateField('mobile')}
              placeholder="+919876543210"
              keyboardType="phone-pad"
              error={errors.mobile}
              autoCapitalize="none"
            />
            <Input
              label="Address"
              value={form.address}
              onChangeText={updateField('address')}
              placeholder="Village / Town / City"
              error={errors.address}
              multiline
              numberOfLines={2}
            />
            <Input
              label="District"
              value={form.district}
              onChangeText={updateField('district')}
              placeholder="Enter district"
              error={errors.district}
            />
            <Input
              label="State"
              value={form.state}
              onChangeText={updateField('state')}
              placeholder="Enter state"
              error={errors.state}
            />
            <Input
              label="Date of Birth"
              value={form.dateOfBirth}
              onChangeText={updateField('dateOfBirth')}
              placeholder="YYYY-MM-DD"
              keyboardType="numeric"
              error={errors.dateOfBirth}
            />

            <Button
              title="Send OTP"
              onPress={handleRegister}
              loading={loading}
              style={styles.btn}
              size="large"
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={styles.loginLink}
            >
              <Text style={styles.loginText}>
                Already registered? <Text style={styles.loginLinkBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: 24 },
  header: { alignItems: 'center', marginBottom: 32, marginTop: 16 },
  logo: { fontSize: 52, marginBottom: 12 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center' },
  form: { flex: 1 },
  btn: { marginTop: 8 },
  loginLink: { marginTop: 20, alignItems: 'center' },
  loginText: { color: COLORS.textSecondary, fontSize: 14 },
  loginLinkBold: { color: COLORS.primary, fontWeight: '700' },
});

export default RegisterScreen;
