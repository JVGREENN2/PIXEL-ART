const canvas = document.querySelector(".canvas");
const inputSize = document.querySelector(".input-size");
const inputColor = document.querySelector(".input-color");
const usedColors = document.querySelector(".used-colors");
const buttonSave = document.querySelector(".button-save");
const colResize = document.querySelector(".resize");
const main = document.querySelector("main");

const MIN_CANVAS_SIZE = 1;
const MAX_CANVAS_SIZE = 3500; // Tamanho máximo em pixels(350x350)

let isPainting = false;
let isResizing = false;

// Cria elementos HTML dinamicamente
const createElement = (tag, className = "") => {
    const element = document.createElement(tag);
    element.className = className;
    return element;
};

// Define a cor do pixel
const setPixelColor = (pixel) => {
    pixel.style.backgroundColor = inputColor.value;
};

// Cria um único pixel
const createPixel = () => {
    const pixel = createElement("div", "pixel");

    pixel.addEventListener("mousedown", () => setPixelColor(pixel));
    pixel.addEventListener("mouseover", () => {
        if (isPainting) setPixelColor(pixel);
    });

    return pixel;
};

// Cria o canvas com o tamanho especificado
const loadCanvas = () => {
    const size = inputSize.value;
    canvas.innerHTML = "";

    for (let i = 0; i < size; i += 1) {
        const row = createElement("div", "row");

        for (let j = 0; j < size; j += 1) {
            row.append(createPixel());
        }

        canvas.append(row);
    }
};

// Atualiza o tamanho do canvas, garantindo o limite máximo
const updateCanvasSize = () => {
    const maxSize = Math.floor(MAX_CANVAS_SIZE / 10); // 35x35 pixels para 350px totais
    let size = parseInt(inputSize.value, 10);

    if (size > maxSize) {
        size = maxSize;
        alert(`O tamanho máximo permitido é ${maxSize}x${maxSize} pixels.`);
    }

    if (size < MIN_CANVAS_SIZE) {
        size = MIN_CANVAS_SIZE;
    }

    inputSize.value = size;
    loadCanvas();
};

// Adiciona a cor atual aos botões de cores usadas
const changeColor = () => {
    const button = createElement("button", "button-color");
    const currentColor = inputColor.value;

    button.style.backgroundColor = currentColor;
    button.setAttribute("data-color", currentColor);
    button.addEventListener("click", () => (inputColor.value = currentColor));

    const savedColors = Array.from(usedColors.children);

    const check = (btn) => btn.getAttribute("data-color") != currentColor;

    if (savedColors.every(check)) {
        usedColors.append(button);
    }
};

// Redimensiona o canvas horizontalmente
const resizeCanvas = (cursorPositionX) => {
    if (!isResizing) return;

    const canvasOffset = canvas.getBoundingClientRect().left;
    const width = `${cursorPositionX - canvasOffset - 20}px`;

    canvas.style.maxWidth = width;
    colResize.style.height = width;
};

// Salva o canvas como imagem
const saveCanvas = () => {
    html2canvas(canvas).then((image) => {
        const img = image.toDataURL("image/png");
        const link = createElement("a");

        link.href = img;
        link.download = "pixelart.png";

        link.click();
    });
};

// Eventos
canvas.addEventListener("mousedown", () => (isPainting = true));
canvas.addEventListener("mouseup", () => (isPainting = false));

inputSize.addEventListener("change", updateCanvasSize);
inputColor.addEventListener("change", changeColor);

colResize.addEventListener("mousedown", () => (isResizing = true));
main.addEventListener("mouseup", () => (isResizing = false));
main.addEventListener("mousemove", ({ clientX }) => resizeCanvas(clientX));

buttonSave.addEventListener("click", saveCanvas);

// Inicializa o canvas
loadCanvas();