# Guia paso a paso para entender el trabajo

## 1. Idea general

El trabajo tiene dos momentos:

1. Calcular el precio final de una compra.
2. Validar si el pedido puede aprobarse.

Para el primer momento se usa **Strategy**.
Para el segundo momento se usa **Chain of Responsibility**.

## 2. Strategy explicado simple

Strategy sirve para tener muchas reglas intercambiables.

En este trabajo, cada descuento o recargo es una estrategia:

- Cliente VIP descuenta 15%.
- Cliente Premium descuenta 10%.
- Descuento por cantidad descuenta segun cuantos productos hay.
- Envio normal suma $5.000.
- Envio Express suma $10.000.
- Black Friday descuenta 20%.

Todas cumplen la misma interfaz: `EstrategiaPrecio`.

Eso significa que la calculadora no necesita saber los detalles de cada regla. Solo recibe una lista y las ejecuta.

Ejemplo:

```ts
const calculadora = new CalculadoraPrecio([
  new ClienteVIP(),
  new DescuentoPorCantidad(),
  new PromocionEspecial(0.05),
  new EnvioExpress()
]);
```

Esta compra usa cuatro estrategias al mismo tiempo.

## 3. Chain of Responsibility explicado simple

Chain of Responsibility sirve para validar algo en varios pasos.

En este trabajo, el pedido pasa por una cadena:

1. Validar cliente.
2. Validar stock.
3. Validar pago.
4. Validar limite de compra.

Cada validador revisa una sola cosa.

Si esta todo bien, pasa al siguiente.
Si hay un error, corta la cadena y devuelve el motivo.

Ejemplo:

```text
Validar cliente: OK
Validar stock: OK
Validar pago: ERROR
```

En ese caso, el validador de limite de compra no se ejecuta.

## 4. Como explicar los archivos principales

- `src/main.ts`: es el punto de entrada. Aca se crean los pedidos de prueba y se ejecuta todo.
- `src/modelos.ts`: define los datos principales que usa el sistema.
- `src/strategy/EstrategiaPrecio.ts`: define la interfaz del patron Strategy.
- `src/strategy/CalculadoraPrecio.ts`: aplica las estrategias de precio.
- `src/strategy/*.ts`: cada archivo es una estrategia concreta.
- `src/chain/HandlerPedido.ts`: define la interfaz del patron Chain of Responsibility.
- `src/chain/ValidadorPedido.ts`: contiene la logica comun para pasar al siguiente validador.
- `src/chain/Validar*.ts`: cada archivo es un validador concreto.

## 5. Como se cumple el desafio

El desafio pide agregar:

- `DescuentoBlackFriday`
- `ValidarLimiteCompra`

Se agregaron como clases nuevas.
No fue necesario modificar las estrategias anteriores ni los validadores anteriores.

Eso demuestra la ventaja de ambos patrones: el sistema puede crecer agregando clases nuevas.

## 6. Frase corta para defender el trabajo

> Use Strategy para separar las reglas de precio y poder combinar varias en una misma compra. Use Chain of Responsibility para validar el pedido por pasos, cortando el proceso cuando una validacion falla.
