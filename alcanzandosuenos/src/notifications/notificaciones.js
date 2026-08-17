import { Platform } from 'react-native';
import { infoLogro } from '../data/logros';

// Backlog, Sprint 3, Historia 3: "recibir notificaciones de recordatorio de
// aporte y avisos cuando alcanzo un hito." Arquitectura Técnica: "Firebase
// Cloud Messaging (vía Expo Notifications)".
//
// expo-notifications no tiene soporte en web (las funciones son no-op ahí:
// Expo web no expone ninguna API de notificaciones del sistema operativo).
// En un dispositivo real (iOS/Android) sí funciona con este mismo código.
// Los recordatorios remotos (push, con alguien más disparándolos desde el
// servidor) necesitan además un proyecto de Firebase/EAS configurado — eso
// queda para cuando se despliegue el backend de verdad (ver README).

let Notifications = null;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line global-require
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export async function pedirPermisoNotificaciones() {
  if (!Notifications) return false;
  const { status } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  const { status: nuevoStatus } = await Notifications.requestPermissionsAsync();
  return nuevoStatus === 'granted';
}

const INTERVALO_SEGUNDOS = { dia: 60 * 60 * 24, semana: 60 * 60 * 24 * 7, mes: 60 * 60 * 24 * 30 };

// Programa el recordatorio periódico de aporte para una meta recién creada
// (Backlog Sprint 3, Historia 3).
export async function programarRecordatorio({ metaId, titulo, frecuencia }) {
  if (!Notifications) return null;
  const ok = await pedirPermisoNotificaciones();
  if (!ok) return null;
  const seconds = INTERVALO_SEGUNDOS[frecuencia] || INTERVALO_SEGUNDOS.semana;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Alcanzando Sueños 💜',
      body: `¿Ya sumaste tu aporte para "${titulo}" hoy?`,
      data: { metaId },
    },
    trigger: { seconds, repeats: true },
  });
}

// Notificación local inmediata al desbloquear un hito (Backlog Sprint 3,
// Historia 3: "avisos cuando alcanzo un hito").
export async function notificarLogro(tipo) {
  if (!Notifications) return null;
  const ok = await pedirPermisoNotificaciones();
  if (!ok) return null;
  const { emoji, texto } = infoLogro(tipo);
  return Notifications.scheduleNotificationAsync({
    content: { title: `${emoji} ${texto}`, body: 'Tocá para ver tu progreso.' },
    trigger: null,
  });
}

export const notificacionesDisponibles = Platform.OS !== 'web';
