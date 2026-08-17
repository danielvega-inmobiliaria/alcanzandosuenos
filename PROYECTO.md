# ALCANZANDO SUEÑOS — Contexto del proyecto

## Cómo usar este archivo
- **Al empezar un chat nuevo:** pegá → `Leé PROYECTO.md y continuá desde donde quedamos`
- **Al terminar un chat:** pedí → `Actualizá PROYECTO.md con lo que hicimos hoy`

---

_Última actualización: 17/08/2026_

## Qué es este proyecto
App de ahorro para metas (originalmente pensada como "MisMetas"), pensada para que el usuario visualice lo que quiere lograr (auto, casa, viaje, estudios, etc.), planifique cómo llegar y se mantenga motivado en el camino. Combina: definición de metas con cálculo automático del aporte periódico, un simulador financiero educativo (separado claramente de asesoramiento financiero real, por regulación CNV), experiencias visuales que progresan con el ahorro (banco de imágenes curado, y a futuro fotos propias del usuario + IA), gamificación (logros/hitos), y varios modelos de monetización: publicidad contextual, leads de servicios financieros relacionados, colaboración voluntaria vía Mercado Pago, y una futura versión premium anclada en la cuota de generaciones con IA.

Nombre y marca ya decididos: **Alcanzando Sueños**. Dominio comprado: `alcanzandosuenos.com.ar`. Instagram: `alcanzandosuenos.app` (usuario) — la app en sí podría llamarse con variantes según disponibilidad; quedó pendiente la compra de `alcanzandosuenos.app` / `.com` (ver Pendientes). Hubo una ronda de research de nombres alternativos (MisSueños, LograndoMetas, Alcanzando la Meta, Sueño Logrado) antes de decidirse por este.

## Stack / Tecnología
- **App móvil:** React Native + Expo (SDK ~57), React Navigation (native-stack), React Context para estado compartido del wizard de creación de meta, `expo-linear-gradient`, `expo-notifications` (recordatorios y avisos de hitos — solo funciona en dispositivo nativo, no en web).
- **Backend:** Node.js + NestJS, cliente `pg` directo (sin ORM) contra PostgreSQL.
- **Base de datos:** PostgreSQL (probado localmente; en producción pensado para Supabase o RDS).
- **Autenticación:** pendiente — decidido en la Arquitectura Técnica usar Supabase Auth o Firebase Auth, todavía no implementado (hoy la app opera con un usuario demo único, sin login).
- **Pagos/colaboración:** Mercado Pago (Checkout Pro / botón de donación / suscripciones) — todavía no integrado.
- **Notificaciones push:** Firebase Cloud Messaging vía Expo Notifications — código de notificaciones locales ya armado, push remoto real pendiente (necesita proyecto Firebase/EAS).
- **Hosting backend:** pensado Railway/Render/AWS — hoy corre solo local (`http://localhost:3000`).

## Archivos importantes
Todo el código vive en un zip entregado en el chat (no en este repo local todavía — **pendiente crear repo Git y subir**, ver Pendientes). Estructura del proyecto:
- `alcanzandosuenos/` (app Expo) → `src/theme/` (design tokens), `src/components/` (sistema de diseño: Button, Card, Chip, InputField, CategoryOption, ProgressDots, ProgressBar, Screen), `src/screens/CrearMeta/` (wizard de 4 pasos + PhotoUpsell), `src/screens/Tablero/` (TableroMetas, DetalleMeta), `src/state/GoalWizardContext.js` (estado compartido + bootstrap de usuario demo), `src/api/client.js` (cliente HTTP contra el backend), `src/utils/seguimiento.js` (mensaje dinámico de ritmo de ahorro), `src/notifications/notificaciones.js` (recordatorios y avisos de hitos), `src/data/bancoImagenes.js` y `src/data/logros.js` (contenido curado estático).
- `backend/` (API NestJS, carpeta hermana de la app) → módulos `usuarios/`, `metas/`, `pasos/`, `logros/`, todos contra `db/db.module.ts` (Pool de `pg`). `schema.sql` con el modelo de datos completo (usuario, meta, aporte, paso, logro, escenario_simulacion, foto_usuario, generacion_ia).
- 4 documentos de producto (Word, generados y entregados en el chat, no en este repo local todavía): **PRD** (Documento de Producto), **Arquitectura Técnica**, **Backlog de Desarrollo (Fase 1)**, **Equipo Ideal**, más una **Guía de Validación** (script de entrevistas) y un prototipo interactivo HTML navegable.

---

## Pendientes

### 🔴 CRÍTICO
- [ ] Crear repo Git para el proyecto (app + backend) y subir el código — hoy los archivos están en esta carpeta pero sueltos, no versionados.
- [x] Bajar los archivos del chat a esta carpeta local — hecho: `alcanzandosuenos-fullstack.zip` (código, Sprint 0-4) + los 5 documentos Word/HTML (PRD, Arquitectura, Backlog, Equipo Ideal, Guía de Validación, prototipo interactivo).
- [ ] Autenticación real (Supabase Auth o Firebase Auth) — hoy la app usa un usuario demo único sin login, es el bloqueante más grande para cualquier uso real.
- [ ] Desplegar el backend en un hosting real (Railway/Render/AWS) — hoy solo corre local.

