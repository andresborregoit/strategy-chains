const money = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0
});

const cases = {
  aprobado: {
    title: "Pedido aprobado",
    products: [
      { name: "Remera", quantity: 6, price: 10000, stock: 20 },
      { name: "Pantalon", quantity: 5, price: 8000, stock: 10 }
    ],
    paymentApproved: true,
    strategies: [
      { name: "Cliente VIP", kind: "percent", value: 0.15, text: "15% de descuento" },
      { name: "Descuento por cantidad", kind: "quantity" },
      { name: "Promocion especial", kind: "percent", value: 0.05, text: "5% adicional" },
      { name: "Envio Express", kind: "fixed", value: 10000, text: "recargo de $10.000" }
    ]
  },
  stock: {
    title: "Rechazo por falta de stock",
    products: [
      { name: "Zapatillas", quantity: 3, price: 30000, stock: 1 }
    ],
    paymentApproved: true,
    strategies: [
      { name: "Cliente Premium", kind: "percent", value: 0.10, text: "10% de descuento" },
      { name: "Descuento por cantidad", kind: "quantity" },
      { name: "Envio normal", kind: "fixed", value: 5000, text: "recargo de $5.000" }
    ]
  },
  pago: {
    title: "Rechazo por problema en el pago",
    products: [
      { name: "Campera", quantity: 2, price: 50000, stock: 5 }
    ],
    paymentApproved: false,
    strategies: [
      { name: "Cliente VIP", kind: "percent", value: 0.15, text: "15% de descuento" },
      { name: "Descuento Black Friday", kind: "percent", value: 0.20, text: "20% de descuento" },
      { name: "Envio Express", kind: "fixed", value: 10000, text: "recargo de $10.000" }
    ]
  }
};

const codeFragments = {
  mainStrategy: {
    label: "main.ts",
    file: "src/main.ts",
    role: "1. Caso de uso: elige que estrategias participan",
    explanation: "Aqui se toma la decision de composicion. El caso concreto arma la calculadora con las reglas que necesita y en el orden en que deben ejecutarse.",
    code: `const calculadoraCasoAprobado = new CalculadoraPrecio([
  new ClienteVIP(),
  new DescuentoPorCantidad(),
  new PromocionEspecial(0.05),
  new EnvioExpress()
]);`
  },
  calculator: {
    label: "CalculadoraPrecio.ts",
    file: "src/strategy/CalculadoraPrecio.ts",
    role: "2. Orquestador: recorre estrategias sin conocer sus reglas",
    explanation: "La calculadora trabaja contra el contrato EstrategiaPrecio. Por eso puede ejecutar VIP, cantidad o envio con el mismo codigo.",
    code: `for (const estrategia of this.estrategias) {
  const resultado = estrategia.aplicar(precio, pedido);
  precio = resultado.precio;
  console.log(\`- \${estrategia.nombre}: \${resultado.descripcion}\`);
}`
  },
  strategyContract: {
    label: "EstrategiaPrecio.ts",
    file: "src/strategy/EstrategiaPrecio.ts",
    role: "3. Contrato: define la forma comun de todas las reglas",
    explanation: "Toda estrategia promete tener un nombre y un metodo aplicar. La calculadora depende de esta interfaz, no de clases concretas.",
    code: `export interface EstrategiaPrecio {
  nombre: string;
  aplicar(precioActual: number, pedido: Pedido): ResultadoEstrategia;
}`
  },
  models: {
    label: "modelos.ts",
    file: "src/modelos.ts",
    concept: "Datos del dominio",
    role: "Datos del dominio: la informacion que viaja entre capas",
    explanation: "Pedido es el objeto compartido. Las estrategias consultan sus productos y la cadena revisa cliente, stock, pago y precio final.",
    code: `export interface Pedido {
  cliente: Cliente;
  productos: ProductoPedido[];
  pagoAprobado: boolean;
  precioFinal: number;
}`
  },
  mainChain: {
    label: "main.ts",
    file: "src/main.ts",
    role: "1. Caso de uso: arma el orden de la cadena",
    explanation: "El orden no vive dentro de los validadores. Se configura desde afuera, enlazando cada objeto con el siguiente.",
    code: `validarCliente
  .establecerSiguiente(validarStock)
  .establecerSiguiente(validarPago)
  .establecerSiguiente(validarLimiteCompra);

return validarCliente;`
  },
  handlerContract: {
    label: "HandlerPedido.ts",
    file: "src/chain/HandlerPedido.ts",
    role: "2. Contrato: permite enlazar y procesar handlers",
    explanation: "El contrato establece las dos operaciones del patron: indicar quien sigue y procesar el pedido.",
    code: `export interface HandlerPedido {
  establecerSiguiente(siguiente: HandlerPedido): HandlerPedido;
  procesar(pedido: Pedido): ResultadoValidacion;
}`
  },
  validatorBase: {
    label: "ValidadorPedido.ts",
    file: "src/chain/ValidadorPedido.ts",
    role: "3. Clase base: decide cortar o continuar la cadena",
    explanation: "La clase base ejecuta validar. Si el resultado falla, termina; si aprueba y existe un siguiente handler, le entrega el mismo pedido.",
    code: `const resultado = this.validar(pedido);

if (!resultado.aprobado) {
  return resultado;
}

if (this.siguiente === null) {
  return { aprobado: true, mensaje: "Pedido aprobado" };
}

return this.siguiente.procesar(pedido);`
  },
  validationResult: {
    label: "ResultadoValidacion.ts",
    file: "src/chain/ResultadoValidacion.ts",
    role: "Resultado comun: comunica si la cadena sigue o se detiene",
    explanation: "Todos los validadores devuelven la misma forma de respuesta. aprobado controla el flujo y mensaje explica el resultado.",
    code: `export interface ResultadoValidacion {
  aprobado: boolean;
  mensaje: string;
}`
  }
};

