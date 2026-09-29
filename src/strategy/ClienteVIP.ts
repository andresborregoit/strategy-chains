import type { Pedido } from "../modelos.ts";
import { formatearMoneda } from "../utils/moneda.ts";
import type { EstrategiaPrecio, ResultadoEstrategia } from "./EstrategiaPrecio.ts";

export class ClienteVIP implements EstrategiaPrecio {
  nombre = "Cliente VIP";

  aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
    const descuento = precioActual * 0.15;

    return {
      precio: precioActual - descuento,
      descripcion: `15% de descuento (-${formatearMoneda(descuento)})`
    };
  }
}
