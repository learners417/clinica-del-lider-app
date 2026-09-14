# La Clínica del Líder — app **v1.0**

**La app está terminada y certificada.** Lo único que falta son los contenidos de Javo → `CONTENIDOS.md`.

Qué es: una clínica digital para líderes con burnout. Se entra por APAGA LA CABEZA (5 noches, $33),
se trata con EL REINICIO (90 días, una Dosis por día, $333 / $999 acompañado) y se sale con EL ALTA
(agotamiento fuera de la zona roja, medido con el mismo instrumento clínico tres veces, por contrato).

## Serie de cirugías S1-S7 (una por turno, cada una certificada: tsc + tests + auditoría + build)

## Cirugías aplicadas sobre v0.9 (una por turno, cada una certificada)
- **S1 · PWA instalable** — manifest, iconos del pulso, service worker (la app abre sin red),
  meta iOS + `scripts/auditoria.mjs` corriendo en `npm run lint` (regionalismos, rutas, precios, vocabulario).
- **S2 · El Clínico por contexto** — sabe qué Dosis o Noche estás viviendo hoy y la lleva inyectada;
  chip "Acompañando", preguntas sugeridas de un toque, botón dentro de cada consigna.
- **S3 · El Informe Semanal** — el Clínico lee tus 7 días de Signos: 3 párrafos, una correlación,
  un ajuste. Uno por semana. Historial de 20.
- **S4 · Las Ceremonias** — toda medición con Tratamiento termina en la comparación D0 → hoy,
  el cambio de Zona se celebra, y el Día 90 abre sus dos puertas (el Alta con certificado descargable,
  o la garantía por contrato).
- **S5 · El Mensaje al Día 90** — se escribe y se sella en los primeros días; se abre solo el Día 90,
  antes del certificado. No se puede reescribir.
- **S6 · Personalización por énfasis** — las tres áreas más caídas de tu Rueda quedan a la vista en
  el Tratamiento, y en los días clave la Dosis lleva su refuerzo (`src/lib/enfasis.ts`).
  Más el banner que prepara las mediciones del Día 45 y del contrato (nadie las descubre por sorpresa).
- **S7 · Pulido de impacto** — arranque de marca con el pulso dibujándose (y sin destello blanco al abrir),
  latido táctil en los momentos que quedan hechos (Dosis, Noche, sello, ceremonia), pulido táctil completo
  (sin flash de tap, foco accesible, botones que responden), la muesca del iPhone respetada en la app
  instalada, y la pantalla de error en la voz de la clínica.

## Verificación (correr siempre antes de subir)
```bash
npm run lint        # tsc + imports de api/ + auditoría de copy y rutas
npm run test:logica # la batería completa de lógica clínica
npm run build
```

# La Clínica del Líder — app v0.9 · LOGIN + ADMIN (fase 2A)

## v0.9 — usuario y contraseña + gestión de accesos (modelo TCD)
La app tiene DOS modos y se elige solo:
- **Sin las variables de Supabase** → modo LOCAL (la Puerta + códigos), como hasta hoy. Nada se rompe.
- **Con las variables** → modo NUBE: **login con email y contraseña**, accesos gestionados desde
  el panel **Admin** (crear paciente → le llega email de invitación → crea su clave → entra con su tier),
  recuperación de contraseña, cambio de tier en un clic, y endpoint de alta automática para la landing.
Los datos clínicos (Chequeos, Signos, Dosis) siguen en el dispositivo del paciente; la sincronización
a la nube es la fase 2B.

## ENCENDER EL MODO NUBE (10 minutos, una sola vez)
1. **Crear el proyecto en Supabase** (supabase.com → New project — proyecto NUEVO, nunca el de TCD).
2. **SQL Editor** → pegar y correr `supabase/migrations/0001_accesos.sql`.
3. **Authentication → Providers**: Email activado (viene por defecto). **Authentication → URL Configuration**:
   Site URL = la URL de la app en Vercel.
4. **Crearte como ADMIN**: Authentication → Users → "Invite user" con TU email → te llega el mail,
   creas tu contraseña. Después, en SQL Editor:
   `insert into public.accesos (user_id, email, tier, rol) values ('TU-USER-ID', 'tu@email.com', 'acompanado', 'admin');`
   (tu user id está en Authentication → Users).
