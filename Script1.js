const video = document.getElementById("video");
const botonCamara = document.getElementById("botonCamara");

const emocionTexto = document.getElementById("emocion");
const confianzaTexto = document.getElementById("confianza");
const fraseTexto = document.getElementById("frase");
const estadoTexto = document.getElementById("estado");

let modelosListos = false;
let analizando = false;


// ==========================================
// EMOCIONES
// ==========================================

const nombresEmociones = {

    neutral: "😐 Neutral",

    happy: "😊 Feliz",

    sad: "😢 Triste",

    angry: "😠 Enojado",

    surprised: "😮 Sorprendido",

    fearful: "😨 Miedo",

    disgusted: "🤢 Disgusto"

};


// ==========================================
// FRASES PARA CADA EMOCIÓN
// ==========================================

const frasesEmociones = {

    neutral:
        "Todo tranquilo por aquí. 😐",

    happy:
        "¡Se nota que estás teniendo un buen día! 😄",

    sad:
        "Parece que estás pasando por un momento difícil. Ánimo. ❤️",

    angry:
        "Parece que algo te molestó. Respira y tómate un momento. 😮‍💨",

    surprised:
        "¡Vaya! Parece que viste algo inesperado. 😮",

    fearful:
        "Parece que estás preocupado. Tómate un momento para respirar. 🌬️",

    disgusted:
        "Parece que algo no te gustó mucho. 🤢"

};


// ==========================================
// CARGAR MODELOS DE IA
// ==========================================

async function cargarIA() {

    estadoTexto.textContent =
        "Cargando inteligencia artificial...";

    const URL =
        "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights";

    try {

        await faceapi.nets.tinyFaceDetector.loadFromUri(URL);

        await faceapi.nets.faceExpressionNet.loadFromUri(URL);

        modelosListos = true;

        estadoTexto.textContent =
            "IA lista. Puedes activar la cámara.";

    } catch (error) {

        console.error(error);

        estadoTexto.textContent =
            "No se pudieron cargar los modelos de IA.";

    }
}


// ==========================================
// ACTIVAR CÁMARA
// ==========================================

async function activarCamara() {

    if (!modelosListos) {

        alert(
            "Espera a que la inteligencia artificial termine de cargar."
        );

        return;
    }

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({

                video: true,

                audio: false

            });

        video.srcObject = stream;

        botonCamara.textContent =
            "Cámara activada";

        botonCamara.disabled = true;

        estadoTexto.textContent =
            "Cámara activa. Buscando rostro...";

    } catch (error) {

        console.error(error);

        estadoTexto.textContent =
            "No se pudo acceder a la cámara.";

        alert(
            "No se pudo activar la cámara. Debes permitir el acceso a la cámara."
        );

    }
}


// ==========================================
// DETECTAR EMOCIONES
// ==========================================

video.addEventListener("play", () => {

    if (analizando) {
        return;
    }

    analizando = true;

    const opciones =
        new faceapi.TinyFaceDetectorOptions({

            inputSize: 320,

            scoreThreshold: 0.5

        });


    setInterval(async () => {

        try {

            const detecciones =
                await faceapi
                    .detectAllFaces(
                        video,
                        opciones
                    )
                    .withFaceExpressions();


            // ==================================
            // NO HAY ROSTRO
            // ==================================

            if (detecciones.length === 0) {

                emocionTexto.textContent =
                    "No se detecta ningún rostro";

                confianzaTexto.textContent = "";

                fraseTexto.textContent =
                    "Coloca tu rostro frente a la cámara.";

                estadoTexto.textContent =
                    "Buscando rostro...";

                return;
            }


            // ==================================
            // PRIMER ROSTRO DETECTADO
            // ==================================

            const rostro = detecciones[0];

            const expresiones =
                rostro.expressions;


            // ==================================
            // BUSCAR EMOCIÓN PRINCIPAL
            // ==================================

            let mayorEmocion = "neutral";

            let mayorValor = 0;


            for (const nombre in expresiones) {

                const valor =
                    expresiones[nombre];

                if (valor > mayorValor) {

                    mayorValor = valor;

                    mayorEmocion = nombre;

                }

            }


            // ==================================
            // MOSTRAR EMOCIÓN
            // ==================================

            const nombre =
                nombresEmociones[mayorEmocion];

            const frase =
                frasesEmociones[mayorEmocion];


            const porcentaje =
                Math.round(
                    mayorValor * 100
                );


            emocionTexto.textContent =
                nombre;


            confianzaTexto.textContent =
                "Confianza aproximada: " +
                porcentaje +
                "%";


            fraseTexto.textContent =
                frase;


            estadoTexto.textContent =
                "Rostro detectado correctamente.";


        } catch (error) {

            console.error(
                "Error analizando rostro:",
                error
            );

        }

    }, 500);

});


// ==========================================
// BOTÓN
// ==========================================

botonCamara.addEventListener(
    "click",
    activarCamara
);


// ==========================================
// INICIAR IA
// ==========================================

cargarIA();