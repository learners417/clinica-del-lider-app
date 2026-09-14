/** Tests de la lógica clínica de CdL. Corre con esbuild+node (npm run test:logica). */
import { CBI_ITEMS, calcularCbi } from '../src/data/cbi';
import { calcularPhq9, PHQ9_ITEMS } from '../src/data/phq9';
import { zonaDesdeCbi } from '../src/data/zonas';
import { rachaDesde } from '../src/lib/estadoCdl';

let fallos = 0;
function ok(cond: boolean, msg: string) {
  if (cond) { console.log('  ✓', msg); } else { fallos++; console.error('  ✗ FALLO:', msg); }
}

console.log('CBI:');
{
  // Todo "Siempre" (100): el ítem invertido t4 debe restar → trabajo < 100
  const todas100 = Object.fromEntries(CBI_ITEMS.map(i => [i.id, 100]));
  const r = calcularCbi(todas100);
  ok(r.personal === 100, 'personal=100 con todas "Siempre"');
  ok(r.trabajo === Math.round((6 * 100 + 0) / 7), `trabajo=${r.trabajo} refleja el ítem invertido (energía para familia)`);
  ok(r.equipo === 100, 'equipo=100');
  // Todo "Nunca" (0): invertido suma → trabajo > 0
  const todas0 = Object.fromEntries(CBI_ITEMS.map(i => [i.id, 0]));
  const r0 = calcularCbi(todas0);
  ok(r0.personal === 0 && r0.equipo === 0, 'personal y equipo = 0 con todas "Nunca"');
  ok(r0.trabajo === Math.round(100 / 7), `trabajo=${r0.trabajo} (solo el invertido puntúa)`);
  ok(r0.promedio === Math.round((0 + r0.trabajo + 0) / 3), 'promedio bien calculado');
}

console.log('PHQ-9:');
{
  const base = Object.fromEntries(PHQ9_ITEMS.map(i => [i.id, 0]));
  ok(calcularPhq9(base).derivar === false, 'todo 0 → no deriva');
  const catorce = calcularPhq9({ ...base, q1: 3, q2: 3, q3: 3, q4: 3, q5: 2 });
  ok(catorce.total === 14 && catorce.derivar === false, 'total 14 → no deriva (umbral es 15)');
  const quince = calcularPhq9({ ...base, q1: 3, q2: 3, q3: 3, q4: 3, q5: 3 });
  ok(quince.total === 15 && quince.derivar === true, 'total 15 → deriva');
  const item9 = calcularPhq9({ ...base, q9: 1 });
  ok(item9.derivar === true && item9.motivoItem9 === true, 'ítem 9 > 0 → deriva SIEMPRE, aun con total bajo');
}

console.log('Zonas:');
{
  ok(zonaDesdeCbi(100).id === 'roja' && zonaDesdeCbi(65).id === 'roja', 'CBI 65-100 → roja');
  ok(zonaDesdeCbi(64).id === 'naranja' && zonaDesdeCbi(50).id === 'naranja', 'CBI 50-64 → naranja');
  ok(zonaDesdeCbi(49).id === 'amarilla' && zonaDesdeCbi(40).id === 'amarilla', 'CBI 40-49 → amarilla');
  ok(zonaDesdeCbi(39).id === 'verde' && zonaDesdeCbi(25).id === 'verde', 'CBI 25-39 → verde');
  ok(zonaDesdeCbi(24).id === 'azul' && zonaDesdeCbi(0).id === 'azul', 'CBI 0-24 → azul');
}

console.log('Racha:');
{
  ok(rachaDesde([], '2026-07-12') === 0, 'sin entradas → 0');
  ok(rachaDesde(['2026-07-12'], '2026-07-12') === 1, 'solo hoy → 1');
  ok(rachaDesde(['2026-07-10', '2026-07-11', '2026-07-12'], '2026-07-12') === 3, '3 días seguidos → 3');
  ok(rachaDesde(['2026-07-10', '2026-07-11'], '2026-07-12') === 2, 'hoy sin registrar → racha viva desde ayer = 2');
  ok(rachaDesde(['2026-07-09', '2026-07-11', '2026-07-12'], '2026-07-12') === 2, 'hueco corta la racha');
  // Cruce de mes: 30/06 + 01/07 + 02/07
  ok(rachaDesde(['2026-06-29', '2026-06-30', '2026-07-01', '2026-07-02'], '2026-07-02') === 4, 'cruce de mes junio→julio → 4');
  // Cruce de año
  ok(rachaDesde(['2025-12-31', '2026-01-01'], '2026-01-01') === 2, 'cruce de año → 2');
}

if (fallos > 0) { console.error(`\n${fallos} test(s) FALLARON`); process.exit(1); }
console.log('\nTODOS LOS TESTS PASAN ✓');
