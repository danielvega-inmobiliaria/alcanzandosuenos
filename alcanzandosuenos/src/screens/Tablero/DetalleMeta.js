import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Screen from '../../components/Screen';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ProgressBar from '../../components/ProgressBar';
import { api } from '../../api/client';
import { imagenParaProgreso } from '../../data/bancoImagenes';
import { infoLogro } from '../../data/logros';
import { notificarLogro } from '../../notifications/notificaciones';
import { mensajeSeguimiento } from '../../utils/seguimiento';
import { formatMoney, formatDate } from '../../utils/format';
import { colors, spacing, radii } from '../../theme/tokens';

const TONO_COLOR = { positivo: colors.green, neutral: colors.muted, alerta: colors.amber };

// Backlog, Sprint 2 (plan de acción + imagen por progreso) y Sprint 3
// (mensaje de seguimiento, editar/pausar meta, hitos) — todo contra el
// backend real.
export default function DetalleMeta({ route, navigation }) {
  const { metaId } = route.params;
  const [meta, setMeta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [montoAporte, setMontoAporte] = useState('');
  const [guardandoAporte, setGuardandoAporte] = useState(false);
  const [editandoTitulo, setEditandoTitulo] = useState(false);
  const [tituloEdit, setTituloEdit] = useState('');
  const [guardandoTitulo, setGuardandoTitulo] = useState(false);
  const [logrosNuevos, setLogrosNuevos] = useState([]);

  const cargar = useCallback(() => {
    setCargando(true);
    api
      .buscarMeta(metaId)
      .then(setMeta)
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, [metaId]);

  useFocusEffect(useCallback(() => { cargar(); }, [cargar]));

  async function alternarPaso(pasoId) {
    try {
      await api.alternarPaso(pasoId);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  async function registrarAporte() {
    const monto = Number(montoAporte);
    if (!monto || monto <= 0) return;
    setGuardandoAporte(true);
    setError(null);
    try {
      const res = await api.registrarAporte(metaId, { monto });
      setMontoAporte('');
      if (res.nuevosLogros && res.nuevosLogros.length > 0) {
        setLogrosNuevos(res.nuevosLogros);
        res.nuevosLogros.forEach((l) => notificarLogro(l.tipo).catch(() => {}));
      }
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardandoAporte(false);
    }
  }

  async function pausarOReanudar() {
    if (!meta) return;
    const nuevoEstado = meta.estado === 'pausada' ? 'activa' : 'pausada';
    try {
      await api.actualizarMeta(metaId, { estado: nuevoEstado });
      cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  function empezarEdicionTitulo() {
    setTituloEdit(meta.titulo);
    setEditandoTitulo(true);
  }

  async function guardarTitulo() {
    const nuevo = tituloEdit.trim();
    if (!nuevo || nuevo === meta.titulo) {
      setEditandoTitulo(false);
      return;
    }
    setGuardandoTitulo(true);
    try {
      await api.actualizarMeta(metaId, { titulo: nuevo });
      setEditandoTitulo(false);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardandoTitulo(false);
    }
  }

  if (cargando && !meta) {
    return (
      <Screen title="Meta" onBack={() => navigation.goBack()}>
        <ActivityIndicator color={colors.purple2} style={{ marginTop: 30 }} />
      </Screen>
    );
  }

  if (!meta) {
    return (
      <Screen title="Meta" onBack={() => navigation.goBack()}>
        <Text style={styles.error}>{error || 'No se encontró la meta.'}</Text>
      </Screen>
    );
  }

  const img = imagenParaProgreso(meta.categoria, meta.progreso);
  const seguimiento = mensajeSeguimiento(meta);

  return (
    <Screen
      title={editandoTitulo ? 'Editando…' : meta.titulo}
      onBack={() => navigation.goBack()}
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {logrosNuevos.length > 0 && (
        <View style={styles.logroBanner}>
          {logrosNuevos.map((l) => {
            const info = infoLogro(l.tipo);
            return (
              <Text key={l.id} style={styles.logroTexto}>
                {info.emoji} {info.texto}
              </Text>
            );
          })}
          <Pressable onPress={() => setLogrosNuevos([])} hitSlop={8}>
            <Text style={styles.logroCerrar}>Cerrar</Text>
          </Pressable>
        </View>
      )}

      {editandoTitulo ? (
        <Card>
          <TextInput
            value={tituloEdit}
            onChangeText={setTituloEdit}
            style={styles.inputTitulo}
            placeholder="Nombre de la meta"
            placeholderTextColor={colors.muted}
            autoFocus
          />
          <View style={styles.editRow}>
            <Pressable onPress={guardandoTitulo ? undefined : guardarTitulo} style={styles.editBtn}>
              <Text style={styles.editBtnText}>{guardandoTitulo ? 'Guardando…' : 'Guardar'}</Text>
            </Pressable>
            <Pressable onPress={() => setEditandoTitulo(false)}>
              <Text style={styles.editCancelar}>Cancelar</Text>
            </Pressable>
          </View>
        </Card>
      ) : (
        <Pressable onPress={empezarEdicionTitulo}>
          <Text style={styles.editarTituloLink}>✏️ Editar nombre de la meta</Text>
        </Pressable>
      )}

      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>{img.emoji}</Text>
        <Text style={styles.heroTexto}>{img.texto}</Text>
      </View>

      <Card>
        <View style={styles.pctRow}>
          <Text style={styles.pctBig}>{meta.progreso}%</Text>
          <Text style={styles.pctLabel}>
            {formatMoney(meta.monto_actual)} de {formatMoney(meta.monto_objetivo)}
          </Text>
        </View>
        <ProgressBar percent={meta.progreso} height={10} />
        <View style={styles.metaRow}>
          <Text style={styles.metaInfo}>Objetivo: {formatDate(meta.fecha_objetivo)}</Text>
          <Text style={styles.metaInfo}>{formatMoney(meta.aporte_periodico)} / mes</Text>
        </View>
      </Card>

      {seguimiento && (
        <Card style={{ borderColor: TONO_COLOR[seguimiento.tono] }}>
          <Text style={[styles.seguimientoTexto, { color: TONO_COLOR[seguimiento.tono] }]}>
            {seguimiento.texto}
          </Text>
        </Card>
      )}

      <Text style={styles.seccion}>Plan de acción</Text>
      <Card>
        {meta.pasos.map((p) => (
          <Pressable key={p.id} onPress={() => alternarPaso(p.id)} style={styles.paso}>
            <View style={[styles.check, p.estado === 'completado' && styles.checkOn]}>
              {p.estado === 'completado' ? <Text style={styles.checkMark}>✓</Text> : null}
            </View>
            <Text style={[styles.pasoTexto, p.estado === 'completado' && styles.pasoTextoOn]}>
              {p.descripcion}
            </Text>
          </Pressable>
        ))}
      </Card>

      <Text style={styles.seccion}>Registrar un aporte</Text>
      <Card>
        <View style={styles.aporteRow}>
          <TextInput
            value={montoAporte}
            onChangeText={setMontoAporte}
            placeholder="Monto"
            placeholderTextColor={colors.muted}
            keyboardType="numeric"
            style={styles.input}
          />
          <Pressable
            onPress={guardandoAporte ? undefined : registrarAporte}
            style={styles.aporteBtn}
          >
            <Text style={styles.aporteBtnText}>{guardandoAporte ? '...' : 'Sumar'}</Text>
          </Pressable>
        </View>
        {meta.aportes.length > 0 ? (
          <View style={{ marginTop: 12 }}>
            {meta.aportes.slice(0, 5).map((a) => (
              <View key={a.id} style={styles.aporteItem}>
                <Text style={styles.aporteItemTexto}>{formatDate(a.fecha)}</Text>
                <Text style={styles.aporteItemMonto}>+{formatMoney(a.monto)}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.sinAportes}>Todavía no registraste aportes.</Text>
        )}
      </Card>

      <Button
        title={meta.estado === 'pausada' ? 'Reanudar meta' : 'Pausar meta'}
        variant="secondary"
        onPress={pausarOReanudar}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  error: { color: '#fca5a5', fontSize: 12, marginBottom: 10 },
  logroBanner: {
    backgroundColor: 'rgba(168,85,247,0.15)', borderWidth: 1, borderColor: colors.purple2,
    borderRadius: radii.md, padding: 12, marginBottom: 14, gap: 6,
  },
  logroTexto: { color: colors.text, fontSize: 13, fontWeight: '700' },
  logroCerrar: { color: colors.muted, fontSize: 11, marginTop: 4, textAlign: 'right' },
  editarTituloLink: { color: colors.muted, fontSize: 11.5, marginBottom: 14 },
  inputTitulo: {
    backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.sm, paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontSize: 14,
  },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 10 },
  editBtn: { backgroundColor: colors.purple2, borderRadius: radii.sm, paddingHorizontal: 14, paddingVertical: 8 },
  editBtnText: { color: '#fff', fontWeight: '700', fontSize: 12.5 },
  editCancelar: { color: colors.muted, fontSize: 12.5 },
  hero: {
    alignItems: 'center', paddingVertical: 22, marginBottom: 16,
    backgroundColor: colors.panel2, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border,
  },
  heroEmoji: { fontSize: 44, marginBottom: 8 },
  heroTexto: { color: colors.text, fontSize: 13, fontWeight: '600' },
  pctRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 },
  pctBig: { color: '#c9b3ff', fontSize: 22, fontWeight: '800' },
  pctLabel: { color: colors.muted, fontSize: 11.5 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  metaInfo: { color: colors.muted, fontSize: 11 },
  seguimientoTexto: { fontSize: 12.5, fontWeight: '600', lineHeight: 18 },
  seccion: { color: colors.text, fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 4 },
  paso: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  check: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.purple2, borderColor: 'transparent' },
  checkMark: { color: '#fff', fontSize: 13, fontWeight: '800' },
  pasoTexto: { color: colors.text, fontSize: 13, flex: 1 },
  pasoTextoOn: { color: colors.muted, textDecorationLine: 'line-through' },
  aporteRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1, backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.border,
    borderRadius: radii.sm, paddingHorizontal: 12, paddingVertical: 10, color: colors.text, fontSize: 13,
  },
  aporteBtn: {
    backgroundColor: colors.purple2, borderRadius: radii.sm, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center',
  },
  aporteBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  aporteItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  aporteItemTexto: { color: colors.muted, fontSize: 11.5 },
  aporteItemMonto: { color: colors.green, fontSize: 11.5, fontWeight: '700' },
  sinAportes: { color: colors.muted, fontSize: 11.5, marginTop: 4 },
});
