import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '../../components/Screen';
import ProgressDots from '../../components/ProgressDots';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useGoalWizard } from '../../state/GoalWizardContext';
import { colors } from '../../theme/tokens';
import { programarRecordatorio } from '../../notifications/notificaciones';

function formatMoney(n) {
  return '$' + Math.round(n).toLocaleString('es-AR');
}
function formatDate(d) {
  return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Backlog, Sprint 1, Historia 4:
// "Como usuario quiero ver un resumen claro de mi plan ... antes de
// confirmar la meta." + mensaje motivador tipo "si ahorrás $X más..."
export default function Step4Resultado({ navigation }) {
  const { plan, frecuencia, crearMetaEnBackend, creando } = useGoalWizard();
  const [error, setError] = useState(null);
  const extraPorDia = 2000;
  const mesesGanados = plan.aportePorMes > 0
    ? Math.max(Math.round((extraPorDia * 30) / plan.aportePorMes), 0)
    : 0;

  async function empezarMeta() {
    setError(null);
    try {
      const meta = await crearMetaEnBackend();
      // Backlog Sprint 3, Historia 3: recordatorio periódico de aporte
      // (no bloquea la navegación si el usuario no da permiso o está en web).
      programarRecordatorio({ metaId: meta.id, titulo: meta.titulo, frecuencia }).catch(() => {});
      navigation.navigate('PhotoUpsell');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Screen
      title=""
      footer={
        <View style={{ gap: 8 }}>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            title={creando ? 'Creando meta…' : 'Empezar mi meta 🚀'}
            onPress={creando ? undefined : empezarMeta}
          />
        </View>
      }
    >
      <ProgressDots step={4} />
      <View style={styles.hero}>
        <View style={styles.check}>
          <Text style={{ color: '#fff', fontSize: 22 }}>✓</Text>
        </View>
        <Text style={styles.heroTitle}>¡Tu plan está listo!</Text>
        <Text style={styles.heroSub}>Mi primer auto 🚗 · {formatMoney(plan.montoNum)}</Text>
      </View>

      <Card>
        <Text style={styles.label}>Tenés que ahorrar</Text>
        <Text style={styles.big}>{formatMoney(plan.aportePorMes)} / mes</Text>
      </Card>

      <View style={styles.statRow}>
        <View style={styles.stat}>
          <Text style={styles.statN}>{formatDate(plan.fechaObjetivo)}</Text>
          <Text style={styles.statL}>Fecha objetivo</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statN}>{plan.plazoMeses} meses</Text>
          <Text style={styles.statL}>Duración</Text>
        </View>
      </View>

      {mesesGanados > 0 && (
        <Text style={styles.sub}>
          Si ahorrás ${extraPorDia.toLocaleString('es-AR')} más por día, llegás {mesesGanados} {mesesGanados === 1 ? 'mes' : 'meses'} antes.
        </Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 10, marginBottom: 8 },
  check: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.purple2,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  heroTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginBottom: 4 },
  heroSub: { color: colors.muted, fontSize: 12.5 },
  label: { fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  big: { fontSize: 22, fontWeight: '800', color: '#c9b3ff' },
  statRow: { flexDirection: 'row', gap: 10, marginVertical: 16 },
  stat: { flex: 1, backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 10, alignItems: 'center' },
  statN: { color: '#c9b3ff', fontSize: 16, fontWeight: '800' },
  statL: { color: colors.muted, fontSize: 10, marginTop: 2 },
  sub: { color: colors.muted, fontSize: 12.5 },
  error: { color: '#fca5a5', fontSize: 11.5, textAlign: 'center' },
});
