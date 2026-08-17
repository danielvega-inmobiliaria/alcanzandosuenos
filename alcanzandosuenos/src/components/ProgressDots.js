import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

export default function ProgressDots({ step, total = 4 }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.dot, i < step && styles.dotDone]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  dot: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.border },
  dotDone: { backgroundColor: colors.purple2 },
});
