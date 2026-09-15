# La Clínica del Líder · entrada limpia + aviso de almacenamiento

Reemplaza TODO el contenido del repo clinica-del-lider-app.

## El arreglo de esta versión
Si el navegador bloquea el almacenamiento (incógnito, o datos del sitio
bloqueados), antes pasaba esto: el código se validaba, salía el toast de
bienvenida, y la app volvía a la Puerta sin decir nada. Quedaba trabada ahí.

Ahora:
- La app entera se detiene al arrancar con una pantalla que explica qué pasa
  y cómo resolverlo.
- La Puerta además verifica que el acceso haya quedado guardado de verdad
  antes de avanzar, y avisa si no.
- guardar() dejó de fallar en silencio: devuelve si pudo o no.

## La entrada
Sin precios. Nombre, código, Entrar. Al terminar el Chequeo aparece el plan de
doce semanas con los dos viajes, lo que trabaja cada semana y sus tres focos.

Códigos de Acompañado:
  ACOMP-XCHU-ELHX · ACOMP-D9VY-TR96 · ACOMP-4AU8-WSWF · ACOMP-Z3CS-VMX7
  ACOMP-6KE5-V45J · ACOMP-UK3Y-HSVH · ACOMP-FRCR-84B4 · ACOMP-YYA2-G3LM

## Verificado
Camino de entrada probado en ejecución: el código entra, tolera minúsculas y
espacios, rechaza inventados, y el bloqueo de almacenamiento se detecta.
tsc limpio · auditoría OK · test:logica OK · build OK · 84 dosis íntegras.
