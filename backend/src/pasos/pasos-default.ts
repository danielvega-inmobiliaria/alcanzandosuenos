// Pasos por defecto según categoría (Backlog, Sprint 2: "Pasos por defecto según
// categoría — por ejemplo, para un viaje: presupuesto, destino, pasajes,
// alojamiento, seguro; editable por el usuario").
export const PASOS_POR_CATEGORIA: Record<string, string[]> = {
  auto: [
    'Definir modelo y versión',
    'Cotizar en al menos 3 concesionarias',
    'Averiguar plan de financiación',
    'Reservar turno de entrega',
  ],
  casa: [
    'Definir zona y tipo de propiedad',
    'Pre-calificar crédito o reserva',
    'Visitar al menos 3 opciones',
    'Firmar boleto o reserva',
  ],
  viaje: [
    'Definir presupuesto',
    'Elegir destino',
    'Comprar pasajes',
    'Reservar alojamiento',
    'Contratar seguro de viaje',
  ],
  estudios: [
    'Elegir institución y programa',
    'Averiguar costos y becas',
    'Inscribirse',
    'Organizar materiales o equipo necesario',
  ],
  computadora: [
    'Definir especificaciones necesarias',
    'Comparar precios en al menos 3 sitios',
    'Elegir forma de pago',
    'Comprar',
  ],
  personal: [
    'Definir el objetivo concreto',
    'Investigar costos',
    'Armar el plan de ahorro',
    'Ejecutar la compra',
  ],
  personalizada: [
    'Definir el objetivo concreto',
    'Investigar costos',
    'Armar el plan de ahorro',
    'Ejecutar la compra',
  ],
};

export function pasosDefaultPara(categoria: string): string[] {
  return PASOS_POR_CATEGORIA[categoria] || PASOS_POR_CATEGORIA.personalizada;
}