const caseCode = {
  aprobado: {
    calculator: `const calculadoraCasoAprobado = new CalculadoraPrecio([
  new ClienteVIP(),
  new DescuentoPorCantidad(),
  new PromocionEspecial(0.05),
  new EnvioExpress()
]);`,
    order: `const pedidoAprobado: Pedido = {
  cliente: { nombre: "Ana", activo: true },
  productos: [
    { nombre: "Remera", cantidad: 6, precioUnitario: 10000, stockDisponible: 20 },
    { nombre: "Pantalon", cantidad: 5, precioUnitario: 8000, stockDisponible: 10 }
  ],
  pagoAprobado: true,
  precioFinal: 0
};`
  },
  stock: {
    calculator: `const calculadoraSinStock = new CalculadoraPrecio([
  new ClientePremium(),
  new DescuentoPorCantidad(),
  new EnvioNormal()
]);`,
    order: `const pedidoSinStock: Pedido = {
  cliente: { nombre: "Bruno", activo: true },
  productos: [
    { nombre: "Zapatillas", cantidad: 3, precioUnitario: 30000, stockDisponible: 1 }
  ],
  pagoAprobado: true,
  precioFinal: 0
};`
  },
  pago: {
    calculator: `const calculadoraPagoRechazado = new CalculadoraPrecio([
  new ClienteVIP(),
  new DescuentoBlackFriday(),
  new EnvioExpress()
]);`,
    order: `const pedidoPagoRechazado: Pedido = {
  cliente: { nombre: "Carla", activo: true },
  productos: [
    { nombre: "Campera", cantidad: 2, precioUnitario: 50000, stockDisponible: 5 }
  ],
  pagoAprobado: false,
  precioFinal: 0
};`
  }
};

