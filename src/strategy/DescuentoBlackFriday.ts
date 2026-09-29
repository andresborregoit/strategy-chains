import type { Pedido } from "../modelos.ts";
import { formatearMoneda } from "../utils/moneda.ts";
import type { EstrategiaPrecio, ResultadoEstrategia } from "./EstrategiaPrecio.ts";

export class DescuentoBlackFriday implements EstrategiaPrecio {
  nombre = "Descuento Black Friday";

  aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
    const descuento = precioActual * 0.20;

    return {
      precio: precioActual - descuento,
      descripcion: `20% de descuento (-${formatearMoneda(descuento)})`
    };
  }
}
