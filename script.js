// Cada pregunta acepta una o varias respuestas válidas (ya normalizadas:
// minúsculas y sin tildes). Edita este arreglo para cambiar el quiz.
const PREGUNTAS = [
  { texto: "¿Cuál es mi segundo nombre?", aceptadas: ["angelica"] },
  { texto: "¿Cuántos años tengo?", aceptadas: ["33"] },
  { texto: "¿En qué mes cumplo años?", aceptadas: ["agosto"] },
  // TODO: en tu código Python esta pregunta comparaba con "agosto" (error).
  // Pon aquí el día real de tu cumpleaños, por ejemplo ["15"].
  { texto: "¿Qué día es mi cumpleaños?", aceptadas: ["CAMBIAR_DIA"] },
  { texto: "¿Cuál es mi color favorito?", aceptadas: ["rosado", "rosa"] },
  { texto: "¿Cuál es mi comida favorita?", aceptadas: ["bandeja paisa"] },
  { texto: "¿A qué le tengo miedo?", aceptadas: ["ratones", "raton", "ratas"] },
  { texto: "¿Qué es lo que más me gusta hacer?", aceptadas: ["viajar"] },
  { texto: "¿Cuál es mi celebración favorita del año?", aceptadas: ["navidad"] },
  { texto: "¿Dónde nos conocimos?", aceptadas: ["trabajo", "el trabajo"] },
];

const $ = (id) => document.getElementById(id);
const pantallas = ["inicio", "pregunta", "final"];
let indice = 0;
let correctas = 0;

function normalizar(texto) {
  return texto
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function mostrar(id) {
  pantallas.forEach((p) => $(p).classList.toggle("activa", p === id));
}

function cargarPregunta() {
  const total = PREGUNTAS.length;
  $("contador").textContent = `Pregunta ${indice + 1} de ${total}`;
  $("texto-pregunta").textContent = PREGUNTAS[indice].texto;
  $("barra").style.width = `${(indice / total) * 100}%`;
  document.querySelector(".progreso").setAttribute("aria-valuenow", indice + 1);

  const campo = $("respuesta");
  campo.value = "";
  campo.disabled = false;
  $("btn-responder").hidden = false;
  $("btn-siguiente").hidden = true;
  $("feedback").textContent = "";
  $("feedback").className = "feedback";
  campo.focus();
}

function responder(evento) {
  evento.preventDefault();
  const dada = normalizar($("respuesta").value);
  const acierto = PREGUNTAS[indice].aceptadas.includes(dada);

  if (acierto) {
    correctas++;
    $("feedback").textContent = "¡Correcto!";
    $("feedback").className = "feedback ok";
    const marco = document.querySelector(".marco");
    marco.classList.remove("acierto");
    void marco.offsetWidth; // reinicia la animación
    marco.classList.add("acierto");
  } else {
    $("feedback").textContent = "Esa no era.";
    $("feedback").className = "feedback no";
  }

  $("respuesta").disabled = true;
  $("btn-responder").hidden = true;
  $("btn-siguiente").textContent = indice === PREGUNTAS.length - 1 ? "Ver resultado" : "Siguiente";
  $("btn-siguiente").hidden = false;
  $("btn-siguiente").focus();
}

function siguiente() {
  indice++;
  if (indice < PREGUNTAS.length) {
    cargarPregunta();
  } else {
    terminar();
  }
}

function terminar() {
  const total = PREGUNTAS.length;
  $("puntaje").textContent = `${correctas} / ${total}`;
  $("detalle").textContent = `${correctas} correctas · ${total - correctas} incorrectas`;
  mostrar("final");
}

function empezar() {
  indice = 0;
  correctas = 0;
  mostrar("pregunta");
  cargarPregunta();
}

$("btn-empezar").addEventListener("click", empezar);
$("btn-reiniciar").addEventListener("click", empezar);
$("form-respuesta").addEventListener("submit", responder);
$("btn-siguiente").addEventListener("click", siguiente);