const concreteStrategies = {
  "Cliente VIP": {
    file: "src/strategy/ClienteVIP.ts",
    concept: "Estrategia por tipo de cliente",
    explanation: "La regla concreta calcula 15% de descuento y devuelve un ResultadoEstrategia. La calculadora no necesita saber ese porcentaje.",
    code: `aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
  const descuento = precioActual * 0.15;

  return {
    precio: precioActual - descuento,
    descripcion: \`15% de descuento (-\${formatearMoneda(descuento)})\`
  };
}`
  },
  "Cliente Premium": {
    file: "src/strategy/ClientePremium.ts",
    concept: "Misma interfaz, otra regla",
    explanation: "Premium cumple exactamente el mismo contrato que VIP, pero encapsula un porcentaje distinto. Puede reemplazarse sin cambiar la calculadora.",
    code: `aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
  const descuento = precioActual * 0.10;

  return {
    precio: precioActual - descuento,
    descripcion: \`10% de descuento (-\${formatearMoneda(descuento)})\`
  };
}`
  },
  "Descuento por cantidad": {
    file: "src/strategy/DescuentoPorCantidad.ts",
    concept: "Estrategia que consulta el pedido",
    explanation: "Esta regla necesita los productos del pedido. Cuenta unidades y decide entre 10%, 5% o ningun descuento.",
    code: `const cantidadProductos = contarProductos(pedido.productos);
let porcentaje = 0;

if (cantidadProductos > 10) {
  porcentaje = 0.10;
} else if (cantidadProductos > 5) {
  porcentaje = 0.05;
}

const descuento = precioActual * porcentaje;`
  },
  "Promocion especial": {
    file: "src/strategy/PromocionEspecial.ts",
    concept: "Estrategia configurable",
    explanation: "El porcentaje entra por constructor. Una sola clase puede representar distintas promociones sin duplicar la logica.",
    code: `constructor(porcentaje: number, nombre = "Promocion especial") {
  this.porcentaje = porcentaje;
  this.nombre = nombre;
}

aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
  const descuento = precioActual * this.porcentaje;
  return {
    precio: precioActual - descuento,
    descripcion: \`\${this.porcentaje * 100}% adicional\`
  };
}`
  },
  "Descuento Black Friday": {
    file: "src/strategy/DescuentoBlackFriday.ts",
    concept: "Extension sin modificar lo existente",
    explanation: "Una nueva politica de precio aparece como otra implementacion del contrato. No obliga a editar la calculadora ni las demas estrategias.",
    code: `export class DescuentoBlackFriday implements EstrategiaPrecio {
  nombre = "Descuento Black Friday";

  aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
    const descuento = precioActual * 0.20;
    return {
      precio: precioActual - descuento,
      descripcion: \`20% de descuento (-\${formatearMoneda(descuento)})\`
    };
  }
}`
  },
  "Envio Express": {
    file: "src/strategy/EnvioExpress.ts",
    concept: "Una estrategia tambien puede sumar",
    explanation: "El mismo contrato sirve para otra clase de transformacion: esta estrategia agrega un costo fijo en vez de descontar.",
    code: `private costo = 10000;

aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
  return {
    precio: precioActual + this.costo,
    descripcion: \`recargo de \${formatearMoneda(this.costo)}\`
  };
}`
  },
  "Envio normal": {
    file: "src/strategy/EnvioNormal.ts",
    concept: "Otra estrategia de envio",
    explanation: "Envio normal comparte el contrato y cambia solamente su costo. Desde la calculadora se usa igual que cualquier otra regla.",
    code: `private costo = 5000;

aplicar(precioActual: number, _pedido: Pedido): ResultadoEstrategia {
  return {
    precio: precioActual + this.costo,
    descripcion: \`recargo de \${formatearMoneda(this.costo)}\`
  };
}`
  }
};

const concreteValidators = {
  "Validar cliente": {
    file: "src/chain/ValidarCliente.ts",
    concept: "Primer eslabon",
    explanation: "La clase concreta solo sabe revisar si el cliente esta activo. La decision de continuar queda centralizada en ValidadorPedido.",
    code: `protected validar(pedido: Pedido): ResultadoValidacion {
  if (!pedido.cliente.activo) {
    return {
      aprobado: false,
      mensaje: "ERROR - el cliente no esta activo"
    };
  }

  return { aprobado: true, mensaje: "OK" };
}`
  },
  "Validar stock": {
    file: "src/chain/ValidarStock.ts",
    concept: "Corte temprano por error",
    explanation: "Este eslabon busca un producto sin existencias suficientes. Si devuelve aprobado: false, la clase base ya no invoca al siguiente handler.",
    code: `const productoSinStock = pedido.productos.find((producto) => {
  return producto.cantidad > producto.stockDisponible;
});

if (productoSinStock !== undefined) {
  return {
    aprobado: false,
    mensaje: \`ERROR - falta stock de \${productoSinStock.nombre}\`
  };
}`
  },
  "Validar pago": {
    file: "src/chain/ValidarPago.ts",
    concept: "Eslabon independiente",
    explanation: "Pago conoce una unica condicion. Si falla, la cadena termina aqui y Validar limite de compra nunca se ejecuta.",
    code: `protected validar(pedido: Pedido): ResultadoValidacion {
  if (!pedido.pagoAprobado) {
    return {
      aprobado: false,
      mensaje: "ERROR - el pago fue rechazado"
    };
  }

  return { aprobado: true, mensaje: "OK" };
}`
  },
  "Validar limite de compra": {
    file: "src/chain/ValidarLimiteCompra.ts",
    concept: "Nuevo control al final de la cadena",
    explanation: "El limite se configura por constructor y se agrega como un nuevo eslabon, sin cambiar los validadores anteriores.",
    code: `constructor(limite: number) {
  super();
  this.limite = limite;
}

protected validar(pedido: Pedido): ResultadoValidacion {
  if (pedido.precioFinal > this.limite) {
    return {
      aprobado: false,
      mensaje: \`ERROR - supera el limite de \${formatearMoneda(this.limite)}\`
    };
  }

  return { aprobado: true, mensaje: "OK" };
}`
  }
};

