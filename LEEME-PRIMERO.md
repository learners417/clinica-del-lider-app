# v1.3 · versión final para conectar (26 sep 2026)

## Conectar con Supabase (15 minutos, una sola vez)
1. Supabase → New project (proyecto NUEVO, nunca el de TCD).
2. SQL Editor → correr en este orden: `0001_accesos.sql`, `0002_ficha.sql`, `0003_v13.sql`
   (carpeta `supabase/migrations`). Se pueden volver a correr sin romper nada.
3. Authentication → URL Configuration → Site URL = la URL de la app en Vercel.
4. Invitarte a ti mismo (Authentication → Users → Invite user), crear tu contraseña y en SQL Editor:
   `insert into public.accesos (user_id, email, tier, rol) values ('TU-USER-ID', 'tu@email.com', 'acompanado', 'admin');`
5. Vercel → Settings → Environment Variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `ALTA_KEY`, `DEEPSEEK_API_KEY` → Redeploy.
6. Entras → pestaña Admin → invitas pacientes y terapeutas (a los terapeutas, rol **Equipo**).
7. En `src/data/config.ts`: tu WhatsApp en `WHATSAPP_TERAPEUTA` y, si trabajas con un solo país,
   su número de emergencias en `AYUDA_URGENTE`.

## Qué suma la v1.3
1. **El consentimiento** antes del Chequeo: qué es, quién ve qué, cuándo se deriva. Se firma con el nombre.
2. **"Si esto te desborda"** en toda pantalla que va hacia adentro (dolor, origen, mensaje, yuxtaposición, Descarga).
3. **La línea de la semana:** el terapeuta la escribe desde Fichas; al paciente le queda fijada arriba de Hoy.
4. **La Descarga:** se escribe y se quema. El texto nunca se guarda; queda solo el día.
5. **El testimonio del Alta:** las preguntas de Javo, antes del certificado. El paciente elige si lo comparte.
6. **Las dos columnas** en la medición del día 42 y del 84: qué me faltó recibir, qué faltó de mí.
7. **Dosis 57:** avisa que el tercer mes cuesta distinto.
8. **Dos teléfonos:** al volver a la app, baja lo que se escribió en el otro antes de seguir.

## Verificado
- `npm run lint`, `npm run test:logica`, `npm run build`: OK.
- `npm run test:base`: las tres migraciones corridas en un Postgres real, dos veces, y 18 pruebas de
  quién ve qué (el paciente solo lo suyo; el equipo sin Mensaje del día 84 ni informes; el testimonio
  solo si se compartió; nadie se hace admin solo).

---

# v1.2 · conectada a Supabase: el camino en la nube y la ficha del terapeuta (24 sep 2026)

## Qué cambia
1. **El camino del paciente se guarda en su cuenta.** Todo lo que escribe (Chequeos, Signos,
   Dosis, Iceberg, sesiones, Jugadas, Mensaje del día 84) sube solo a Supabase un segundo y
   medio después de guardarse. Si cambia de teléfono, al entrar baja todo. Lo más nuevo gana,
   clave por clave. Sin red, sigue con el teléfono y sube cuando vuelve.
2. **Si en el mismo teléfono entra otra persona,** lo del anterior se borra antes de bajar lo suyo.
3. **Fichas** (pestaña nueva para rol Equipo y Admin): la lista de pacientes con la barandilla
   arriba de todo, y la ficha de cada uno: la validación (Iceberg y Jugada a tiempo, compromisos
   cumplidos, escala de cierre promedio), sus números, su último Iceberg entero, su última sesión
   y su última Jugada.
4. **La barandilla visible:** si un Chequeo marcó derivación, la ficha lo muestra en rojo hasta
   que alguien del equipo escribe qué se habló y la marca como hablada.
5. **El equipo ve solo lo clínico.** El Mensaje del día 84 y los informes quedan para el paciente
   (lo cuida la base, no la pantalla).
6. **Admin:** ahora se cambia el rol (Paciente / Equipo / Admin) desde la lista.

## Encender (una sola vez, 15 minutos)
Si todavía no hiciste la fase 2A, primero los pasos de README.md → "ENCENDER EL MODO NUBE".
Después:
1. Supabase → SQL Editor → pegar y correr `supabase/migrations/0002_ficha.sql`.
2. Admin → a cada terapeuta: invitarlo y ponerle rol **Equipo**.
3. Redeploy en Vercel (las variables son las mismas de la fase 2A).

