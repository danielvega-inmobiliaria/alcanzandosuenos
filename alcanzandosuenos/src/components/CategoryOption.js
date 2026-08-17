import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radii } from '../theme/tokens';

export default function CategoryOption({ emoji, label, selected, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.opt, selected && styles.optSel]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  opt: {
    flexBasis: '48%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  optSel: {
    borderColor: colors.purple2,
    backgroundColor: 'rgba(139,92,246,0.15)',
  },
  emoji: { fontSize: 26, marginBottom: 8 },
  label: { fontSize: 12.5, color: colors.text },
});