### 🟡 IMPORTANTE
- [x] Sprint 4, Historia 1: referencias de precio curadas al definir el monto (`src/data/referenciasPrecio.js`) — valores ilustrativos, falta cargar precios reales.
- [ ] Sprint 4 restante: beta cerrada con las 8 personas entrevistadas en la validación.
- [ ] Logro `racha_30_dias` — necesita un job programado que mida actividad diaria (hoy los demás logros se otorgan síncronamente al registrar un aporte, este no).
- [ ] Probar las notificaciones locales en un dispositivo real (no se pudo verificar en el entorno de desarrollo, que es solo navegador).
- [ ] Resolver `alcanzandosuenos.app` / `.com` (dominios, quedaron pendientes — ver Notas).
- [ ] Integración de Mercado Pago (colaboración voluntaria).

### 🟢 IDEAS FUTURAS (Fase 2/3 — fuera de alcance del MVP)
- [ ] Simulador de escenarios financieros completo (cuenta remunerada, plazo fijo, CEDEARs).
- [ ] Gamificación completa (más allá de los 6 logros ya implementados).
- [ ] Fotos propias del usuario sin IA (Sprint 5 del Backlog, ya diseñado, no implementado en código).
- [ ] Composición liviana con IA sobre fotos propias (Fase 2) y experiencias generativas avanzadas: recorridos, manejar, amoblar, viajar (Fase 3) — con cuota de generaciones por usuario, pensado como anzuelo de la versión Premium.
- [ ] Publicidad contextual real con anunciantes.

---

## Cambios recientes
- **Sesión 1 (naming + docs + validación):** decisión de nombre "Alcanzando Sueños", dominio `.com.ar` comprado, Instagram creado. Generados los 4 documentos de producto (PRD, Arquitectura, Backlog, Equipo Ideal) + Guía de Validación + prototipo HTML interactivo (10 pantallas, wireframes). Interpretados resultados de 8 entrevistas reales contra los criterios GO/NO-GO de la Guía de Validación → veredicto: avanzar a Fase 1 (MVP) sin ajustes al concepto central; hallazgo nuevo (publicidad/comparación valorada al definir la meta, no solo después) incorporado al Backlog Sprint 4. Diseñada la funcionalidad de experiencias visuales personalizadas con IA (fotos propias del usuario) en etapas por costo/madurez, con cuota de uso como anzuelo de un futuro tier Premium.
- **Sesión 2 (código real — Sprint 0-3):** Scaffold real de la app en React Native + Expo (Sprint 0: sistema de diseño; Sprint 1: wizard de crear meta con cálculo automático) y del backend en NestJS + PostgreSQL (`schema.sql` completo, validado contra Postgres real). Sprint 2: Tablero de metas (resumen + filtros) y Detalle de meta (plan de acción con pasos por defecto según categoría, imagen curada por corte de progreso 0/25/50/75/100, registro de aportes) — todo conectado al backend real, verificado de punta a punta con Playwright (crear meta → tablero → detalle → tildar paso → aporte → progreso actualizado), sin errores. Sprint 3: logros automáticos (primer aporte, 10/50/90/100% de progreso, otorgados en la misma transacción que el aporte, probados con curl), edición de título de meta, mensaje dinámico de seguimiento ("si mantenés este ritmo, llegás X antes/después", calculado con el ritmo real de ahorro), banner de hitos desbloqueados, y recordatorios locales con `expo-notifications` (no verificable en este entorno, solo funciona en dispositivo real). Todo entregado como zip (`alcanzandosuenos-fullstack.zip`) en el chat.
- **Sesión 3 (Sprint 4 + orden del proyecto):** Sprint 4, Historia 1: referencias de precio curadas por categoría en la pantalla de definir el monto (`src/data/referenciasPrecio.js`), rotuladas como contenido curado y separadas del cálculo del plan, verificado con Playwright. Creada esta carpeta del proyecto (`APP_ALCANZANDO_SUENOS`) con `PROYECTO.md` y `CLAUDE.md` (no existía hasta esta sesión), y bajados a acá todos los archivos entregados en el chat hasta ahora (código + documentos). Detectado y corregido un bug propio de zona horaria (se usaba `America/Buenos_Aires`, que no existe en tzdata y no aplicaba el offset — corregido a `America/Argentina/Buenos_Aires`).

---

## Notas / Decisiones tomadas
- El equipo ideal se armó **sin cifras de sueldo/costo** — decisión deliberada: las tarifas varían demasiado y un número desactualizado engaña más de lo que ayuda.
- Regulatorio (Argentina): el simulador siempre debe presentarse como "simulación educativa", nunca como "asesoramiento financiero" ni "recomendación" (CNV). Rotulado de publicidad según Ley 24.240. Datos personales según Ley 25.326. Si en algún momento la app maneja plata directamente (no solo Mercado Pago como intermediario), aplica regulación BCRA.
- Dominios: NIC.ar solo maneja `.ar`/`.com.ar`, no TLDs genéricos como `.app`/`.com` — para esos hay que ir a un registrador tipo Cloudflare. Nombres de dominio con "ñ" (IDN) generan fricción real en emails/tipeo — por eso se usó `alcanzandosuenos` (sin ñ) para dominio e Instagram.
- Existe una ONG argentina con el mismo nombre "Alcanzando Sueños" — riesgo de marca conocido y aceptado, con checklist de verificación manual pendiente (búsqueda INPI clases 9/36/42) antes de registrar la marca formalmente.
- Reglas de trabajo en el chat: Daniel prefiere ejecución directa y rápida ("cumplí los roles" = actuar como cada profesional necesario, no solo planificar) antes que preguntas de aclaración salvo que sean estrictamente necesarias. Preferencia también documentada en `CLAUDE.md` global: pie de página con contador de mensajes y horarios medidos (no estimados), y estas reglas de PROYECTO.md/HUB para no perder contexto entre chats.
