import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../api/supabase';

// Sesión real de Supabase Auth: reemplaza al USUARIO_DEMO que tenía
// GoalWizardContext (ver Sesión 4 de PROYECTO.md). Todo lo que antes asumía
// "hay un solo usuario" ahora cuelga de `session.user.id`, que es el mismo
// uuid que usa `usuario.id` en la base (ver backend/src/usuarios).
const AuthCtx = createContext(null);

// Supabase devuelve los mensajes de error en inglés y tal cual los generó
// internamente — acá los traducimos a algo que un usuario entienda y que le
// diga qué hacer. Si no reconocemos el mensaje, mostramos el original tal
// cual (mejor eso que ocultar el error).
function traducirErrorAuth(mensaje) {
  const m = (mensaje || '').toLowerCase();
  if (m.includes('email not confirmed')) {
    return 'Todavía no confirmaste tu email. Revisá tu casilla de correo (y la carpeta de spam) y hacé clic en el link de confirmación que te mandó Supabase antes de poder entrar.';
  }
  if (m.includes('invalid login credentials')) {
    return 'Email o contraseña incorrectos.';
  }
  if (m.includes('user already registered') || m.includes('already registered')) {
    return 'Ya existe una cuenta con ese email. Probá iniciar sesión en vez de crear una cuenta nueva.';
  }
  if (m.includes('password should be at least')) {
    return 'La contraseña tiene que tener al menos 6 caracteres.';
  }
  if (m.includes('unable to validate email address') || m.includes('invalid email')) {
    return 'Ese email no parece válido.';
  }
  return mensaje;
}

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
      setAuthError(traducirErrorAuth(error.message));
      throw error;
    }
  }

  async function crearCuenta(email, password) {
    setAuthError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setAuthError(traducirErrorAuth(error.message));
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
