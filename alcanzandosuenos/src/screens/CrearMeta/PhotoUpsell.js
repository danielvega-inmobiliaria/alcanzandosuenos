import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import CategoryOption from '../../components/CategoryOption';
import Button from '../../components/Button';
import { colors } from '../../theme/tokens';

// Backlog, Sprint 5 (opcional/post-MVP), Historia 1:
// "Como usuario quiero subir fotos reales de mi auto, casa o destino ...
// para ver mi propio objetivo en vez de una imagen genérica."
// El disclaimer de IA es obligatorio por PRD, sección 8.
export default function PhotoUpsell({ navigation }) {
  return (
    <Screen
      title="Personalizá tu experiencia"
      onBack={() => navigation.goBack()}
      footer={
        <View style={{ gap: 10 }}>
          <Button title="Continuar" onPress={() => navigation.navigate('TableroMetas')} />
          <Button title="Usar imágenes genéricas" variant="secondary" onPress={() => navigation.navigate('TableroMetas')} />
        </View>
      }
    >
      <Text style={styles.q}>Subí fotos de tu auto real 🚗</Text>
      <Text style={styles.sub}>Así vas a poder ver tu propio auto en vez de uno genérico. Es opcional.</Text>
      <View style={styles.grid}>
        <CategoryOption emoji="📷" label="Exterior" selected={false} onPress={() => {}} />
        <CategoryOption emoji="📷" label="Interior" selected={false} onPress={() => {}} />
      </View>
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          <Text style={{ fontWeight: '700', color: '#fff2c9' }}>Importante: </Text>
          las experiencias generadas a partir de tus fotos son una recreación con IA, no una foto o video real.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  q: { fontSize: 19, fontWeight: '700', color: colors.text, marginBottom: 6 },
  sub: { fontSize: 12.5, color: colors.muted, marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  disclaimer: {
    backgroundColor: colors.amberBg,
    borderWidth: 1,
    borderColor: colors.amberBorder,
    borderRadius: 10,
    padding: 11,
    marginTop: 12,
  },
  disclaimerText: { color: colors.amberText, fontSize: 10.5, lineHeight: 15 },
});