function strategyRoute(name) {
  const concrete = concreteStrategies[name];
  const mainLayer = {
    ...codeFragments.mainStrategy,
    code: caseCode[state.caseKey].calculator
  };

  return [
    mainLayer,
    codeFragments.calculator,
    codeFragments.strategyContract,
    {
      label: concrete.file.split("/").at(-1),
      file: concrete.file,
      role: "4. Implementacion concreta: contiene la regla de este paso",
      explanation: concrete.explanation,
      code: concrete.code,
      concept: concrete.concept
    },
    codeFragments.models
  ];
}

function validatorRoute(name) {
  const concrete = concreteValidators[name];
  return [
    codeFragments.mainChain,
    codeFragments.handlerContract,
    codeFragments.validatorBase,
    {
      label: concrete.file.split("/").at(-1),
      file: concrete.file,
      role: "4. Implementacion concreta: revisa la condicion de este paso",
      explanation: concrete.explanation,
      code: concrete.code,
      concept: concrete.concept
    },
    codeFragments.validationResult,
    codeFragments.models
  ];
}

function codeRouteFor(currentStep) {
  if (currentStep.strategyName) {
    return strategyRoute(currentStep.strategyName);
  }

  if (currentStep.validationName) {
    return validatorRoute(currentStep.validationName);
  }

  if (currentStep.codeKey === "cadena") {
    return [codeFragments.mainChain, codeFragments.handlerContract, codeFragments.validatorBase];
  }

  if (currentStep.codeKey === "resultado") {
    return [
      {
        label: "main.ts",
        file: "src/main.ts",
        role: "Integracion: Strategy calcula y Chain decide",
        explanation: "El cierre une ambos patrones. Primero se guarda el precio producido por las estrategias; despues la cadena procesa ese mismo pedido.",
        code: `pedido.precioFinal = calculadora.calcular(pedido);

const cadena = crearCadenaValidacion();
const resultado = cadena.procesar(pedido);

console.log(\`Resultado final: \${resultado.mensaje}\`);`,
        concept: "Resultado de la colaboracion"
      },
      codeFragments.calculator,
      codeFragments.validatorBase,
      codeFragments.validationResult
    ];
  }

  return [
    {
      label: "main.ts",
      file: "src/main.ts",
      role: "Entrada: crea el pedido concreto que se va a procesar",
      explanation: "El caso de uso prepara un Pedido con cliente, productos, pago y un precio final inicial. Ese objeto recorrera ambos patrones.",
      code: caseCode[state.caseKey].order,
      concept: "Construccion del caso"
    },
    codeFragments.models,
    {
      label: "CalculadoraPrecio.ts",
      file: "src/strategy/CalculadoraPrecio.ts",
      role: "Calculo inicial: obtiene el subtotal antes de las estrategias",
      explanation: "La calculadora comienza pidiendo al dominio que sume precio por cantidad de cada producto.",
      code: `let precio = calcularSubtotal(pedido.productos);`,
      concept: "Punto de partida del precio"
    }
  ];
}

const state = {
  caseKey: "aprobado",
  stepIndex: 0,
  codeLayerIndex: 0,
  steps: []
};

