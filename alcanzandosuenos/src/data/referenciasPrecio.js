// Backlog, Sprint 4, Historia 1: "ver 2 o 3 referencias de precio u opciones
// relacionadas con mi categoría al momento de definir el monto de mi meta,
// para calibrar mejor cuánto necesito." MVP: contenido curado/estático por
// categoría, NO es una integración real de anunciantes (eso es Fase 2, ver
// PRD sección 7).
//
// IMPORTANTE: estos rangos son valores ilustrativos de ejemplo, no precios de
// mercado verificados — antes de llevar esto a producción hay que cargar
// referencias reales y mantenerlas actualizadas (la inflación en Argentina
// las desactualiza rápido).
export const REFERENCIAS_POR_CATEGORIA = {
  auto: [
    { label: 'Usado gama media', rango: '$8.000.000 - $12.000.000' },
    { label: '0km gama baja', rango: '$15.000.000 - $20.000.000' },
    { label: 'Usado gama alta', rango: '$18.000.000 - $25.000.000' },
  ],
  casa: [
    { label: 'Depto 1 ambiente (usado)', rango: '$40.000.000 - $60.000.000' },
    { label: 'Depto 2 ambientes (usado)', rango: '$60.000.000 - $90.000.000' },
    { label: 'Casa 3 ambientes (usado)', rango: '$90.000.000 - $140.000.000' },
  ],
  viaje: [
    { label: 'Escapada regional', rango: '$500.000 - $1.000.000' },
    { label: 'Viaje a Latinoamérica', rango: '$1.500.000 - $3.000.000' },
    { label: 'Viaje a Europa o EE.UU.', rango: '$3.500.000 - $6.000.000' },
  ],
  estudios: [
    { label: 'Curso o certificación corta', rango: '$200.000 - $600.000' },
    { label: 'Posgrado o especialización', rango: '$1.500.000 - $4.000.000' },
    { label: 'Programa en el exterior', rango: '$5.000.000 - $15.000.000' },
  ],
  computadora: [
    { label: 'Notebook gama básica', rango: '$700.000 - $1.200.000' },
    { label: 'Notebook gama media', rango: '$1.200.000 - $2.000.000' },
    { label: 'Notebook gama alta / gamer', rango: '$2.200.000 - $3.500.000' },
  ],
  personal: [
    { label: 'Referencia baja', rango: '$300.000 - $800.000' },
    { label: 'Referencia media', rango: '$800.000 - $2.000.000' },
    { label: 'Referencia alta', rango: '$2.000.000 - $5.000.000' },
  ],
};

export function referenciasDe(categoria) {
  return REFERENCIAS_POR_CATEGORIA[categoria] || REFERENCIAS_POR_CATEGORIA.personal;
}
