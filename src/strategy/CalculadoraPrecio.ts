import type { Pedido } from "../modelos.ts";
import { calcularSubtotal } from "../modelos.ts";
import { formatearMoneda } from "../utils/moneda.ts";
import type { EstrategiaPrecio } from "./EstrategiaPrecio.ts";

export class CalculadoraPrecio {
  private estrategias: EstrategiaPrecio[];

  constructor(estrategias: EstrategiaPrecio[]) {
    this.estrategias = estrategias;
  }

  calcular(pedido: Pedido): number {
    let precio = calcularSubtotal(pedido.productos);

    console.log(`Precio inicial: ${formatearMoneda(precio)}`);
    console.log("Estrategias aplicadas:");

    for (const estrategia of this.estrategias) {
      const resultado = estrategia.aplicar(precio, pedido);
      precio = resultado.precio;
      console.log(`- ${estrategia.nombre}: ${resultado.descripcion}`);
    }

    console.log(`Precio resultante: ${formatearMoneda(precio)}`);
    return precio;
  }
}
