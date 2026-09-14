/**
 * Códigos de fundador — activación del Reinicio sin backend.
 * Javo cobra por fuera (WhatsApp/PayPal) y entrega un código de esta lista.
 * Con Supabase (fase 2A) pasan a ser filas en una tabla con estado.
 * Nota: viven en el bundle — suficiente para la camada fundadora, no para escala.
 */
const SOLO = 'UkVJTklDSU8tTkhGNy1VWVROLFJFSU5JQ0lPLVpVMlgtNFFFRSxSRUlOSUNJTy1aRldWLUIzQjUsUkVJTklDSU8tNEdaWi1FWEQ3LFJFSU5JQ0lPLVk5QkwtVlZGNixSRUlOSUNJTy01S0VYLVBYUk4sUkVJTklDSU8tQUVRWi1QWlQ2LFJFSU5JQ0lPLVdMRUMtQjU1MixSRUlOSUNJTy1EWEU2LVdaVlAsUkVJTklDSU8tNThIUC1aWFBRLFJFSU5JQ0lPLThKR1gtSjZMNyxSRUlOSUNJTy1ONjJaLUdGQUY=';
const APAGA = 'QVBBR0EtM0xINC1EUlRWLEFQQUdBLUVXUzUtQThGNCxBUEFHQS1TNEZMLUMyVEcsQVBBR0EtR0NHVC1RWUM0LEFQQUdBLTlaWjUtRFFDMyxBUEFHQS1URFEyLVREN0IsQVBBR0EtNDkyOC1TSFJaLEFQQUdBLTJOOEItUkJNOSxBUEFHQS1EOTZZLUJSWUQsQVBBR0EtS0M0Ny03MlVCLEFQQUdBLVIyMkEtQUM3RCxBUEFHQS1OUjZFLUoyQ0YsQVBBR0EtQThIUy1OOVlWLEFQQUdBLVJKNEQtVktKUSxBUEFHQS1HVUNBLUVDNlM=';
const ACOMP = 'QUNPTVAtWENIVS1FTEhYLEFDT01QLUQ5VlktVFI5NixBQ09NUC00QVU4LVdTV0YsQUNPTVAtWjNDUy1WTVg3LEFDT01QLTZLRTUtVjQ1SixBQ09NUC1VSzNZLUhTVkgsQUNPTVAtRlJDUi04NEI0LEFDT01QLVlZQTItRzNMTQ==';

function lista(blob: string): string[] {
  try { return atob(blob).split(','); } catch { return []; }
}

export type TierCodigo = 'apaga' | 'solo' | 'acompanado';

export function validarCodigo(codigo: string): TierCodigo | null {
  const c = codigo.trim().toUpperCase();
  if (lista(APAGA).includes(c)) return 'apaga';
  if (lista(SOLO).includes(c)) return 'solo';
  if (lista(ACOMP).includes(c)) return 'acompanado';
  return null;
}
