// componentes/tarjeta-producto.js
// Práctica de laboratorio · Construye <tarjeta-producto> (Actividad 8 de las diapositivas)
// Completa cada PASO. Los números son los mismos de la diapositiva y de la tarea en Moodle.

// ───────── PASO 2 · Plantilla con Shadow DOM y slots ─────────
// Una sola plantilla, declarada fuera de la clase.
const plantilla = document.createElement("template");
plantilla.innerHTML = `
  <style>
    /* PASO 3 · Escribe aquí los estilos del componente:
       - :host con display y un borde
       - el color de marca leído con var(--color-marca, un-color-de-respaldo)
       - ::slotted(...) para la foto y el nombre que llegan de la página
       RETO EXTRA · :host([destacado]) que cambie el borde */
  </style>

  <!-- PASO 2 · Escribe aquí:
       - un slot con nombre "foto"
       - un slot con nombre "nombre"
       - un slot sin nombre, con un texto de respaldo
       - un lugar donde se vea el precio (por ejemplo un <span id="precio">) -->
`;

export class TarjetaProducto extends HTMLElement {

  // PASO 3 · Indica qué atributos observa el componente.
  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    // PASO 2 · Crea el Shadow DOM en modo "open".
    // Recuerda: aquí no se leen atributos ni se dibuja HTML.
  }

  connectedCallback() {
    // PASO 2 · Agrega al Shadow DOM una COPIA de la plantilla con cloneNode(true).
    // PASO 3 · Muestra el precio inicial.
  }

  attributeChangedCallback(nombre, anterior, valor) {
    // PASO 3 · Cuando cambie "precio", actualiza lo que se ve en pantalla.
    // Ojo: si el atributo ya viene escrito en el HTML, este método se ejecuta
    // ANTES que connectedCallback; comprueba que la plantilla ya esté clonada.
  }

  // PASO 3 · La propiedad lee y escribe el atributo, así quedan sincronizados.
  get precio() {
    return 0;
  }

  set precio(valor) {
  }
}

// ───────── PASO 1 · Registra el componente ─────────
// Escribe aquí customElements.define(...) con una etiqueta que tenga guion.