5. **Variables en Vercel** (Settings → Environment Variables) y redeploy:
   - `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` (Project Settings → API)
   - `SUPABASE_SERVICE_ROLE_KEY` (misma pantalla — la service_role, secreta)
   - `ALTA_KEY` (inventa una clave larga — protege el webhook de alta)
   - `DEEPSEEK_API_KEY` (el Clínico)
6. Entras con tu email → aparece el tab **Admin** → das de alta a tu primer paciente.

## Alta automática desde la landing (opcional, como TCD)
POST `https://TU-APP/api/alta` con header `x-alta-key: TU_ALTA_KEY` y body
`{"email": "comprador@mail.com", "tier": "apaga"}` → invita y activa. Nunca degrada un tier superior.

## v0.8 — revisión completa en dos pasadas
**Pasada funcional (v0.7.1):** el Día 1 exige el Chequeo también al comprador directo del $333 ·
las 90 completas cierran con pantalla propia (sin loop) · hitos de medición por FECHA real
(la D90 cuenta aunque se haya salteado la D45) · el sistema anti-recaída se instala con la Dosis 69 ·
links de pago evergreen ($333/$999) listos en config.
**Pasada de experiencia (v0.8):** Mi Zona es una historia clínica real — cada medición con su delta
(▼ mejora en jade / ▲ en rojo), punto de partida nombrado, y disciplina de medición (con Tratamiento
activo, el re-test respeta el calendario D45/D90) · Hoy con estado post-registro (resumen sereno del
día con "editar", en vez del formulario eterno) · el Día 90 en Mi Zona sale del protocolo real.

**Estado: lista para lanzar. Lo único que falta son los contenidos de Javo → ver `CONTENIDOS.md`.**

## v0.7 — el cierre
- **Las 90 Dosis del Tratamiento, escritas** (V·I·T·A·L completas, VOZ MAESTRO en los días de identidad,
  la carta al Personaje D81-83, la medición del contrato D90). 43 tests de lógica e integridad clínica.
- **Espacios de contenido conectados**: audios y videos de Javo se pegan en `src/data/config.ts`
  y aparecen solos donde corresponden (Noches, Dosis, Botiquín). Sin URL, nada se rompe ni se ve vacío.
- Higiene de repo: sin código muerto, `index.html` con meta/OG del modelo nuevo, `CONTENIDOS.md` como checklist.

## v0.6.1 — auditoría exhaustiva (bugs + UX)
- FIX React: redirecciones fuera del render (useEffect) en Dosis y Noche.
- FIX dosificación real: la Dosis de mañana NO se puede adelantar ("Por hoy, hecho");
  las 5 Noches son una por día calendario ("Por esta noche, listo") — no se maratonean.
- Las tarjetas de HOY dicen la verdad en cada estado (te espera / hecha / mañana sigue).
- Copy alineado al modelo (nada dice "gratis"; Racha de Signos; Tratamiento).
- UX: puntos de progreso en las Noches + "Cómo funciona" en 3 pasos en la Puerta.

> La única clínica cuyo objetivo es darte el alta.

App de **La Clínica del Líder** (marca personal Javo Katz). Fork podado de Sanar OS.
Stack: React + Vite + TypeScript + Tailwind v4 · Vercel Serverless (api/) · Supabase (fase 2).

## Novedades v0.3 (blueprint UX con data real aplicado)
- **Chequeo 2.0 en 4 actos** (Conocerte → Medirte → Tu vida → Tu Zona): contexto del líder,
  interstitials de insight, enseñanza de las Zonas antes del resultado, "processing theater",
  revelado de Zona animado, **Tu Día 90 con fecha real** y **muro post-resultado** (Solo $297
  anclado en $3,30/día + Acompañado $1.990, garantía como cancel-assurance, salida gratis visible).
- **Autoguardado y reanudar**: cada respuesta persiste; recargar retoma exactamente donde quedó.
- **Design system Monitor Vital 2.0**: cero emojis (todo Lucide), escala tipográfica fija,
  targets táctiles ≥48px, steppers y chips, radar con etiquetas micro, racha con aversión a la pérdida.

