export function formatMoney(n) {
  return '$' + Math.round(Number(n) || 0).toLocaleString('es-AR');
}

export function formatDate(d) {
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
}
