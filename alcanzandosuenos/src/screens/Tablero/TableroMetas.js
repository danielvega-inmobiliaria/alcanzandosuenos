import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { useGoalWizard, CATEGORIES } from '../../state/GoalWizardContext';
import { api } from '../../api/client';
import { formatMoney } from '../../utils/format';
import { colors, spacing } from '../../theme/tokens';

const FILTROS = [
  { key: 'todas', label: 'Todas' },
  { key: 'activa', label: 'Activas' },
  { key: 'completada', label: 'Completadas' },
  { key: 'pausada', label: 'Pausadas' },
];

function emojiDe(categoria) {
  return CATEGORIES.find((c) => c.key === categoria)?.emoji || '🎯';
}

// Backlog, Sprint 2, Historia 1:
// "Como usuario quiero ver todas mis metas en un tablero para tener una
// vista general de mi progreso" — resumen general + filtros por estado.
export default function TableroMetas({ navigation }) {
  const { usuarioId, usuarioError, resetWizard } = useGoalWizard();
  const [filtro, setFiltro] = useState('todas');
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(() => {
    if (!usuarioId) return;
    setCargando(true);
    api
      .listarMetas(usuarioId, filtro)
      .then((res) => setData(res))
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [usuarioId, filtro]);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar]),
  );

  const resumen = data?.resumen;
  const metas = data?.metas || [];

  return (
    <Screen
      title="Mis metas"
      footer={
        <Button
          title="+ Nueva meta"
          onPress={() => {
            resetWizard();
            navigation.navigate('Step1Categoria');
          }}
        />
      }
    >
      {usuarioError ? (
        <Text style={styles.error}>No se pudo conectar con el servidor: {usuarioError}</Text>
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {resumen ? (
        <Card>
          <View style={styles.resumenTop}>
            <Text style={styles.resumenBig}>{resumen.progreso_general}%</Text>
            <Text style={styles.resumenLabel}>progreso general</Text>
          </View>
          <ProgressBar percent={resumen.progreso_general} height={10} />
          <View style={styles.resumenRow}>
            <View style={styles.resumenStat}>
              <Text style={styles.resumenN}>{resumen.activas}</Text>
              <Text style={styles.resumenL}>Activas</Text>
            </View>
            <View style={styles.resumenStat}>
              <Text style={styles.resumenN}>{resumen.completadas}</Text>
              <Text style={styles.resumenL}>Completadas</Text>
            </View>
            <View style={styles.resumenStat}>
              <Text style={styles.resumenN}>{resumen.pausadas}</Text>
              <Text style={styles.resumenL}>Pausadas</Text>
            </View>
          </View>
        </Card>
      ) : null}

      <View style={styles.filtros}>
        {FILTROS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFiltro(f.key)}
            style={[styles.filtroChip, filtro === f.key && styles.filtroChipSel]}
          >
            <Text style={[styles.filtroText, filtro === f.key && styles.filtroTextSel]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      {cargando ? (
        <ActivityIndicator color={colors.purple2} style={{ marginTop: 20 }} />
      ) : metas.length === 0 ? (
        <Text style={styles.vacio}>No hay metas en este filtro todavía.</Text>
      ) : (
        metas.map((m) => {
          const progreso = Number(m.monto_objetivo) > 0
            ? Math.min(100, Math.round((Number(m.monto_actual) / Number(m.monto_objetivo)) * 100))
            : 0;
          return (
            <Pressable key={m.id} onPress={() => navigation.navigate('DetalleMeta', { metaId: m.id })}>
              <Card>
                <View style={styles.metaTop}>
                  <Text style={styles.metaEmoji}>{emojiDe(m.categoria)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.metaTitulo}>{m.titulo}</Text>
                    <Text style={styles.metaSub}>
                      {formatMoney(m.monto_actual)} de {formatMoney(m.monto_objetivo)}
                    </Text>
                  </View>
                  <Text style={styles.metaPct}>{progreso}%</Text>
                </View>
                <ProgressBar percent={progreso} />
              </Card>
            </Pressable>
          );
        })
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: { color: '#fca5a5', fontSize: 12, marginBottom: 10 },
  resumenTop: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 8 },
  resumenBig: { color: '#c9b3ff', fontSize: 24, fontWeight: '800' },
  resumenLabel: { color: colors.muted, fontSize: 12 },
  resumenRow: { flexDirection: 'row', marginTop: 14, gap: 10 },
  resumenStat: { flex: 1, alignItems: 'center' },
  resumenN: { color: colors.text, fontSize: 16, fontWeight: '800' },
  resumenL: { color: colors.muted, fontSize: 10, marginTop: 2 },
  filtros: { flexDirection: 'row', gap: 8, marginBottom: spacing.md, flexWrap: 'wrap' },
  filtroChip: {
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999,
    backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.border,
  },
  filtroChipSel: { backgroundColor: colors.purple2, borderColor: 'transparent' },
  filtroText: { color: colors.muted, fontSize: 12 },
  filtroTextSel: { color: '#fff', fontWeight: '700' },
  vacio: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: 30 },
  metaTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  metaEmoji: { fontSize: 26 },
  metaTitulo: { color: colors.text, fontSize: 14, fontWeight: '700' },
  metaSub: { color: colors.muted, fontSize: 11.5, marginTop: 2 },
  metaPct: { color: '#c9b3ff', fontSize: 14, fontWeight: '800' },
});
