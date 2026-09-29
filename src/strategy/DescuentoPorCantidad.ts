import type { Pedido } from "../modelos.ts";
import { contarProductos } from "../modelos.ts";
import { formatearMoneda } from "../utils/moneda.ts";
import type { EstrategiaPrecio, ResultadoEstrategia } from "./EstrategiaPrecio.ts";

export class DescuentoPorCantidad implements EstrategiaPrecio {
  nombre = "Descuento por cantidad";

  aplicar(precioActual: number, pedido: Pedido): ResultadoEstrategia {
    const cantidadProductos = contarProductos(pedido.productos);
    let porcentaje = 0;

    if (cantidadProductos > 10) {
      porcentaje = 0.10;
    } else if (cantidadProductos > 5) {
      porcentaje = 0.05;
    }

    const descuento = precioActual * porcentaje;

    return {
      precio: precioActual - descuento,
      descripcion: `${cantidadProductos} productos, ${porcentaje * 100}% de descuento (-${formatearMoneda(descuento)})`
    };
  }
}
