import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Cliente de Supabase Auth (Arquitectura Técnica, módulo de Auth). Las claves
// son públicas por diseño (la "anon key" está pensada para viajar en el
// cliente — la seguridad real la da el JWT firmado, no ocultar esta clave),
// pero igual conviene setearlas por variable de entorno y no hardcodeadas acá
// para poder tener distintos proyectos de Supabase por ambiente (dev/prod).
// Ver `.env.example`.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // No tiramos una excepción para que la app siga abriendo (y se pueda ver el
  // resto de las pantallas mientras se termina de configurar Supabase), pero
  // el login directamente no va a andar hasta que esto esté seteado.
  // eslint-disable-next-line no-console
  console.warn(
    '[Supabase] Faltan EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY — el login no va a funcionar hasta configurarlas (ver README).',
  );
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
