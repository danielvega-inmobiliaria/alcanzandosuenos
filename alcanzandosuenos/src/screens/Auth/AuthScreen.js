import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useAuth } from '../../state/AuthContext';
import { colors, spacing, typography } from '../../theme/tokens';

// Pantalla de login/registro (Arquitectura Técnica, módulo de Auth — Supabase
// Auth). Reemplaza al usuario demo único: sin sesión, no se ve ninguna otra
// pantalla de la app (ver RootNavigator).
export default function AuthScreen() {
  const { iniciarSesion, crearCuenta, authError } = useAuth();
  const [modo, setModo] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [mensajeExito, setMensajeExito] = useState(false);

  async function enviar() {
    if (!email || !password) {
      setMensajeExito(false);
      setMensaje('Completá email y contraseña.');
      return;
    }
    setEnviando(true);
    setMensaje(null);
    setMensajeExito(false);
    try {
      if (modo === 'login') {
        await iniciarSesion(email, password);
      } else {
        await crearCuenta(email, password);
        setMensajeExito(true);
        setMensaje('Cuenta creada. Revisá tu email (y la carpeta de spam) y confirmá la cuenta desde el link que te mandamos antes de entrar.');
      }
    } catch (e) {
      // authError ya queda seteado en el contexto; acá solo evitamos que
      // la excepción se propague sin manejo.
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.titulo}>Alcanzando Sueños</Text>
        <Text style={[typography.body, { color: colors.muted, marginBottom: spacing.xl }]}>
          {modo === 'login' ? 'Entrá para ver tus metas.' : 'Creá tu cuenta para empezar a ahorrar.'}
        </Text>

        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="vos@email.com"
        />
        <InputField
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          placeholder="••••••••"
        />

        {(mensaje || authError) ? (
          <Text style={mensajeExito && !authError ? styles.exito : styles.error}>
            {authError || mensaje}
          </Text>
        ) : null}

        {enviando ? (
          <ActivityIndicator color={colors.purple2} style={{ marginTop: spacing.md }} />
        ) : (
          <Button
            title={modo === 'login' ? 'Entrar' : 'Crear cuenta'}
            onPress={enviar}
            style={{ marginTop: spacing.sm }}
          />
        )}

        <Pressable onPress={() => { setModo(modo === 'login' ? 'signup' : 'login'); setMensaje(null); }} style={{ marginTop: spacing.lg }}>
          <Text style={styles.link}>
            {modo === 'login' ? '¿No tenés cuenta? Creá una' : '¿Ya tenés cuenta? Entrá'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.lg },
  titulo: { color: colors.text, fontSize: 24, fontWeight: '800', marginBottom: spacing.xs },
  error: { color: '#fca5a5', fontSize: 12.5, marginTop: spacing.xs, marginBottom: spacing.xs },
  exito: { color: '#86efac', fontSize: 12.5, marginTop: spacing.xs, marginBottom: spacing.xs },
  link: { color: colors.purple2, fontSize: 13, fontWeight: '700', textAlign: 'center' },
});
