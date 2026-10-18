const template = document.createElement("template");
template.innerHTML = `
  <style>
    :host {
      display: block;
      border: 1px solid var(--color-marca, #ccc); /* Color de marca de la rúbrica */
      border-radius: 8px;
      padding: 20px;
      font-family: sans-serif;
      max-width: 400px;
      margin-bottom: 20px;
    }
    h3 {
      color: var(--color-marca, #ccc);
      margin-top: 0;
    }
    input[type="date"] {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-sizing: border-box;
    }
    .horas-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    button {
      padding: 10px;
      border: 1px solid var(--color-marca, #ccc);
      background: #fff;
      color: #333;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.2s;
    }
    /* Horarios ocupados deshabilitados */
    button:disabled {
      background: #f0f0f0;
      border-color: #ddd;
      color: #aaa;
      cursor: not-allowed;
    }
    button.seleccionado {
      background: var(--color-marca, #ccc);
      color: white;
      font-weight: bold;
    }
  </style>

  <!-- Slot con nombre y texto de respaldo -->
  <h3><slot name="titulo">Elige tu turno</slot></h3>
  
  <input type="date" id="input-fecha">
  <div class="horas-grid" id="contenedor-horas">
    <!-- Aquí se inyectarán los botones desde JS -->
  </div>
`;

export class CalendarioCitas extends HTMLElement {
  constructor() {
    super();
    // 1. Usa Shadow DOM
    this.attachShadow({ mode: "open" });
    this.horariosDisponibles = [];
  }

  async connectedCallback() {
    // 2. Clona la plantilla
    this.shadowRoot.append(template.content.cloneNode(true));
    
    // Cargar el JSON simulado
    try {
      const respuesta = await fetch('./datos/horarios.json');
      this.horariosDisponibles = await respuesta.json();
    } catch (error) {
      console.error("Error al cargar horarios.json", error);
    }

    const inputFecha = this.shadowRoot.querySelector("#input-fecha");
    
    // Escuchar el cambio en el calendario nativo
    inputFecha.addEventListener("change", (e) => {
      this.setAttribute("fecha", e.target.value);
    });

    // Si ya trae fecha por defecto, pintamos las horas
    if (this.hasAttribute("fecha")) {
      inputFecha.value = this.getAttribute("fecha");
      this.dibujarHoras(this.getAttribute("fecha"));
    }
  }

  // 3. Atributo observado
  static get observedAttributes() {
    return ["fecha"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "fecha" && oldValue !== newValue) {
      this.dibujarHoras(newValue);
    }
  }

  dibujarHoras(fechaSeleccionada) {
    const contenedor = this.shadowRoot.querySelector("#contenedor-horas");
    contenedor.innerHTML = ""; // Limpiar grid

    // Buscar si la fecha seleccionada está en nuestro JSON
    const diaEncontrado = this.horariosDisponibles.find(dia => dia.fecha === fechaSeleccionada);
    const horasLibres = diaEncontrado ? diaEncontrado.horas : [];

    // Todas las horas de atención de la peluquería
    const horarioAtencion = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

    horarioAtencion.forEach(hora => {
      const btn = document.createElement("button");
      btn.textContent = hora;

      // Si la hora NO está en el JSON de libres, se deshabilita
      if (!horasLibres.includes(hora)) {
        btn.disabled = true;
      } else {
        btn.addEventListener("click", () => this.seleccionarHora(fechaSeleccionada, hora, btn));
      }
      
      contenedor.appendChild(btn);
    });
  }

  seleccionarHora(fecha, hora, botonClicado) {
    // Quitar selección a todos
    this.shadowRoot.querySelectorAll("button").forEach(b => b.classList.remove("seleccionado"));
    // Marcar el elegido
    botonClicado.classList.add("seleccionado");

    // 4. Emitir el evento esperado por el Atleta 4
    this.dispatchEvent(new CustomEvent("horario-seleccionado", {
      detail: { fecha: fecha, hora: hora },
      bubbles: true,
      composed: true // Vital para que salga del Shadow DOM
    }));
  }
}

// 5. Etiqueta con guion
customElements.define("calendario-citas", CalendarioCitas);