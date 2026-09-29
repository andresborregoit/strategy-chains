import type { Pedido } from "../modelos.ts";
import type { EstrategiaPrecio, ResultadoEstrategia } from "./EstrategiaPrecio.ts";

export class ClienteComun implements EstrategiaPrecio {
  nombre = "Cliente comun";

  aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
    return {
      precio: precioActual,
      descripcion: "sin descuento"
    };
  }
}