## Novedades v0.6 — EL MODELO FINAL (puerta cerrada + El Tratamiento)
- **LA PUERTA**: sin acceso no hay app gratis — la pantalla única explica la clínica-app,
  ofrece APAGA LA CABEZA ($33) y activa códigos. El link de pago se edita en `src/data/config.ts`.
- **APAGA LA CABEZA**: las 5 Noches ($33) con el Chequeo como Noche 1 (con compuerta) y
  consignas nocturnas; al completarlas, puente al Tratamiento.
- **EL TRATAMIENTO** (ex camino): tabs Hoy · Tratamiento · Mi Zona · Botiquín; HOY absorbe
  el Diario (Noche/Dosis arriba + Signos Vitales abajo, un solo ritual).
- **Sistemas Instalados** (10, con estados instalado→sostenido→tuyo) + **Bitácora** que se
  revela el Día 91 como testimonio auto-escrito + hito de sueño con datos reales del Diario.
- **El Clínico con 3 modos** (Informe / Dosis / MADRUGADA 0-5 h: corto, calmo, herramienta 3AM);
  acceso: apaga = 3 preguntas · Tratamiento = completo.
- **Precios finales $33 / $333 / $999** en un solo archivo editable (`config.ts`).
- Mediciones D45/D90 sin muro de venta para quien ya es paciente.

## Novedades v0.5 — el máximo pre-Supabase
- **El motor del Reinicio**: protocolo de 90 días con la Dosis diaria (Señal → Acción → Registro),
  5 fases VITAL, hitos auto-verificados desde el Diario, mediciones D45/D90 con re-test integrado.
- **14 Dosis reales escritas** (fase Ver completa + arranque de Interrumpir); el resto del mapa visible.
- **Día 1 de regalo** post-Chequeo (la probada; el muro vive en el Día 2).
- **Mi Reinicio** en Protocolos: mapa de fases, progreso, hitos, mediciones, garantía activa.
- **Códigos de fundador**: venta por WhatsApp/PayPal externa → activación inmediata en la app
  (lista privada al final de este README; con Supabase pasan a tabla con estado).
- **El Clínico** (agente IA): 3 preguntas de regalo sobre el informe; completo con protocolo activo.
  Requiere `DEEPSEEK_API_KEY` (y opcional `ANTHROPIC_API_KEY` de fallback) en Vercel — sin llaves,
  degrada con un mensaje honesto. **No requiere Supabase.**
- **Catálogo con la escalera final**: $0 / Membresía $29 ($290/año) / Reinicio $297 / Acompañado $697 / a medida desde $997.

## Qué está VIVO (funciona sin ninguna API key, modo invitado)
- **El Chequeo** completo: CBI (19 ítems, 3 subescalas) → PHQ-9 con triaje y pantalla de
  derivación digna → Rueda de la Vida (9 áreas) → hábitos → eneagrama corto → resultado con Zona Vital.
- **El Diario del Líder**: Signos Vitales diarios (60 seg), racha, promedios de 7 días, historial.
- **El Botiquín de Urgencia** (gratis siempre): Pre-Reunión (respiración cíclica) ·
  Protocolo 3AM · Pausa de 3 minutos. Con aviso de que no reemplaza ayuda profesional.
- **Mi Zona**: evolución medida (CBI por subescala, camino de Zonas, historial de chequeos).
- **Protocolos**: catálogo escaparate (Reinicio $297 · Acompañado $1.990 · Especialidades · Membresía).
- Todo el estado vive en localStorage detrás de `src/lib/estadoCdl.ts` (adaptador listo para Supabase).

## Qué es STUB / fase 2
- Pagos (la tubería PayPal de la base queda referenciada en el plan; se adapta a tabla `productos`).
- Registro/cuentas (agregar `signUp` público en `src/lib/auth.ts`; hoy la app es 100% invitado).
- El Clínico (agente IA — `api/ai/generate.ts` y `stream.ts` ya están listos; falta prompt VITAL y UI).
- Contenido completo del Reinicio (protocoloSeed) y Especialidades.
- Supabase: crear **proyecto NUEVO exclusivo de CdL**. ⚠️ JAMÁS reutilizar el proyecto de TCD.
  Toda migración: versionada, staging primero, cero operaciones destructivas sin confirmación escrita.

## Correr local
```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # tsc + validador de imports de api/
npm run build
```

