import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';

export default function InputField({ label, value, onChangeText, keyboardType = 'default', placeholder }) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md },
  label: {
    fontSize: 11.5,
    color: colors.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.panel2,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: 13,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
