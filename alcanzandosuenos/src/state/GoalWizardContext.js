import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

// Estado compartido del flujo "Crear una meta" (Backlog, Sprint 1).
// Cada pantalla lee/escribe acá en vez de pasar props manualmente entre pasos.
// Desde Sesión 4 el usuario ya no es un demo local: `usuarioId` es el id real
// de la sesión de Supabase Auth (ver AuthContext) — este provider solo vive
// dentro del árbol autenticado (ver RootNavigator), así que siempre hay un
// usuarioId cuando se monta.

const GoalWizardCtx = createContext(null);

export const CATEGORIES = [
  { key: 'auto', emoji: '🚗', label: 'Un auto' },
  { key: 'casa', emoji: '🏠', label: 'Una casa' },
  { key: 'viaje', emoji: '✈️', label: 'Un viaje' },
  { key: 'estudios', emoji: '🎓', label: 'Estudios' },
  { key: 'computadora', emoji: '💻', label: 'Computadora' },
  { key: 'personal', emoji: '💍', label: 'Algo personal' },
];

const PLAZOS = [6, 12, 24];

export function GoalWizardProvider({ children }) {
  const { usuarioId } = useAuth();
  const [category, setCategory] = useState('auto');
  const [monto, setMonto] = useState('10000000');
  const [plazoMeses, setPlazoMeses] = useState(12);
  const [ahorroActual, setAhorroActual] = useState('0');
  const [frecuencia, setFrecuencia] = useState('semana'); // dia | semana | mes
  const [aporte, setAporte] = useState('46000');

  const [usuarioListo, setUsuarioListo] = useState(false);
  const [usuarioError, setUsuarioError] = useState(null);
  const [creando, setCreando] = useState(false);
  const [metaCreadaId, setMetaCreadaId] = useState(null);

  // Se asegura de que exista la fila en `usuario` (upsert por id de Supabase)
  // antes de dejar usar el resto de la app — ver POST /usuarios/sync.
  useEffect(() => {
    setUsuarioListo(false);
    setUsuarioError(null);
    api
      .sincronizarUsuario()
      .then(() => setUsuarioListo(true))
      .catch((e) => setUsuarioError(e.message));
  }, [usuarioId]);

  // Cálculo automático del plan (backlog Sprint 1: "la app calcula
  // automáticamente el aporte periódico necesario y una fecha objetivo realista")
  const plan = useMemo(() => {
    const montoNum = Number(monto) || 0;
    const ahorroNum = Number(ahorroActual) || 0;
    const restante = Math.max(montoNum - ahorroNum, 0);
    const aportePorMes = plazoMeses > 0 ? Math.round(restante / plazoMeses) : 0;
    const hoy = new Date(2026, 7, 17); // fecha fija del proyecto para que la demo sea determinística
    const fechaObjetivo = new Date(hoy.getFullYear(), hoy.getMonth() + plazoMeses, hoy.getDate());
    return { montoNum, ahorroNum, restante, aportePorMes, fechaObjetivo, plazoMeses };
  }, [monto, ahorroActual, plazoMeses]);

  // Backlog Sprint 1, Historia 4: "Botón 'Empezar mi meta' crea el registro
  // y lleva al tablero" — acá crea la meta de verdad contra el backend.
  async function crearMetaEnBackend() {
    if (!usuarioListo) throw new Error('Todavía no se pudo conectar con el servidor. Probá de nuevo.');
    setCreando(true);
    try {
      const catInfo = CATEGORIES.find((c) => c.key === category);
      const meta = await api.crearMeta({
        categoria: category,
        titulo: catInfo ? catInfo.label : 'Mi meta',
        monto_objetivo: plan.montoNum,
        monto_actual: plan.ahorroNum,
        fecha_objetivo: plan.fechaObjetivo.toISOString().slice(0, 10),
        aporte_periodico: plan.aportePorMes,
      });
      setMetaCreadaId(meta.id);
      return meta;
    } finally {
      setCreando(false);
    }
  }

  // Limpia el wizard antes de arrancar una meta nueva desde el tablero, para
  // no arrastrar los valores de la meta anterior.
  function resetWizard() {
    setCategory('auto');
    setMonto('10000000');
    setPlazoMeses(12);
    setAhorroActual('0');
    setFrecuencia('semana');
    setAporte('46000');
    setMetaCreadaId(null);
  }

  const value = {
    category, setCategory, CATEGORIES,
    monto, setMonto,
    plazoMeses, setPlazoMeses, PLAZOS,
    ahorroActual, setAhorroActual,
    frecuencia, setFrecuencia,
    aporte, setAporte,
    plan,
    usuarioId, usuarioListo, usuarioError,
    creando, metaCreadaId,
    crearMetaEnBackend,
    resetWizard,
  };

  return <GoalWizardCtx.Provider value={value}>{children}</GoalWizardCtx.Provider>;
}

export function useGoalWizard() {
  const ctx = useContext(GoalWizardCtx);
  if (!ctx) throw new Error('useGoalWizard debe usarse dentro de <GoalWizardProvider>');
  return ctx;
}
