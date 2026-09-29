import type { Pedido } from "../modelos.ts";
import type { ResultadoValidacion } from "./ResultadoValidacion.ts";
import { ValidadorPedido } from "./ValidadorPedido.ts";

export class ValidarCliente extends ValidadorPedido {
  protected nombre = "Validar cliente";

  protected validar(pedido: Pedido): ResultadoValidacion {
    if (!pedido.cliente.activo) {
      return {
        aprobado: false,
        mensaje: "ERROR - el cliente no esta activo"
      };
    }

    return {
      aprobado: true,
      mensaje: "OK"
    };
  }
}
