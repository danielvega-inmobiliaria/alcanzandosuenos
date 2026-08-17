import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/tokens';

export default function Screen({ title, onBack, children, footer }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.topbar}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12}>
            <Text style={styles.back}>‹</Text>
          </Pressable>
        ) : (
          <View style={{ width: 20 }} />
        )}
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 20 }} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  back: { color: colors.muted, fontSize: 22 },
  title: { color: colors.text, fontSize: 15, fontWeight: '700' },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, flexGrow: 1 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
});
