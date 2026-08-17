import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/tokens';

// Envoltorio fino sobre expo-linear-gradient con el gradiente violeta
// de marca ya cargado, para no repetir los colores en cada pantalla.
export function LinearGradientFallback({ style, children }) {
  return (
    <LinearGradient
      colors={[colors.purple, colors.purple2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}
