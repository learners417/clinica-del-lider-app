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
