import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
  TouchableOpacity, SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api.service';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants';

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

const ProfileScreen = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    address: user?.address || '',
    district: user?.district || '',
    state: user?.state || '',
    dateOfBirth: user?.dateOfBirth
      ? new Date(user.dateOfBirth).toISOString().split('T')[0]
      : '',
  });

  const updateField = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.district.trim()) newErrors.district = 'District is required';
    if (!form.state.trim()) newErrors.state = 'State is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await apiService.put('/users/me', form);
      updateUser(response.data.user);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Update Failed', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setForm({
      fullName: user?.fullName || '',
      address: user?.address || '',
      district: user?.district || '',
      state: user?.state || '',
      dateOfBirth: user?.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split('T')[0]
        : '',
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.name}>{user?.fullName}</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Verified Farmer</Text>
          </View>
        </View>

        {/* Edit / Save buttons */}
        <View style={styles.actionRow}>
          {isEditing ? (
            <>
              <Button
                title="Save Changes"
                onPress={handleSave}
                loading={loading}
                style={styles.halfBtn}
              />
              <Button
                title="Cancel"
                onPress={handleCancelEdit}
                variant="outline"
                style={styles.halfBtn}
              />
            </>
          ) : (
            <Button
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              variant="outline"
              style={{ flex: 1 }}
            />
          )}
        </View>

        {/* Profile Fields */}
        <SectionHeader title="Personal Information" />

        <Input
          label="Full Name"
          value={form.fullName}
          onChangeText={updateField('fullName')}
          editable={isEditing}
          error={errors.fullName}
          autoCapitalize="words"
        />

        {/* Mobile — always read-only */}
        <Input
          label="Mobile Number"
          value={user?.mobile || ''}
          editable={false}
          rightIcon={<Text style={styles.lockedIcon}>🔒</Text>}
        />

        <Input
          label="Date of Birth"
          value={form.dateOfBirth}
          onChangeText={updateField('dateOfBirth')}
          editable={isEditing}
          keyboardType="numeric"
          placeholder="YYYY-MM-DD"
        />

        <SectionHeader title="Location" />

        <Input
          label="Address"
          value={form.address}
          onChangeText={updateField('address')}
          editable={isEditing}
          error={errors.address}
          multiline
          numberOfLines={2}
        />
        <Input
          label="District"
          value={form.district}
          onChangeText={updateField('district')}
          editable={isEditing}
          error={errors.district}
        />
        <Input
          label="State"
          value={form.state}
          onChangeText={updateField('state')}
          editable={isEditing}
          error={errors.state}
        />

        {/* Settings Section */}
        <SectionHeader title="Settings" />

        {/* Language — placeholder for Azure integration */}
        <TouchableOpacity style={styles.settingRow}>
          <Text style={styles.settingIcon}>🌐</Text>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Language</Text>
            <Text style={styles.settingValue}>English (Coming Soon)</Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        {/* Sign Out */}
        <Button
          title="Sign Out"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutBtn}
        />

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 20, marginTop: 8 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '800', color: '#fff' },
  name: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 6 },
  verifiedBadge: {
    backgroundColor: '#E8F5E9', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  verifiedText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  halfBtn: { flex: 1 },
  sectionHeader: {
    fontSize: 13, fontWeight: '700', color: COLORS.textMuted,
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: 12, marginTop: 8,
  },
  lockedIcon: { fontSize: 16 },
  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 12,
    padding: 16, marginBottom: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  settingIcon: { fontSize: 22, marginRight: 14 },
  settingText: { flex: 1 },
  settingTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  settingValue: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  settingArrow: { fontSize: 20, color: COLORS.textMuted },
  logoutBtn: { marginTop: 8 },
});

export default ProfileScreen;
