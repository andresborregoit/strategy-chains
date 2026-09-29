import type { Pedido } from "../modelos.ts";
import type { EstrategiaPrecio, ResultadoEstrategia } from "./EstrategiaPrecio.ts";

export class RetiroSucursal implements EstrategiaPrecio {
  nombre = "Retiro en sucursal";

  aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
    return {
      precio: precioActual,
      descripcion: "$0 de envio"
    };
  }
}
