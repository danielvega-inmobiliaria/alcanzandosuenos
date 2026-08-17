import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
});
