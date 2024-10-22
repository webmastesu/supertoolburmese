const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const textInput = document.getElementById('textInput');
const addTextButton = document.getElementById('addText');
const generateButton = document.getElementById('generateMeme');
const saveButton = document.getElementById('saveMeme');

let image = null;
let texts = [];
let selectedText = null;
let isDragging = false;

// Load the image
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        image = new Image();
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Add text to the meme
addTextButton.addEventListener('click', () => {
    if (textInput.value.trim()) {
        texts.push({
            text: textInput.value.trim(),
            x: 50,
            y: texts.length * 30 + 50,
            fontSize: 24,
        });
        renderMeme();
        textInput.value = '';
    }
});

// Render the meme with text
function renderMeme() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (image) {
        ctx.drawImage(image, 0, 0);
    }
    texts.forEach(text => {
        ctx.font = `${text.fontSize}px Arial`;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fillText(text.text, text.x, text.y);
        ctx.strokeText(text.text, text.x, text.y);
    });
}

// Check if a text is clicked (for dragging)
function isTextClicked(x, y) {
    for (let i = texts.length - 1; i >= 0; i--) {
        const text = texts[i];
        const textWidth = ctx.measureText(text.text).width;
        if (x >= text.x && x <= text.x + textWidth && y <= text.y && y >= text.y - text.fontSize) {
            return text;
        }
    }
    return null;
}

// Handle mouse down event for selecting and dragging text
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    selectedText = isTextClicked(x, y);
    if (selectedText) {
        isDragging = true;
    }
});

// Handle mouse move event for dragging text
canvas.addEventListener('mousemove', (e) => {
    if (isDragging && selectedText) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        selectedText.x = x;
        selectedText.y = y;
        renderMeme();
    }
});

// Handle mouse up event (stop dragging)
canvas.addEventListener('mouseup', () => {
    isDragging = false;
    selectedText = null;
});

// Generate meme
generateButton.addEventListener('click', () => {
    renderMeme();
});

// Save meme
saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
