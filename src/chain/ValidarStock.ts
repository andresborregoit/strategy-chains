import type { Pedido } from "../modelos.ts";
import type { ResultadoValidacion } from "./ResultadoValidacion.ts";
import { ValidadorPedido } from "./ValidadorPedido.ts";

export class ValidarStock extends ValidadorPedido {
  protected nombre = "Validar stock";

  protected validar(pedido: Pedido): ResultadoValidacion {
    const productoSinStock = pedido.productos.find((producto) => {
      return producto.cantidad > producto.stockDisponible;
    });

    if (productoSinStock !== undefined) {
      return {
        aprobado: false,
        mensaje: `ERROR - falta stock de ${productoSinStock.nombre}`
      };
    }

    return {
      aprobado: true,
      mensaje: "OK"
    };
  }
}
