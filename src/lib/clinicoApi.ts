/** La tubería del Clínico — un solo punto de acceso a /api/ai/stream para toda la app. */
export async function generarTexto(
  systemInstruction: string,
  messages: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  const res = await fetch('/api/ai/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemInstruction, messages }),
  });
  if (!res.ok || !res.body) throw new Error(String(res.status));

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buffer = '';
  let texto = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += dec.decode(value, { stream: true });
    const lineas = buffer.split('\n');
    buffer = lineas.pop() ?? '';
    for (const linea of lineas) {
      const l = linea.trim();
      if (!l.startsWith('data:')) continue;
      const dato = l.slice(5).trim();
      if (dato === '[DONE]') continue;
      try {
        const j = JSON.parse(dato);
        const trozo = j.text ?? j.delta ?? j.content ?? '';
        if (typeof trozo === 'string') texto += trozo;
      } catch { /* fragmento no-JSON */ }
    }
  }
  return texto.trim();
}