## Deploy (GitHub → Vercel)
1. Subir este código al repo (SIN vercel.json — no hace falta: Vercel detecta Vite
   y la carpeta api/ automáticamente; menos config = menos errores).
2. Vercel → Add New Project → Import → Deploy.
3. **No requiere variables de entorno** para el circuito gratis; para El Clínico:
   agregar `DEEPSEEK_API_KEY` (y opcional `ANTHROPIC_API_KEY`) en Settings → Environment Variables.
4. Fase 2 (cuando se activen agente/IA, Supabase y pagos):
   `DEEPSEEK_API_KEY`, `ANTHROPIC_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`,
   `VITE_PAYPAL_CLIENT_ID`, `SENTRY_DSN`/`VITE_SENTRY_DSN` (opcional).

## Identidad visual "Monitor Vital v3" (propia — no es TCD ni RENACE)
- **Ejecución premium:** fondo con gradientes radiales por capas, tarjetas con profundidad
  (gradiente + sombra + realce interior), botones con gradiente y glow, foco visible,
  animación de entrada por página, reduced-motion respetado.
- **Responsive real:** sidebar fija en escritorio (≥1024px) + nav inferior en el teléfono;
  contenedores `.pantalla` (33→36rem) y `.pantalla-ancha` (62rem, Dashboard 2 columnas).
- **Firma de marca:** la línea de pulso ambiental (`PulsoAmbiente`) recorriendo hero e intro.
- Concepto: el tablero de signos vitales del líder. Fondo verde-noche `#0D1512`,
  señal jade `#3FCF8E` (el pulso), arcilla `#C9714A` (la Voz Maestro, lo humano).
- Tipos: **Space Grotesk** (títulos y datos, tabular) · **Inter** (cuerpo) · **Lora itálica** (Voz Maestro).
- Marca: línea de pulso (ECG) como logo y favicon. Tokens en `src/index.css`.
- Zonas sobre oscuro: roja #E4574C · naranja #E08A3C · amarilla #D9BC4B · verde #4CC38A · azul #5CA8D8.

## Reglas de la casa (no negociables)
- Vocabulario UI: nada de coach/nivel/marketing/funnel. Se dice: el Chequeo, Signos Vitales,
  **Tu Zona Actual**, protocolo, consulta clínica, el alta. Público en tuteo neutro.
- El Botiquín jamás se cobra.
- CdL no diagnostica ni trata patología: el triaje deriva a profesionales (PHQ-9 ≥ 15 o ítem 9 > 0).
- La Zona se mueve con evidencia real (CBI + hitos verificados), nunca por consumir contenido.


## Códigos de fundador (PRIVADO — compartir 1 a 1 tras cobrar)
```
REINICIO ($297):
REINICIO-NHF7-UYTN
REINICIO-ZU2X-4QEE
REINICIO-ZFWV-B3B5
REINICIO-4GZZ-EXD7
REINICIO-Y9BL-VVF6
REINICIO-5KEX-PXRN
REINICIO-AEQZ-PZT6
REINICIO-WLEC-B552
REINICIO-DXE6-WZVP
REINICIO-58HP-ZXPQ
REINICIO-8JGX-J6L7
REINICIO-N62Z-GFAF

ACOMPANADO ($697):
ACOMP-XCHU-ELHX
ACOMP-D9VY-TR96
ACOMP-4AU8-WSWF
ACOMP-Z3CS-VMX7
ACOMP-6KE5-V45J
ACOMP-UK3Y-HSVH
ACOMP-FRCR-84B4
ACOMP-YYA2-G3LM
```


## Códigos APAGA LA CABEZA (PRIVADO — compartir 1 a 1 tras cobrar el $33)
```
APAGA LA CABEZA ($33):
APAGA-3LH4-DRTV
APAGA-EWS5-A8F4
APAGA-S4FL-C2TG
APAGA-GCGT-QYC4
APAGA-9ZZ5-DQC3
APAGA-TDQ2-TD7B
APAGA-4928-SHRZ
APAGA-2N8B-RBM9
APAGA-D96Y-BRYD
APAGA-KC47-72UB
APAGA-R22A-AC7D
APAGA-NR6E-J2CF
APAGA-A8HS-N9YV
APAGA-RJ4D-VKJQ
APAGA-GUCA-EC6S
```
