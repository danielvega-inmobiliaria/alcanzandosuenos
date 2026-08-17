import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import ProgressDots from '../../components/ProgressDots';
import InputField from '../../components/InputField';
import Chip from '../../components/Chip';
import Button from '../../components/Button';
import { useGoalWizard } from '../../state/GoalWizardContext';
import { colors, typography } from '../../theme/tokens';

const FRECUENCIAS = [
  { key: 'dia', label: 'Por día' },
  { key: 'semana', label: 'Por semana' },
  { key: 'mes', label: 'Por mes' },
];

// Backlog, Sprint 1, Historia 3:
// "Como usuario quiero indicar cuánto tengo ahorrado hoy y cuánto puedo
// separar ... para que el plan sea realista desde el arranque."
export default function Step3Partida({ navigation }) {
  const { ahorroActual, setAhorroActual, frecuencia, setFrecuencia, aporte, setAporte } = useGoalWizard();

  return (
    <Screen
      title="Nueva meta"
      onBack={() => navigation.goBack()}
      footer={<Button title="Calcular mi plan" onPress={() => navigation.navigate('Step4Resultado')} />}
    >
      <ProgressDots step={3} />
      <Text style={[typography.question, { color: colors.text }]}>¿Cómo estás arrancando?</Text>

      <InputField
        label="¿Cuánto tenés ahorrado hoy?"
        value={ahorroActual}
        onChangeText={setAhorroActual}
        keyboardType="numeric"
        placeholder="0"
      />

      <Text style={styles.label}>¿Cuánto podés separar?</Text>
      <View style={styles.chipRow}>
        {FRECUENCIAS.map((f) => (
          <Chip key={f.key} label={f.label} selected={frecuencia === f.key} onPress={() => setFrecuencia(f.key)} />
        ))}
      </View>
      <InputField value={aporte} onChangeText={setAporte} keyboardType="numeric" placeholder="46000" />
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
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
});
