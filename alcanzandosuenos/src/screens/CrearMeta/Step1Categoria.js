import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import ProgressDots from '../../components/ProgressDots';
import CategoryOption from '../../components/CategoryOption';
import Button from '../../components/Button';
import { useGoalWizard } from '../../state/GoalWizardContext';
import { colors, typography } from '../../theme/tokens';

// Backlog, Sprint 1, Historia 1:
// "Como usuario quiero elegir la categoría de mi meta ... para que la app
// sepa qué experiencia visual mostrarme más adelante."
export default function Step1Categoria({ navigation }) {
  const { category, setCategory, CATEGORIES } = useGoalWizard();

  return (
    <Screen
      title="Nueva meta"
      footer={<Button title="Continuar" onPress={() => navigation.navigate('Step2Numeros')} />}
    >
      <ProgressDots step={1} />
      <Text style={[typography.question, { color: colors.text }]}>¿Qué querés conseguir?</Text>
      <View style={styles.grid}>
        {CATEGORIES.map((c) => (
          <CategoryOption
            key={c.key}
            emoji={c.emoji}
            label={c.label}
            selected={category === c.key}
            onPress={() => setCategory(c.key)}
          />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
