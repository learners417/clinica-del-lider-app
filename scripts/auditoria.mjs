/** Auditoría permanente — regionalismos, rutas viejas, precios viejos y vocabulario prohibido en src/. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const REGLAS = [
  { patron: /birome|tenés|querés|acordate|\bvos\b/u, motivo: 'regionalismo rioplatense (el copy es castellano neutro)' },
  { patron: /'inicio'|'diario'|'protocolos'/, motivo: 'id de página viejo (hoy/tratamiento)' },
  { patron: /\bes gratis\b/i, motivo: 'copy del modelo viejo (nada es gratis afuera)' },
  { patron: /\$297|\$697/, motivo: 'precio viejo (333/999)' },
  { patron: /\bembudo\b|\bfunnel\b|\bmódulo\b|\blección\b/i, motivo: 'vocabulario prohibido de la casa' },
];
const PERMITIDOS = [/coaching ejecutivo/, /frases de coach/i, /VOCABULARIO/];

let fallas = 0;
function revisar(dir) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) { revisar(p); continue; }
    if (!/\.(ts|tsx|html)$/.test(n)) continue;
    const lineas = readFileSync(p, 'utf8').split('\n');
    lineas.forEach((linea, i) => {
      for (const { patron, motivo } of REGLAS) {
        if (patron.test(linea) && !PERMITIDOS.some((ok) => ok.test(linea))) {
          console.error(`✗ ${p}:${i + 1} — ${motivo}\n  ${linea.trim().slice(0, 90)}`);
          fallas++;
        }
      }
    });
  }
}
revisar('src');
if (fallas) { console.error(`\nAUDITORÍA: ${fallas} falla(s).`); process.exit(1); }
console.log('[auditoria] OK — src limpio (regionalismos, rutas, precios, vocabulario).');