## Importante para quien ya usa la app en modo local
La primera vez que entre con su cuenta, que lo haga **en el mismo teléfono donde tiene sus datos**:
se suben solos. Si entra desde otro, que antes descargue su respaldo en Mi Zona y lo restaure ahí.

## Verificado
- tsc, auditoría y check de api: OK.
- test:logica: todos pasan (11 tests nuevos de sincronización y de la ficha).
- vite build: correcto.

---

# v1.1 · la semana del Acompañado (24 sep 2026)

## Qué cambia
1. **El Iceberg guiado (la tarea del lunes).** Doce pantallas, una pregunta por vez:
   lo que se ve → las mentiras con “¿Qué más?” (mínimo tres) → la más fuerte → el miedo
   (“Gracias, mentiras…”) → el dolor → el origen con la edad (si es 18 o más: “Más atrás”)
   → el mensaje a quien eras → la yuxtaposición en tres pantallas (la frase vieja con su
   número, un hecho de este mes, las dos juntas y el número otra vez) → el permiso → el test
   bloquea/desbloquea línea por línea. Los Iceberg viejos se abren sin perder nada.
2. **La sesión dentro de la app** (pestaña nueva, se abre desde Hoy y desde Mi Zona).
   Entrada: revisión del compromiso anterior (sí/no), emoción, número, objetivo.
   Cierre: su verdad, escala 1-10, qué falta para 10, compromiso con día y hora y botón
   para ponerlo en Google Calendar.
3. **La Jugada (la tarea del miércoles):** entregable + evidencia.
4. **Enviar a mi terapeuta:** el Iceberg y la Jugada salen por WhatsApp como texto.
   Para que vayan directo a un número, cargar WHATSAPP_TERAPEUTA en src/data/config.ts.
5. **Tu semana en Hoy** (solo Acompañado): Iceberg (lunes 21:00), sesión, Jugada
   (miércoles 21:00), con su estado, y el video de la semana si está cargado.
6. **Los 18 espacios de video** en VIDEOS_EJE (src/data/config.ts).

## Verificado
- tsc --noEmit, auditoría y check de api: OK.
- test:logica: todos pasan (12 tests nuevos de la semana y del Iceberg).
- vite build: correcto.

## Qué hacer
Reemplazar el contenido del repo learners417/clinica-del-lider-app con este paquete
(sin node_modules). Vercel despliega solo.

---

# CdL · repo limpio · 84 días · papel y tinta

Reemplaza TODO el contenido del repo learners417/clinica-del-lider.

## Qué se hizo
1. Se sacó la basura: el repo tenía dos apps mezcladas y tres archivos muertos
   (src/lib/auth.ts, src/pages/Dashboard.tsx, src/pages/Catalogo.tsx) que rompían
   el compilador y la auditoría. Nadie los importaba.
2. 84 días en dos viajes de 42. Mediciones el día 42 y el día 84.
3. Sistema visual nuevo: papel y tinta, oro mate, Outfit + Newsreader.
   Se cambió en los tokens de index.css, así que toda la app quedó alineada.
4. El Tablero reemplaza a la Rueda de 9 áreas: 10 medidas, una por pantalla,
   con la misma escala del CBI. La Rueda se eliminó.
5. Pantalla de resultado nueva: Índice del Jugador, el Árbol encendiéndose
   medida por medida, la lectura del desbalance de columnas y los tres focos.

## Archivos nuevos
- src/data/arbol.ts — las 10 medidas y todo el cálculo.
- src/data/camino.ts — fuente única de los números del programa.
- src/data/onboarding.ts — el Chequeo Día 0 declarado como datos.
- src/components/ArbolTablero.tsx — el Árbol dibujado.

## Qué hacer
1. En GitHub, borrar todo el contenido actual del repo.
2. Subir el contenido de este paquete en la raíz.
3. En Vercel, Root Directory queda en la raíz.

## Verificado
- tsc --noEmit: sin errores.
- node scripts/auditoria.mjs: OK.
- npm run test:logica: todos pasan.
- vite build: correcto.

## Pendiente
- Los bloques del onboarding que todavía no están en la app: cuerpo y ventana
  real, las cuatro preguntas abiertas y la firma.
- Los 90 y 45 sueltos en algunos componentes, para que salgan de camino.ts.
- Tus contenidos: el audio del Apagado es el único bloqueante.
