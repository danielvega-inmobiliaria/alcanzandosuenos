import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

// Estado compartido del flujo "Crear una meta" (Backlog, Sprint 1).
// Cada pantalla lee/escribe acá en vez de pasar props manualmente entre pasos.
// A partir de Sprint 2 este contexto también habla con el backend real
// (crear usuario/meta, sin autenticación todavía — ver README).

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

// Sin autenticación todavía (queda para el módulo de Auth de la Arquitectura
// Técnica). Mientras tanto, la app opera como un único usuario demo local,
// creado (o recuperado, por email) contra el backend real al arrancar.
const USUARIO_DEMO = { nombre: 'Daniel', email: 'demo@alcanzandosuenos.local' };

export function GoalWizardProvider({ children }) {
  const [category, setCategory] = useState('auto');
  const [monto, setMonto] = useState('10000000');
  const [plazoMeses, setPlazoMeses] = useState(12);
  const [ahorroActual, setAhorroActual] = useState('0');
  const [frecuencia, setFrecuencia] = useState('semana'); // dia | semana | mes
  const [aporte, setAporte] = useState('46000');

  const [usuarioId, setUsuarioId] = useState(null);
  const [usuarioError, setUsuarioError] = useState(null);
  const [creando, setCreando] = useState(false);
  const [metaCreadaId, setMetaCreadaId] = useState(null);

  useEffect(() => {
    api
      .crearUsuario(USUARIO_DEMO)
      .then((u) => setUsuarioId(u.id))
      .catch((e) => setUsuarioError(e.message));
  }, []);

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
    if (!usuarioId) throw new Error('Todavía no se pudo conectar con el servidor. Probá de nuevo.');
    setCreando(true);
    try {
      const catInfo = CATEGORIES.find((c) => c.key === category);
      const meta = await api.crearMeta({
        usuario_id: usuarioId,
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
    usuarioId, usuarioError,
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
