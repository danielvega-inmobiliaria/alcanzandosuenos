import { formatMoney } from './format';

// Backlog, Sprint 3, Historia 2: "Como usuario quiero ver mensajes dinámicos
// de seguimiento ('si mantenés este ritmo, llegás en X') para sentirme
// motivado en el uso diario." — compara el ritmo real de aportes desde que
// se creó la meta contra la fecha objetivo.
export function mensajeSeguimiento(meta) {
  if (!meta || meta.estado !== 'activa') return null;
  if (!meta.aportes || meta.aportes.length === 0) {
    return { tono: 'neutral', texto: 'Todavía no registraste aportes. En cuanto sumes el primero vamos a poder estimar tu ritmo.' };
  }

  const creada = new Date(meta.creada_en);
  const hoy = new Date();
  const diasTranscurridos = Math.max(1, Math.round((hoy - creada) / (1000 * 60 * 60 * 24)));
  const mesesTranscurridos = Math.max(diasTranscurridos / 30, 1 / 30);

  const montoActual = Number(meta.monto_actual);
  const montoObjetivo = Number(meta.monto_objetivo);
  const restante = Math.max(montoObjetivo - montoActual, 0);
  const ritmoMensual = montoActual / mesesTranscurridos;

  if (restante === 0) {
    return { tono: 'positivo', texto: '¡Ya juntaste todo lo que necesitabas! 🎉' };
  }
  if (ritmoMensual <= 0) {
    return { tono: 'neutral', texto: 'Todavía es pronto para estimar tu ritmo de ahorro.' };
  }

  const mesesRestantes = restante / ritmoMensual;
  const fechaProyectada = new Date(hoy);
  fechaProyectada.setDate(fechaProyectada.getDate() + Math.round(mesesRestantes * 30));
  const fechaObjetivo = new Date(meta.fecha_objetivo);

  const diferenciaDias = Math.round((fechaObjetivo - fechaProyectada) / (1000 * 60 * 60 * 24));
  const diferenciaMeses = Math.round(Math.abs(diferenciaDias) / 30);

  if (diferenciaDias >= 15) {
    return diferenciaMeses > 0
      ? { tono: 'positivo', texto: `Si mantenés este ritmo (${formatMoney(ritmoMensual)}/mes), llegás ${diferenciaMeses} ${diferenciaMeses === 1 ? 'mes' : 'meses'} antes de lo previsto.` }
      : { tono: 'positivo', texto: `Si mantenés este ritmo (${formatMoney(ritmoMensual)}/mes), vas a llegar antes de lo previsto.` };
  }
  if (diferenciaDias <= -15) {
    const faltante = Math.max(Math.round(restante / Math.max(mesesRestantes, 1)) - Math.round(ritmoMensual), 0);
    return {
      tono: 'alerta',
      texto: diferenciaMeses > 0
        ? `Si mantenés este ritmo (${formatMoney(ritmoMensual)}/mes), llegás ${diferenciaMeses} ${diferenciaMeses === 1 ? 'mes' : 'meses'} más tarde de lo previsto.`
        : `Si mantenés este ritmo (${formatMoney(ritmoMensual)}/mes), vas a llegar un poco más tarde de lo previsto.`,
    };
  }
  return { tono: 'neutral', texto: `Vas justo a tiempo con tu ritmo actual de ${formatMoney(ritmoMensual)}/mes.` };
}