const productsElement = document.querySelector("#products");
const strategiesElement = document.querySelector("#strategies");
const validationsElement = document.querySelector("#validations");
const titleElement = document.querySelector("#case-title");
const finalPriceElement = document.querySelector("#final-price");
const guideTitleElement = document.querySelector("#guide-title");
const guideKindElement = document.querySelector("#guide-kind");
const guideTextElement = document.querySelector("#guide-text");
const codeConceptElement = document.querySelector("#code-concept");
const codeFileElement = document.querySelector("#code-file");
const codeRouteElement = document.querySelector("#code-route");
const codeRoleElement = document.querySelector("#code-role");
const codeExplanationElement = document.querySelector("#code-explanation");
const codeSnippetElement = document.querySelector("#code-snippet");
const priceBeforeElement = document.querySelector("#price-before");
const priceAfterElement = document.querySelector("#price-after");
const stepCounterElement = document.querySelector("#step-counter");
const progressDotsElement = document.querySelector("#progress-dots");
const previousButton = document.querySelector("#previous-step");
const nextButton = document.querySelector("#next-step");
const restartButton = document.querySelector("#restart-step");
const buttons = document.querySelectorAll(".case-button");
const simulatorTab = document.querySelector("#simulator-tab");
const theoryTab = document.querySelector("#theory-tab");
const simulatorView = document.querySelector("#simulator-view");
const theoryView = document.querySelector("#theory-view");
const caseControls = document.querySelector("#case-controls");

function selectView(view) {
  const showSimulator = view === "simulator";

  simulatorView.hidden = !showSimulator;
  theoryView.hidden = showSimulator;
  caseControls.hidden = !showSimulator;
  simulatorTab.classList.toggle("active", showSimulator);
  theoryTab.classList.toggle("active", !showSimulator);
  simulatorTab.setAttribute("aria-selected", String(showSimulator));
  theoryTab.setAttribute("aria-selected", String(!showSimulator));
}

function subtotal(products) {
  return products.reduce((total, product) => total + product.price * product.quantity, 0);
}

function productCount(products) {
  return products.reduce((total, product) => total + product.quantity, 0);
}

function applyStrategy(strategy, currentPrice, selectedCase) {
  if (strategy.kind === "percent") {
    const discount = currentPrice * strategy.value;
    return {
      price: currentPrice - discount,
      detail: `${strategy.text} (-${money.format(discount)})`
    };
  }

  if (strategy.kind === "quantity") {
    const quantity = productCount(selectedCase.products);
    const percent = quantity > 10 ? 0.10 : quantity > 5 ? 0.05 : 0;
    const discount = currentPrice * percent;

    return {
      price: currentPrice - discount,
      detail: `${quantity} productos, ${percent * 100}% de descuento (-${money.format(discount)})`
    };
  }

  return {
    price: currentPrice + strategy.value,
    detail: strategy.text
  };
}

function calculateStrategies(selectedCase) {
  let price = subtotal(selectedCase.products);

  return selectedCase.strategies.map((strategy) => {
    const previousPrice = price;
    const result = applyStrategy(strategy, price, selectedCase);
    price = result.price;

    return {
      name: strategy.name,
      detail: result.detail,
      previousPrice,
      price
    };
  });
}

function validateOrder(selectedCase, finalPrice) {
  const validations = [];

  validations.push({
    name: "Validar cliente",
    ok: true,
    detail: "OK",
    explanation: "El cliente esta activo, por eso el pedido puede pasar al siguiente control."
  });

  const missingStock = selectedCase.products.find((product) => product.quantity > product.stock);

  if (missingStock) {
    validations.push({
      name: "Validar stock",
      ok: false,
      detail: `ERROR - falta stock de ${missingStock.name}`,
      explanation: `La cadena se detiene porque se pidieron ${missingStock.quantity} unidades de ${missingStock.name}, pero solo hay ${missingStock.stock}.`
    });
    return validations;
  }

  validations.push({
    name: "Validar stock",
    ok: true,
    detail: "OK",
    explanation: "Hay stock suficiente para todos los productos, entonces el pedido sigue."
  });

  if (!selectedCase.paymentApproved) {
    validations.push({
      name: "Validar pago",
      ok: false,
      detail: "ERROR - el pago fue rechazado",
      explanation: "La cadena se detiene porque el pago no fue aprobado. Los pasos siguientes ya no se ejecutan."
    });
    return validations;
  }

  validations.push({
    name: "Validar pago",
    ok: true,
    detail: "OK",
    explanation: "El pago fue aprobado, por eso se puede continuar con el siguiente validador."
  });

  validations.push({
    name: "Validar limite de compra",
    ok: finalPrice <= 150000,
    detail: finalPrice <= 150000 ? "OK" : "ERROR - supera el limite de $150.000",
    explanation: finalPrice <= 150000
      ? "El precio final esta dentro del limite permitido y el pedido queda aprobado."
      : "El precio final supera el limite permitido, entonces el pedido se rechaza."
  });

  return validations;
}

