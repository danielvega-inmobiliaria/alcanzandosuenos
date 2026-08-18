import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabase';

// Sesión real de Supabase Auth: reemplaza al USUARIO_DEMO que tenía
// GoalWizardContext (ver Sesión 4 de PROYECTO.md). Todo lo que antes asumía
// "hay un solo usuario" ahora cuelga de `session.user.id`, que es el mismo
// uuid que usa `usuario.id` en la base (ver backend/src/usuarios).
const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = todavía no sabemos; null = sin sesión
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nuevaSesion) => {
      setSession(nuevaSesion);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function iniciarSesion(email, password) {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  }

  async function crearCuenta(email, password) {
    setAuthError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(error.message);
      throw error;
    }
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
  }

  const value = {
    session,
    cargandoSesion: session === undefined,
    autenticado: !!session,
    usuarioId: session?.user?.id ?? null,
    email: session?.user?.email ?? null,
    authError,
    iniciarSesion,
    crearCuenta,
    cerrarSesion,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
