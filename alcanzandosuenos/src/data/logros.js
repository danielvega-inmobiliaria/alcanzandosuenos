// Backlog, Sprint 3: "avisos cuando alcanzo un hito" — textos para cada
// logro definido en la Arquitectura Técnica (tabla `logro`).
export const LOGRO_INFO = {
  primer_aporte: { emoji: '🌱', texto: '¡Primer aporte registrado!' },
  diez_por_ciento: { emoji: '🔥', texto: '¡Llegaste al 10% de tu meta!' },
  cincuenta_por_ciento: { emoji: '⭐', texto: '¡Vas a la mitad de tu meta!' },
  noventa_por_ciento: { emoji: '🏆', texto: '¡Estás al 90%, ya casi llegás!' },
  meta_cumplida: { emoji: '🎉', texto: '¡Meta cumplida!' },
  racha_30_dias: { emoji: '📅', texto: '¡Racha de 30 días ahorrando!' },
};

export function infoLogro(tipo) {
  return LOGRO_INFO[tipo] || { emoji: '🏅', texto: '¡Nuevo logro desbloqueado!' };
}
