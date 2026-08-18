# ALCANZANDO SUEÑOS — Contexto del proyecto

## Cómo usar este archivo
- **Al empezar un chat nuevo:** pegá → `Leé PROYECTO.md y continuá desde donde quedamos`
- **Al terminar un chat:** pedí → `Actualizá PROYECTO.md con lo que hicimos hoy`

---

_Última actualización: 17/08/2026 (Sesión 4)_

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
Desde la Sesión 4, el código y los documentos están versionados en un repo Git local dentro de esta misma carpeta (`APP_ALCANZANDO_SUENOS/.git`). Ya no depende del zip suelto. Estructura del proyecto:
- `alcanzandosuenos/` (app Expo) → `src/theme/` (design tokens), `src/components/` (sistema de diseño: Button, Card, Chip, InputField, CategoryOption, ProgressDots, ProgressBar, Screen), `src/screens/CrearMeta/` (wizard de 4 pasos + PhotoUpsell), `src/screens/Tablero/` (TableroMetas, DetalleMeta), `src/state/GoalWizardContext.js` (estado compartido + bootstrap de usuario demo), `src/api/client.js` (cliente HTTP contra el backend), `src/utils/seguimiento.js` (mensaje dinámico de ritmo de ahorro), `src/notifications/notificaciones.js` (recordatorios y avisos de hitos), `src/data/bancoImagenes.js` y `src/data/logros.js` (contenido curado estático).
- `backend/` (API NestJS, carpeta hermana de la app) → módulos `usuarios/`, `metas/`, `pasos/`, `logros/`, todos contra `db/db.module.ts` (Pool de `pg`). `schema.sql` con el modelo de datos completo (usuario, meta, aporte, paso, logro, escenario_simulacion, foto_usuario, generacion_ia).
- 4 documentos de producto (Word): **PRD** (Documento de Producto), **Arquitectura Técnica**, **Backlog de Desarrollo (Fase 1)**, **Equipo Ideal**, más una **Guía de Validación** (script de entrevistas) y un prototipo interactivo HTML navegable. Todos versionados en el repo junto con el código.
- `alcanzandosuenos-fullstack.zip` se mantiene en la carpeta como respaldo pero ya no es la fuente de verdad (está en `.gitignore`, no versionado — el código versionado son las carpetas `alcanzandosuenos/` y `backend/` ya extraídas).

---

## Pendientes

