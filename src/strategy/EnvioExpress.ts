import type { Pedido } from "../modelos.ts";
import { formatearMoneda } from "../utils/moneda.ts";
import type { EstrategiaPrecio, ResultadoEstrategia } from "./EstrategiaPrecio.ts";

export class EnvioExpress implements EstrategiaPrecio {
  nombre = "Envio Express";
  private costo = 10000;

  aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
    return {
      precio: precioActual + this.costo,
      descripcion: `recargo de ${formatearMoneda(this.costo)}`
    };
  }
}
