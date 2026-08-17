import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radii } from '../theme/tokens';

export default function Chip({ label, selected, onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSel, style]}
    >
      <Text style={[styles.label, selected && styles.labelSel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: radii.sm,
    backgroundColor: colors.panel2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSel: {
    backgroundColor: colors.purple2,
    borderColor: 'transparent',
  },
  label: { fontSize: 12, color: colors.muted },
  labelSel: { color: '#fff', fontWeight: '700' },
});