### 🔴 CRÍTICO
- [x] Crear repo Git para el proyecto (app + backend + docs) — hecho en Sesión 4: repo local inicializado en `APP_ALCANZANDO_SUENOS/`, 3 commits. Remoto conectado (ver ítem siguiente).
- [x] Crear el repo remoto en GitHub y conectarlo — hecho en Sesión 4: `https://github.com/danielvega-inmobiliaria/alcanzandosuenos` (**público**, decisión de Daniel — el objetivo es que cualquiera pueda bajar y usar la app, no solo ver el código).
- [x] Primer `git push -u origin master` — hecho en Sesión 4 desde la PC de Daniel (109 objetos, 598.90 KiB). El código y los 5 documentos ya están públicos en GitHub.
- [ ] **Antes de que la autenticación esté lista**, sacar el valor por defecto hardcodeado `password: 'postgres'` en `backend/src/db/db.module.ts` (línea del `Pool` de `pg`) — hoy es inofensivo (solo aplica si no seteás `PGPASSWORD`, y no hay otras credenciales ni `.env` en el repo, repo público revisado y confirmado limpio en Sesión 4), pero antes de desplegar con auth real no debe quedar ningún default de contraseña en el código, todo por variables de entorno del hosting.
- [x] Bajar los archivos del chat a esta carpeta local — hecho: `alcanzandosuenos-fullstack.zip` (código, Sprint 0-4) + los 5 documentos Word/HTML (PRD, Arquitectura, Backlog, Equipo Ideal, Guía de Validación, prototipo interactivo).
- [ ] Autenticación real (Supabase Auth o Firebase Auth) — hoy la app usa un usuario demo único sin login, es el bloqueante más grande para cualquier uso real. **Importante:** mientras no haya auth, el backend no debe quedar accesible desde internet sin protección (ver Notas) — es más urgente resolver esto que el hosting en sí.
- [ ] Desplegar el backend en un hosting real (Railway/Render/AWS) — hoy solo corre local. Recomendado Railway (free tier, Postgres incluido), pero recién después de tener auth real, no antes.
- [ ] Para que la app sea instalable de verdad por cualquier usuario (más allá del repo público, que es solo el código): a corto plazo compartir vía Expo Go (rápido, sin revisión de tienda); a mediano plazo publicar en Google Play (~u$s25 único) y App Store (~u$s99/año). Quedó frenado en Sesión 4 porque requiere el backend desplegado primero.

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
- **Sesión 4 (repo Git local + remoto GitHub):** Resuelto el pendiente crítico de versionado. Se extrajo `alcanzandosuenos-fullstack.zip` a las carpetas `alcanzandosuenos/` y `backend/`, se armó `.gitignore` (node_modules, builds nativos, .env, el zip original) y se inicializó un repo Git en `APP_ALCANZANDO_SUENOS/` con 3 commits: el inicial (código Expo + NestJS + los 5 documentos Word + prototipo HTML + PROYECTO.md/CLAUDE.md), uno para ignorar una carpeta de residuos técnicos, y uno de actualización de este mismo archivo. El repo se armó en un entorno intermedio y se trasplantó a la carpeta local para evitar un problema del puente remoto con esta carpeta de Windows (no puede borrar archivos temporales de `git`, deja sueltos `.lock`/`tmp_obj`) — el repo resultante quedó limpio (`git status` sin cambios pendientes) y funciona con normalidad para vos usando git directo en tu máquina (esa limitación es solo de este entorno remoto). **Ojo:** si en algún momento usás `git` a través de mí (Claude) en esta carpeta y ves un error de `index.lock` ya existe, es ese mismo problema — decime y lo resuelvo moviendo el lock. Antes de crear el remoto se revisó el código en busca de credenciales/secretos hardcodeados (no se encontró ninguno, solo un default `postgres` inofensivo en `db.module.ts`, ver Pendientes 🔴) para poder decidir con criterio la visibilidad. Repo remoto creado en GitHub bajo la cuenta `danielvega-inmobiliaria`: `https://github.com/danielvega-inmobiliaria/alcanzandosuenos`, **público** (decisión explícita de Daniel: el objetivo es que cualquier usuario pueda bajar y usar la app, no solo mostrar el código — se le aclaró que el repo público es el código fuente, no lo mismo que una app instalable, y que la instalación real pasa por Expo Go a corto plazo o las tiendas a mediano plazo). Daniel hizo el primer `git push -u origin master` desde su PC — código y documentos ya públicos en GitHub. Pendiente crítico de versionado 100% cerrado.

---

## Notas / Decisiones tomadas
- El equipo ideal se armó **sin cifras de sueldo/costo** — decisión deliberada: las tarifas varían demasiado y un número desactualizado engaña más de lo que ayuda.
- Regulatorio (Argentina): el simulador siempre debe presentarse como "simulación educativa", nunca como "asesoramiento financiero" ni "recomendación" (CNV). Rotulado de publicidad según Ley 24.240. Datos personales según Ley 25.326. Si en algún momento la app maneja plata directamente (no solo Mercado Pago como intermediario), aplica regulación BCRA.
- Dominios: NIC.ar solo maneja `.ar`/`.com.ar`, no TLDs genéricos como `.app`/`.com` — para esos hay que ir a un registrador tipo Cloudflare. Nombres de dominio con "ñ" (IDN) generan fricción real en emails/tipeo — por eso se usó `alcanzandosuenos` (sin ñ) para dominio e Instagram.
- Existe una ONG argentina con el mismo nombre "Alcanzando Sueños" — riesgo de marca conocido y aceptado, con checklist de verificación manual pendiente (búsqueda INPI clases 9/36/42) antes de registrar la marca formalmente.
- Reglas de trabajo en el chat: Daniel prefiere ejecución directa y rápida ("cumplí los roles" = actuar como cada profesional necesario, no solo planificar) antes que preguntas de aclaración salvo que sean estrictamente necesarias. Preferencia también documentada en `CLAUDE.md` global: pie de página con contador de mensajes y horarios medidos (no estimados), y estas reglas de PROYECTO.md/HUB para no perder contexto entre chats.
- El puente remoto a la PC de Daniel (usado por Claude en Sesión 4) no puede hacer `git push` (sin acceso a red) ni tocar credenciales/logins (por política) — el flujo que funciona es: yo dejo el repo local listo con el remoto conectado, y Daniel corre `git push -u origin master` él mismo desde una terminal en su PC (Git Bash, VS Code, etc.), usando su login de GitHub habitual (usuario `danielvega-inmobiliaria`).
