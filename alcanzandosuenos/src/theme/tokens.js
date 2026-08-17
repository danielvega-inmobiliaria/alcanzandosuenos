// Alcanzando Sueños — Design tokens
// Extraídos del prototipo interactivo (wireframes) para mantener consistencia
// entre el prototipo de validación y la app real.

export const colors = {
  bg: '#08070c',
  panel: '#120f1a',
  panel2: '#17131f',
  card: '#1a1625',
  border: '#2a2438',
  purple: '#8b5cf6',
  purple2: '#a855f7',
  purpleDeep: '#6d28d9',
  text: '#f3f0fa',
  muted: '#a29cb5',
  green: '#34d399',
  amber: '#fbbf24',
  amberBg: 'rgba(251,191,36,0.10)',
  amberBorder: 'rgba(251,191,36,0.35)',
  amberText: '#fde39a',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
};

export const radii = {
  sm: 10,
  md: 14,
  lg: 16,
  xl: 22,
  pill: 999,
};

export const typography = {
  question: { fontSize: 19, fontWeight: '700', lineHeight: 25 },
  label: { fontSize: 11.5, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.muted },
  body: { fontSize: 14, color: colors.text },
  sub: { fontSize: 12.5, color: colors.muted },
  big: { fontSize: 22, fontWeight: '800', color: colors.text },
};

export default { colors, spacing, radii, typography };
