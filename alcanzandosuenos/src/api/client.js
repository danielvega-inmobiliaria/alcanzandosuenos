import { supabase } from './supabase';

// Cliente de la API real (Arquitectura Técnica, sección 2: Node/NestJS + Postgres).
// En Expo web, `localhost` apunta al mismo host donde corre el backend durante
// desarrollo. Para un dispositivo físico hay que apuntar EXPO_PUBLIC_API_URL a
// la IP/dominio donde esté publicado el backend (ver README).
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  // Cada request autenticado manda el JWT de la sesión de Supabase — el
  // backend lo valida en SupabaseAuthGuard (ver Sesión 4 de PROYECTO.md).
  // Sin sesión no debería llamarse a esto (RootNavigator no muestra las
  // pantallas que usan `api` hasta que hay sesión), pero por las dudas no
  // rompe si no hay token: el backend responde 401 y listo.
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;
  if (!res.ok) {
    const message = body?.message || `Error ${res.status} llamando a ${path}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  return body;
}

export const api = {
  // Se llama una vez al loguearse (ver AuthContext + RootNavigator) para
  // asegurar que exista la fila en `usuario` — el id/email salen del token,
  // no de acá.
  sincronizarUsuario: () => request('/usuarios/sync', { method: 'POST' }),
  crearMeta: (dto) => request('/metas', { method: 'POST', body: JSON.stringify(dto) }),
  listarMetas: (estado) => request(`/metas${estado && estado !== 'todas' ? `?estado=${estado}` : ''}`),
  buscarMeta: (id) => request(`/metas/${id}`),
  actualizarMeta: (id, dto) => request(`/metas/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  registrarAporte: (metaId, dto) =>
    request(`/metas/${metaId}/aportes`, { method: 'POST', body: JSON.stringify(dto) }),
  alternarPaso: (id) => request(`/pasos/${id}/alternar`, { method: 'PATCH' }),
  listarLogros: () => request('/logros'),
};
