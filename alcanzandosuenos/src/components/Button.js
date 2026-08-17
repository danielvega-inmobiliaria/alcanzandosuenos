import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { LinearGradientFallback } from './LinearGradientFallback';
import { colors, radii, spacing } from '../theme/tokens';

export default function Button({ title, onPress, variant = 'primary', style }) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}>
      {isPrimary ? (
        <LinearGradientFallback style={styles.btnPrimary}>
          <Text style={styles.textPrimary}>{title}</Text>
        </LinearGradientFallback>
      ) : (
        <Text style={[styles.textSecondary]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btnPrimary: {
    paddingVertical: 14,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textPrimary: { color: '#fff', fontWeight: '700', fontSize: 14 },
  textSecondary: {
    color: colors.text,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 14,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel2,
  },
});
