import React from 'react';
import {
  TouchableOpacity, Text, ActivityIndicator, StyleSheet, View
} from 'react-native';
import { COLORS } from '../../constants';

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
  leftIcon,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : '#fff'} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: { flexDirection: 'row', alignItems: 'center' },
  leftIcon: { marginRight: 8 },

  // Variants
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.secondary },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: COLORS.error },

  // Sizes
  small: { paddingHorizontal: 16, paddingVertical: 8 },
  medium: { paddingHorizontal: 24, paddingVertical: 14 },
  large: { paddingHorizontal: 32, paddingVertical: 16 },

  // Disabled
  disabled: { opacity: 0.5 },

  // Text base
  text: { fontWeight: '700', letterSpacing: 0.3 },

  // Variant texts
  primaryText: { color: '#fff' },
  secondaryText: { color: '#fff' },
  outlineText: { color: COLORS.primary },
  ghostText: { color: COLORS.primary },
  dangerText: { color: '#fff' },

  // Size texts
  smallText: { fontSize: 13 },
  mediumText: { fontSize: 15 },
  largeText: { fontSize: 17 },
});

export default Button;
