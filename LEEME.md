# La Clínica del Líder · app completa · 84 días

Reemplaza TODO el contenido del repo clinica-del-lider-app.
En GitHub: Add file → Upload files → subir el CONTENIDO de este paquete en la raíz.
Todos los archivos existen con el mismo nombre, así que los pisa.

## El camino
84 días = 12 semanas, en dos viajes de 42.
Viaje 1 SALIR (1-42): se saca lo que no es tuyo.
Viaje 2 ENTRAR (43-84): se construye.
Mediciones el día 42 y el día 84.

  1  La noche               7  El cuerpo
  2  El costo                8  El trabajo
  3  Lo que te apaga         9  Los tuyos
  4  El ruido               10  Los innegociables
  5  Los sí que eran no     11  Recibir
  6  El Personaje           12  Liderarte

Las 84 Dosis están escritas con este marco. Ninguna quedó del protocolo viejo.

## El instrumento
Chequeo Día 0 en cinco bloques: quién eres y qué te trae · el Tablero de 10
medidas · CBI y PHQ-9 · tu cuerpo y tu ventana real · cinco preguntas abiertas
y la firma. El resultado muestra el Índice del Jugador, el Árbol encendiéndose
medida por medida, la lectura del desbalance de columnas, los tres focos y, al
final, sus propias palabras firmadas y fechadas.

## Archivos nuevos
- src/data/camino.ts — fuente única de los números del programa.
- src/data/arbol.ts — las 10 medidas y el cálculo del Tablero.
- src/data/onboarding.ts — listas y cálculos del Chequeo.
- src/components/ArbolTablero.tsx — el Árbol dibujado.

## Eliminados
src/data/rueda.ts y src/components/RuedaVida.tsx (la Rueda de 9 áreas).
src/lib/auth.ts, src/pages/Dashboard.tsx, src/pages/Catalogo.tsx (código muerto
que venía del repo anterior y rompía el compilador).

## Sistema visual
Papel y tinta: fondo papel, tinta, oro mate en líneas de 1px y numerales,
Outfit y Newsreader. Sin degradés y sin glow. Vive en los tokens de index.css.
Manifest y favicon actualizados.

## Verificado en este paquete
- 84 dosis, sin huecos ni duplicados; todas con título, señal, acción y duración.
- Ninguna dosis referencia un día inexistente.
- Las 12 semanas cubren 1 a 84 sin solapamientos; las fases V.I.T.A.L. también.
- El Árbol: 10 medidas, 3 por columna lateral, 4 en el eje, 22 senderos,
  4 medidas invertidas repartidas entre las tres columnas.
- Prueba de lógica en ejecución con un perfil real: índice, columnas, focos,
  refuerzo por día, cálculo de sueño cruzando medianoche y aviso al clínico.
- tsc --noEmit sin errores · auditoría OK · test:logica OK · vite build OK.
- Sin colores del sistema viejo, sin menciones a 90 días ni al Día 45.

## Lo único que falta y no es código
Tus audios. El del Apagado (día 4) es el bloqueante: ocho minutos, inhalar
cuatro y exhalar ocho, con tu voz.
