import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import ProgressDots from '../../components/ProgressDots';
import InputField from '../../components/InputField';
import Chip from '../../components/Chip';
import Button from '../../components/Button';
import { useGoalWizard } from '../../state/GoalWizardContext';
import { referenciasDe } from '../../data/referenciasPrecio';
import { colors, typography, radii } from '../../theme/tokens';

// Backlog, Sprint 1, Historia 2:
// "Como usuario quiero ingresar cuánto necesito y en cuánto tiempo para que
// la app calcule automáticamente mi aporte periódico."
export default function Step2Numeros({ navigation }) {
  const { category, monto, setMonto, plazoMeses, setPlazoMeses, PLAZOS } = useGoalWizard();
  const referencias = referenciasDe(category);

  return (
    <Screen
      title="Nueva meta"
      onBack={() => navigation.goBack()}
      footer={<Button title="Continuar" onPress={() => navigation.navigate('Step3Partida')} />}
    >
      <ProgressDots step={2} />
      <Text style={[typography.question, { color: colors.text }]}>Contanos los números 🚗</Text>

      <InputField
        label="¿Cuánto necesitás?"
        value={monto}
        onChangeText={setMonto}
        keyboardType="numeric"
        placeholder="10000000"
      />

      {/* Backlog Sprint 4, Historia 1: referencias curadas para calibrar el
          monto — separadas visualmente del cálculo del plan y rotuladas como
          contenido de referencia, no un anuncio ni una recomendación. */}
      <View style={styles.refBox}>
        <Text style={styles.refLabel}>Referencias · contenido curado, no un anuncio</Text>
        {referencias.map((r) => (
          <Pressable key={r.label} style={styles.refItem} onPress={() => setMonto(String(r.rango.match(/\d[\d.]*/)[0].replace(/\./g, '')))}>
            <Text style={styles.refItemLabel}>{r.label}</Text>
            <Text style={styles.refItemRango}>{r.rango}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>¿En cuánto tiempo lo querés lograr?</Text>
      <View style={styles.chipRow}>
        {PLAZOS.map((p) => (
          <Chip key={p} label={`${p} m`} selected={plazoMeses === p} onPress={() => setPlazoMeses(p)} />
        ))}
        <Chip label="Otro" selected={!PLAZOS.includes(plazoMeses)} onPress={() => setPlazoMeses(18)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11.5,
    color: colors.muted,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  refBox: {
    backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.md, padding: 12, marginTop: 16, marginBottom: 20, gap: 8,
  },
  refLabel: {
    fontSize: 10, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2,
  },
  refItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  refItemLabel: { color: colors.text, fontSize: 12.5 },
  refItemRango: { color: '#c9b3ff', fontSize: 12.5, fontWeight: '700' },
});
