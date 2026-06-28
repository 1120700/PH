document.addEventListener("DOMContentLoaded", () => {
// Captura de elementos DOM
const inputAgua = document.getElementById("input-agua");
const inputVinagre = document.getElementById("input-vinagre");
const inputBicarbonato = document.getElementById("input-bicarbonato");
const inputTemp = document.getElementById("input-temp");
const valAgua = document.getElementById("val-agua");
const valVinagre = document.getElementById("val-vinagre");
const valBicarbonato = document.getElementById("val-bicarbonato");
const valTemp = document.getElementById("val-temp");
const liquid = document.getElementById("liquid");
const bubbles = document.getElementById("bubbles");
const phValue = document.getElementById("ph-value");
const phStatus = document.getElementById("ph-status");
const phBox = document.getElementById("ph-box");
function calcularSimulacion() {
// Obtener valores numéricos de los sliders
const agua = parseFloat(inputAgua.value);
const vinagre = parseFloat(inputVinagre.value);
const bicarbonato = parseFloat(inputBicarbonato.value);
const temp = parseFloat(inputTemp.value);
// Actualizar etiquetas numéricas
valAgua.innerText = agua;
valVinagre.innerText = vinagre;
valBicarbonato.innerText = bicarbonato;
valTemp.innerText = temp;
// 1. Cálculo del volumen total aproximado en Litros
const volTotalMl = agua + vinagre;
const volTotalL = volTotalMl / 1000;
// 2. Cálculo de moles de reactivos
// Vinagre comercial estándar ~ 5% v/v de ácido acético (aprox. 0.8 M)
const molesAcido = (vinagre / 1000) * 0.8;
// Bicarbonato de sodio (Masa molar ~ 84 g/mol)
const molesBase = bicarbonato / 84.0;
// 3. Reacción de neutralización química
let molesAcidoRestante = 0;
let molesBaseRestante = 0;
let reaccionActiva = false;
if (molesAcido > 0 && molesBase > 0) {
reaccionActiva = true; // Hay efervescencia si coexisten ambos
if (molesAcido > molesBase) {
molesAcidoRestante = molesAcido - molesBase;
} else {
molesBaseRestante = molesBase - molesAcido;
}
} else {
molesAcidoRestante = molesAcido;
molesBaseRestante = molesBase;
}
// 4. Determinación teórica simplificada del pH y efecto térmico
  let ph = 7.0;
// Efecto térmico sobre el agua pura (autoionización)
const shiftTermico = (temp - 25) * 0.005;
if (vinagre === 0 && bicarbonato === 0) {
ph = 7.0 - shiftTermico;
} else if (molesAcidoRestante > 0) {
// Solución ácida (Ácido acético sobrante + amortiguador de acetato)
const M_acido = molesAcidoRestante / volTotalL;
const Ka = 1.8e-5 * (1 + (temp - 25) * 0.001); // Variación de constante
const h_plus = Math.sqrt(Ka * M_acido);
ph = -Math.log10(h_plus);
if (isNaN(ph) || ph < 0) ph = 2.4; // Límite inferior físico
} else if (molesBaseRestante > 0) {
// Solución básica (Bicarbonato excedente)
const M_base = molesBaseRestante / volTotalL;
const Kb = 2.3e-8; // Constante hidrólisis simplificada
const oh_minus = Math.sqrt(Kb * M_base);
let pOH = -Math.log10(oh_minus);
if (isNaN(pOH)) pOH = 5.0;
ph = (14.0 - shiftTermico) - pOH;
if (ph > 9.5) ph = 9.5; // Límite superior amortiguado
} else {
// Punto exacto de neutralización estequiométrica
ph = 7.0 - shiftTermico;
}
// Fijar límites realistas del simulador
if (ph < 1) ph = 1.0;
if (ph > 14) ph = 14.0;
// 5. Actualización de Interfaz Gráfica (UI)
phValue.innerText = ph.toFixed(2);
// Clasificación del pH y colores del pHmetro
if (ph < 6.5) {
phStatus.innerText = "Ácido";
phValue.style.color = "#fc8181"; // Rojo/Rosa
} else if (ph > 7.5) {
phStatus.innerText = "Alcalino (Base)";
phValue.style.color = "#63b3ed"; // Azul
} else {
phStatus.innerText = "Neutro";
phValue.style.color = "#48bb78"; // Verde
}
// Ajustar altura del líquido en el vaso (máximo 90% del vaso)
const alturaPorcentaje = Math.min(90, (volTotalMl / 700) * 100 + (bicarbonato * 0.5));
liquid.style.height = `${alturaPorcentaje}%`;
// Cambiar tonalidad del líquido según acidez
if (ph < 5) {
liquid.style.backgroundColor = "rgba(229, 62, 62, 0.5)"; // Rojo claro
} else if (ph > 8) {
liquid.style.backgroundColor = "rgba(49, 130, 206, 0.5)"; // Azul claro
} else {
liquid.style.backgroundColor = "rgba(66, 153, 225, 0.5)"; // Agua neutral
}
// Manejo de la animación de efervescencia ($CO_2$)
if (reaccionActiva && bicarbonato > 0.5 && vinagre > 2) {
bubbles.style.opacity = "1";
bubbles.style.height = `${alturaPorcentaje}%`;
bubbles.classList.add("fizzing");
} else {
bubbles.style.opacity = "0";
bubbles.style.height = "0%";
bubbles.classList.remove("fizzing");

}
}
// Escuchar eventos en los deslizadores para actualizar en tiempo real
inputAgua.addEventListener("input", calcularSimulacion);
inputVinagre.addEventListener("input", calcularSimulacion);
inputBicarbonato.addEventListener("input", calcularSimulacion);
inputTemp.addEventListener("input", calcularSimulacion);
// Ejecución inicial al cargar
calcularSimulacion();
});