function buildJourney(selectedCase) {
  const initialPrice = subtotal(selectedCase.products);
  const strategySteps = calculateStrategies(selectedCase);
  const finalPrice = strategySteps.at(-1).price;
  const validationSteps = validateOrder(selectedCase, finalPrice);
  const lastValidation = validationSteps.at(-1);
  const journey = [
    {
      type: "Pedido",
      name: "Inicio de la compra",
      text: "Primero se calcula el subtotal de los productos. Este es el precio base antes de aplicar descuentos, promociones o envio.",
      before: initialPrice,
      after: initialPrice,
      codeKey: "pedido"
    }
  ];

  strategySteps.forEach((step) => {
    journey.push({
      type: "Strategy",
      name: step.name,
      text: `Se aplica una estrategia independiente: ${step.detail}. La calculadora no conoce detalles internos, solo ejecuta la regla.`,
      before: step.previousPrice,
      after: step.price,
      strategyName: step.name,
      codeKey: step.name
    });
  });

  journey.push({
    type: "Cambio de patron",
    name: "Empieza la cadena",
    text: "Con el precio final calculado, ahora el pedido entra a Chain of Responsibility. Cada validador decide si continua o corta el proceso.",
    before: finalPrice,
    after: finalPrice,
    codeKey: "cadena"
  });

  validationSteps.forEach((step) => {
    journey.push({
      type: "Chain of Responsibility",
      name: step.name,
      text: step.explanation,
      before: finalPrice,
      after: finalPrice,
      validationName: step.name,
      ok: step.ok,
      codeKey: step.name
    });
  });

  journey.push({
    type: "Resultado",
    name: lastValidation.ok ? "Pedido aprobado" : "Pedido rechazado",
    text: lastValidation.ok
      ? "Como todos los validadores respondieron OK, el pedido queda aprobado."
      : `El procesamiento termina con este motivo: ${lastValidation.detail}`,
    before: finalPrice,
    after: finalPrice,
    ok: lastValidation.ok,
    codeKey: "resultado"
  });

  return { journey, strategySteps, validationSteps, finalPrice };
}

function renderProducts(products) {
  productsElement.innerHTML = products.map((product) => `
    <div class="product">
      <strong>${product.name}</strong>
      <span>Cantidad: ${product.quantity}</span>
      <span>Precio unitario: ${money.format(product.price)}</span>
      <span>Stock disponible: ${product.stock}</span>
    </div>
  `).join("");
}

function renderSteps(element, steps, activeName, revealedNames, kind) {
  element.innerHTML = steps.map((step) => {
    const revealed = revealedNames.has(step.name);
    const current = step.name === activeName;
    const statusClass = !revealed ? "pending" : step.ok === false ? "error" : "ok";
    const pendingText = kind === "strategy" ? "Pendiente de aplicar" : "Pendiente de validar";
    const journeyIndex = state.steps.findIndex((journeyStep) => {
      const stepName = kind === "strategy" ? journeyStep.strategyName : journeyStep.validationName;
      return stepName === step.name;
    });

    return `
      <li class="step ${statusClass} ${current ? "current" : ""}">
        <button class="step-jump" type="button" data-step="${journeyIndex}">
          <strong>${step.name}</strong>
          <span>${revealed ? step.detail : pendingText}</span>
        </button>
      </li>
    `;
  }).join("");

  element.querySelectorAll(".step-jump").forEach((stepButton) => {
    stepButton.addEventListener("click", () => {
      state.stepIndex = Number(stepButton.dataset.step);
      state.codeLayerIndex = 0;
      render();
    });
  });
}

