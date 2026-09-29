export function formatearMoneda(valor: number): string {
  return `$${valor.toLocaleString("es-AR")}`;
}
