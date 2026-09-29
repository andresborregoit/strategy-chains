import type { Pedido } from "../modelos.ts";
import { formatearMoneda } from "../utils/moneda.ts";
import type { EstrategiaPrecio, ResultadoEstrategia } from "./EstrategiaPrecio.ts";

export class ClientePremium implements EstrategiaPrecio {
  nombre = "Cliente Premium";

  aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
    const descuento = precioActual * 0.10;

    return {
      precio: precioActual - descuento,
      descripcion: `10% de descuento (-${formatearMoneda(descuento)})`
    };
  }
}
