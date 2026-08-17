import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradientFallback } from './LinearGradientFallback';
import { colors, radii } from '../theme/tokens';

export default function ProgressBar({ percent = 0, height = 8 }) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <View style={[styles.track, { height }]}>
      <LinearGradientFallback style={[styles.fill, { width: `${clamped}%`, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radii.pill,
    backgroundColor: colors.panel2,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  fill: { borderRadius: radii.pill },
});
