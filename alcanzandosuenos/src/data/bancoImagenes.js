// Banco de imágenes curado por categoría y corte de progreso
// (Arquitectura Técnica, sección 3.1 — MVP, sin generación dinámica).
// Estos son placeholders (emoji + texto) hasta contar con la fototeca real;
// el criterio de selección (categoría + corte 0/25/50/75/100) ya es el final.
const CORTES = [0, 25, 50, 75, 100];

const BANCO = {
  auto: [
    { emoji: '🔑', texto: 'Arrancás a juntar para tu auto' },
    { emoji: '🚗', texto: 'Ya se empieza a ver de lejos' },
    { emoji: '🚙', texto: 'A mitad de camino' },
    { emoji: '🏁', texto: 'Está cada vez más cerca' },
    { emoji: '🎉', texto: '¡Es tuyo!' },
  ],
  casa: [
    { emoji: '📐', texto: 'El terreno, listo para empezar' },
    { emoji: '🧱', texto: 'Los cimientos ya están' },
    { emoji: '🏗️', texto: 'La obra avanza' },
    { emoji: '🏠', texto: 'Ya casi se puede entrar' },
    { emoji: '🎉', texto: '¡Las llaves son tuyas!' },
  ],
  viaje: [
    { emoji: '🗺️', texto: 'Eligiendo el destino' },
    { emoji: '🎒', texto: 'Armando las valijas' },
    { emoji: '✈️', texto: 'A mitad de camino' },
    { emoji: '🧳', texto: 'Ya casi es hora de viajar' },
    { emoji: '🎉', texto: '¡Buen viaje!' },
  ],
  estudios: [
    { emoji: '📚', texto: 'Arrancás a juntar' },
    { emoji: '✏️', texto: 'Vas armando el plan' },
    { emoji: '🎓', texto: 'A mitad de camino' },
    { emoji: '📖', texto: 'Ya casi está' },
    { emoji: '🎉', texto: '¡Lo lograste!' },
  ],
  computadora: [
    { emoji: '🪙', texto: 'Arrancás a juntar' },
    { emoji: '🖱️', texto: 'Ya se empieza a ver de lejos' },
    { emoji: '💻', texto: 'A mitad de camino' },
    { emoji: '⌨️', texto: 'Está cada vez más cerca' },
    { emoji: '🎉', texto: '¡Es tuya!' },
  ],
  personal: [
    { emoji: '✨', texto: 'Arrancás a juntar' },
    { emoji: '🌱', texto: 'Ya se empieza a ver de lejos' },
    { emoji: '🌟', texto: 'A mitad de camino' },
    { emoji: '💫', texto: 'Está cada vez más cerca' },
    { emoji: '🎉', texto: '¡Lo lograste!' },
  ],
};

export function imagenParaProgreso(categoria, progreso) {
  const serie = BANCO[categoria] || BANCO.personal;
  let indice = 0;
  CORTES.forEach((corte, i) => {
    if (progreso >= corte) indice = i;
  });
  return serie[indice];
}
