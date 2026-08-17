// Cliente de la API real (Arquitectura Técnica, sección 2: Node/NestJS + Postgres).
// En Expo web, `localhost` apunta al mismo host donde corre el backend durante
// desarrollo. Para un dispositivo físico hay que apuntar EXPO_PUBLIC_API_URL a
// la IP/dominio donde esté publicado el backend (ver README).
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
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
  crearUsuario: (dto) => request('/usuarios', { method: 'POST', body: JSON.stringify(dto) }),
  crearMeta: (dto) => request('/metas', { method: 'POST', body: JSON.stringify(dto) }),
  listarMetas: (usuarioId, estado) =>
    request(`/metas?usuario_id=${usuarioId}${estado && estado !== 'todas' ? `&estado=${estado}` : ''}`),
  buscarMeta: (id) => request(`/metas/${id}`),
  actualizarMeta: (id, dto) => request(`/metas/${id}`, { method: 'PATCH', body: JSON.stringify(dto) }),
  registrarAporte: (metaId, dto) =>
    request(`/metas/${metaId}/aportes`, { method: 'POST', body: JSON.stringify(dto) }),
  alternarPaso: (id) => request(`/pasos/${id}/alternar`, { method: 'PATCH' }),
  listarLogros: (usuarioId) => request(`/usuarios/${usuarioId}/logros`),
};