function renderCodeLesson(currentStep) {
  const route = codeRouteFor(currentStep);
  const layer = route[state.codeLayerIndex] ?? route[0];

  codeRouteElement.innerHTML = route.map((routeLayer, index) => `
    <button
      class="route-node ${index === state.codeLayerIndex ? "active" : ""}"
      type="button"
      data-layer="${index}"
    >${routeLayer.label}</button>
  `).join("");

  codeRouteElement.querySelectorAll(".route-node").forEach((routeButton) => {
    routeButton.addEventListener("click", () => {
      state.codeLayerIndex = Number(routeButton.dataset.layer);
      renderCodeLesson(currentStep);
    });
  });

  codeConceptElement.textContent = layer.concept ?? currentStep.name;
  codeFileElement.textContent = layer.file;
  codeRoleElement.textContent = layer.role;
  codeExplanationElement.textContent = layer.explanation;
  codeSnippetElement.textContent = layer.code;
}

function renderProgressDots() {
  progressDotsElement.innerHTML = state.steps.map((step, index) => {
    const classes = [
      "dot",
      index < state.stepIndex ? "done" : "",
      index === state.stepIndex ? "active" : "",
      index <= state.stepIndex && step.ok === false ? "error" : ""
    ].filter(Boolean).join(" ");

    return `<button class="${classes}" data-step="${index}" aria-label="Ir al paso ${index + 1}">${index + 1}</button>`;
  }).join("");

  progressDotsElement.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", () => {
      state.stepIndex = Number(dot.dataset.step);
      state.codeLayerIndex = 0;
      render();
    });
  });
}

function render() {
  const selectedCase = cases[state.caseKey];
  const { strategySteps, validationSteps, finalPrice } = buildJourney(selectedCase);
  const currentStep = state.steps[state.stepIndex];
  const revealedStrategies = new Set(
    state.steps.slice(0, state.stepIndex + 1).map((step) => step.strategyName).filter(Boolean)
  );
  const revealedValidations = new Set(
    state.steps.slice(0, state.stepIndex + 1).map((step) => step.validationName).filter(Boolean)
  );

  titleElement.textContent = selectedCase.title;
  finalPriceElement.textContent = money.format(finalPrice);
  guideTitleElement.textContent = currentStep.name;
  guideKindElement.textContent = currentStep.type;
  guideTextElement.textContent = currentStep.text;
  priceBeforeElement.textContent = money.format(currentStep.before);
  priceAfterElement.textContent = money.format(currentStep.after);
  stepCounterElement.textContent = `Paso ${state.stepIndex + 1} de ${state.steps.length}`;
  renderCodeLesson(currentStep);

  renderProducts(selectedCase.products);
  renderSteps(strategiesElement, strategySteps, currentStep.strategyName, revealedStrategies, "strategy");
  renderSteps(validationsElement, validationSteps, currentStep.validationName, revealedValidations, "validation");
  renderProgressDots();

  previousButton.disabled = state.stepIndex === 0;
  nextButton.disabled = state.stepIndex === state.steps.length - 1;

  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.case === state.caseKey);
  });
}

function selectCase(caseKey) {
  state.caseKey = caseKey;
  state.stepIndex = 0;
  state.codeLayerIndex = 0;
  state.steps = buildJourney(cases[caseKey]).journey;
  render();
}

buttons.forEach((button) => {
  button.addEventListener("click", () => selectCase(button.dataset.case));
});

simulatorTab.addEventListener("click", () => selectView("simulator"));
theoryTab.addEventListener("click", () => selectView("theory"));

previousButton.addEventListener("click", () => {
  state.stepIndex = Math.max(0, state.stepIndex - 1);
  state.codeLayerIndex = 0;
  render();
});

nextButton.addEventListener("click", () => {
  state.stepIndex = Math.min(state.steps.length - 1, state.stepIndex + 1);
  state.codeLayerIndex = 0;
  render();
});

restartButton.addEventListener("click", () => {
  state.stepIndex = 0;
  state.codeLayerIndex = 0;
  render();
});

selectCase("aprobado");
