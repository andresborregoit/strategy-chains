import type { Pedido } from "./modelos.ts";
import { CalculadoraPrecio } from "./strategy/CalculadoraPrecio.ts";
import { ClienteVIP } from "./strategy/ClienteVIP.ts";
import { ClientePremium } from "./strategy/ClientePremium.ts";
import { DescuentoPorCantidad } from "./strategy/DescuentoPorCantidad.ts";
import { PromocionEspecial } from "./strategy/PromocionEspecial.ts";
import { DescuentoBlackFriday } from "./strategy/DescuentoBlackFriday.ts";
import { EnvioExpress } from "./strategy/EnvioExpress.ts";
import { EnvioNormal } from "./strategy/EnvioNormal.ts";
import { ValidarCliente } from "./chain/ValidarCliente.ts";
import { ValidarStock } from "./chain/ValidarStock.ts";
import { ValidarPago } from "./chain/ValidarPago.ts";
import { ValidarLimiteCompra } from "./chain/ValidarLimiteCompra.ts";

function crearCadenaValidacion() {
  const validarCliente = new ValidarCliente();
  const validarStock = new ValidarStock();
  const validarPago = new ValidarPago();
  const validarLimiteCompra = new ValidarLimiteCompra(150000);

  validarCliente
    .establecerSiguiente(validarStock)
    .establecerSiguiente(validarPago)
    .establecerSiguiente(validarLimiteCompra);

  return validarCliente;
}

function procesarCaso(nombreCaso: string, pedido: Pedido, calculadora: CalculadoraPrecio): void {
  console.log("\n========================================");
  console.log(nombreCaso);
  console.log("========================================");

  pedido.precioFinal = calculadora.calcular(pedido);

  console.log("Cadena de validacion:");
  const cadena = crearCadenaValidacion();
  const resultado = cadena.procesar(pedido);

  console.log(`Resultado final: ${resultado.mensaje}`);
}

const calculadoraCasoAprobado = new CalculadoraPrecio([
  new ClienteVIP(),
  new DescuentoPorCantidad(),
  new PromocionEspecial(0.05),
  new EnvioExpress()
]);

const pedidoAprobado: Pedido = {
  cliente: { nombre: "Ana", activo: true },
  productos: [
    { nombre: "Remera", cantidad: 6, precioUnitario: 10000, stockDisponible: 20 },
    { nombre: "Pantalon", cantidad: 5, precioUnitario: 8000, stockDisponible: 10 }
  ],
  pagoAprobado: true,
  precioFinal: 0
};

const calculadoraSinStock = new CalculadoraPrecio([
  new ClientePremium(),
  new DescuentoPorCantidad(),
  new EnvioNormal()
]);

const pedidoSinStock: Pedido = {
  cliente: { nombre: "Bruno", activo: true },
  productos: [
    { nombre: "Zapatillas", cantidad: 3, precioUnitario: 30000, stockDisponible: 1 }
  ],
  pagoAprobado: true,
  precioFinal: 0
};

const calculadoraPagoRechazado = new CalculadoraPrecio([
  new ClienteVIP(),
  new DescuentoBlackFriday(),
  new EnvioExpress()
]);

const pedidoPagoRechazado: Pedido = {
  cliente: { nombre: "Carla", activo: true },
  productos: [
    { nombre: "Campera", cantidad: 2, precioUnitario: 50000, stockDisponible: 5 }
  ],
  pagoAprobado: false,
  precioFinal: 0
};

procesarCaso("CASO 1 - Pedido aprobado", pedidoAprobado, calculadoraCasoAprobado);
procesarCaso("CASO 2 - Pedido rechazado por falta de stock", pedidoSinStock, calculadoraSinStock);
procesarCaso("CASO 3 - Pedido rechazado por problema en el pago", pedidoPagoRechazado, calculadoraPagoRechazado);
