/** Prueba la base en un Postgres real (PGlite): migraciones y reglas de quién ve qué. npm run test:base */
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
const MIG = new URL('../supabase/migrations/', import.meta.url).pathname;
const db = new PGlite();
let fallos = 0;
const ok = (c, m) => { console.log(c ? '  ✓' : '  ✗ FALLO:', m); if (!c) fallos++; };

// Lo mínimo de Supabase: auth.users, auth.uid() y el rol authenticated
await db.exec(`
  create schema auth;
  create table auth.users (id uuid primary key);
  create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  create role authenticated nologin;
  grant usage on schema public, auth to authenticated;
  grant execute on function auth.uid() to authenticated;
`);
for (const f of ['0001_accesos.sql', '0002_ficha.sql', '0003_v13.sql']) {
  await db.exec(readFileSync(MIG + f, 'utf8'));
  console.log('corrió', f);
}
// correrlas dos veces no rompe
for (const f of ['0001_accesos.sql', '0002_ficha.sql', '0003_v13.sql']) await db.exec(readFileSync(MIG + f, 'utf8'));
console.log('las tres se pueden correr dos veces');
await db.exec(`grant select, insert, update, delete on all tables in schema public to authenticated;`);

const U = { admin: '00000000-0000-0000-0000-00000000000a', equipo: '00000000-0000-0000-0000-00000000000e',
  pa: '00000000-0000-0000-0000-0000000000a1', pb: '00000000-0000-0000-0000-0000000000b1' };
await db.exec(`
  insert into auth.users values ('${U.admin}'),('${U.equipo}'),('${U.pa}'),('${U.pb}');
  insert into accesos (user_id,email,tier,rol) values
    ('${U.admin}','a@x','acompanado','admin'),('${U.equipo}','e@x','acompanado','equipo'),
    ('${U.pa}','pa@x','acompanado','paciente'),('${U.pb}','pb@x','solo','paciente');
  insert into estado_paciente (user_id,clave,valor) values
    ('${U.pa}','cdl_iceberg','[]'),('${U.pa}','cdl_mensaje_90','{"texto":"secreto"}'),
    ('${U.pa}','cdl_informes','[]'),('${U.pa}','cdl_descargas','["2026-09-26"]'),
    ('${U.pa}','cdl_testimonio','{"compartido":false}'),
    ('${U.pb}','cdl_iceberg','[]'),('${U.pb}','cdl_testimonio','{"compartido":true}');
`);

async function como(uid, sql, params = []) {
  await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${uid}', false); set role authenticated;`);
  try { return await db.query(sql, params); } finally { await db.exec('reset role;'); }
}
async function falla(uid, sql) { try { await como(uid, sql); return false; } catch { return true; } }

console.log('Paciente A');
const a = await como(U.pa, `select clave from estado_paciente`);
ok(a.rows.length === 5 && a.rows.every(() => true), `ve solo lo suyo (${a.rows.length} filas)`);
ok(await falla(U.pa, `insert into estado_paciente (user_id,clave,valor) values ('${U.pb}','cdl_iceberg','[]')`), 'no puede escribir en la cuenta de otro');
ok(!(await falla(U.pa, `insert into estado_paciente (user_id,clave,valor) values ('${U.pa}','cdl_jugadas','[]')`)), 'escribe en la suya');
ok(await falla(U.pa, `insert into estado_paciente (user_id,clave,valor) values ('${U.pa}','otra_cosa','[]')`), 'solo claves de la clínica');
ok((await como(U.pa, `select * from accesos`)).rows.length === 1, 've solo su propio acceso');
ok(await falla(U.pa, `insert into lineas (paciente_id,texto) values ('${U.pa}','me escribo solo')`), 'no puede escribirse la línea de la semana');
ok(await falla(U.pa, `insert into barandilla (paciente_id,chequeo_fecha) values ('${U.pa}','x')`), 'no puede marcar su barandilla');
ok((await como(U.pa, `update accesos set rol='admin' where user_id='${U.pa}'`)).affectedRows === 0, 'no puede hacerse admin');

console.log('Equipo');
const e = await como(U.equipo, `select user_id, clave from estado_paciente order by 1,2`);
const claves = e.rows.map((r) => r.clave);
ok(!claves.includes('cdl_mensaje_90') && !claves.includes('cdl_informes'), 'no ve el Mensaje del día 84 ni los informes');
ok(claves.includes('cdl_descargas') && claves.includes('cdl_iceberg'), 've lo clínico, con las Descargas');
ok(e.rows.filter((r) => r.clave === 'cdl_testimonio').length === 1 && e.rows.find((r) => r.clave === 'cdl_testimonio').user_id === U.pb, 've el testimonio solo del que lo compartió');
ok((await como(U.equipo, `select * from accesos`)).rows.length === 4, 've la lista de pacientes');
ok(!(await falla(U.equipo, `insert into lineas (paciente_id,texto,autor) values ('${U.pa}','Esta semana, una sola cosa.','${U.equipo}')`)), 'escribe la línea de la semana');
ok(!(await falla(U.equipo, `insert into barandilla (paciente_id,chequeo_fecha,nota) values ('${U.pa}','2026-09-15','hablado')`)), 'marca la barandilla');
ok(await falla(U.equipo, `update estado_paciente set valor='[]' where user_id='${U.pa}'`) || (await como(U.equipo, `update estado_paciente set valor='[]' where user_id='${U.pa}'`)).affectedRows === 0, 'no modifica el camino del paciente');
ok(await falla(U.equipo, `insert into lineas (paciente_id,texto) values ('${U.pa}','no')`), 'una línea de menos de 3 letras no entra');

console.log('Paciente A lee su línea; B no la ve');
ok((await como(U.pa, `select texto from lineas`)).rows.length === 1, 'A ve su línea');
ok((await como(U.pb, `select texto from lineas`)).rows.length === 0, 'B no ve la línea de A');

console.log(fallos ? `\n${fallos} FALLARON` : '\nLA BASE PASA TODO ✓');
process.exit(fallos ? 1 : 0);
