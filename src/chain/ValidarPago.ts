import type { Pedido } from "../modelos.ts";
import type { ResultadoValidacion } from "./ResultadoValidacion.ts";
import { ValidadorPedido } from "./ValidadorPedido.ts";

export class ValidarPago extends ValidadorPedido {
  protected nombre = "Validar pago";

  protected validar(pedido: Pedido): ResultadoValidacion {
    if (!pedido.pagoAprobado) {
      return {
        aprobado: false,
        mensaje: "ERROR - el pago fue rechazado"
      };
    }

    return {
      aprobado: true,
      mensaje: "OK"
    };
  }
}
