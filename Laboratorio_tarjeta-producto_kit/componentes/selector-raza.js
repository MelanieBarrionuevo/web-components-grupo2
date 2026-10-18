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
    <slot name="foto"></slot>
    <slot name="nombre"></slot>
    <p class="descripcion"><slot>Sin descripción</slot></p>
    <div id="grupos"></div>
    <p class="precio"><span id="etiqueta">Desde</span> $<span id="precio">0.00</span></p>
    <p class="detalle" id="detalle">Elige una raza para cotizar</p>
`;

export class SelectorRaza extends HTMLElement {

  // PASO 3 · Indica qué atributos observa el componente.
  static get observedAttributes() {
    return ["precio", "raza"];
  }

  constructor() {
    super();
    // PASO 2 · Crea el Shadow DOM en modo "open".
    this.attachShadow({ mode: "open" });
    // Recuerda: aquí no se leen atributos ni se dibuja HTML.
  }

  render() {
    this.shadowRoot.appendChild(plantilla.content.cloneNode(true));
  }

  connectedCallback() {
    // PASO 2 · Agrega al Shadow DOM una COPIA de la plantilla con cloneNode(true).
    if (!this.shadowRoot.hasChildNodes()) {
      this.render();
    }
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

//paso 1 definir la tarjeta
customElements.define("selector-raza", SelectorRaza);

