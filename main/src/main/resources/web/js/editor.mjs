import * as utils from "./utils.mjs";

import { bindDefaults } from "./modules/textBox.mjs";

window.editor = {
    canvas: document.getElementById("canvas"),

    currentTool: "manipulator",
    editingSlide: 1,

    movingContext: {
        moving: false,
        movingElement: null,
        canvasLeft: 0,
        canvasTop: 0
    },

    utils: utils
};

window.addEventListener("mousedown", async (ev) => {
    // If the user clicked on a child element of the 'canvas' id element with the currentTool as manipulator, 
    // It should start to follow the mouse position and move the element until the click is released.

    // Calculate how far left canvas is from the left of the window.
    const canvasLeft = editor.canvas.getBoundingClientRect().left;
    window.editor.movingContext.canvasLeft = canvasLeft;
    // Calculate how far top canvas is from the top of the window.
    const canvasTop = editor.canvas.getBoundingClientRect().top;
    window.editor.movingContext.canvasTop = canvasTop;

    if (editor.currentTool == "manipulator") {
        // Check if ev.target is a child in the canvas element.
        if (utils.isParent(ev.target, editor.canvas, 4)) {
            // console.log(ev.target)
            window.editor.movingContext.moving = true;
            window.editor.movingContext.movingElement = ev.target;

            
            // Calculate how far left the mouse is from the left of the window.
            const mouseLeft = ev.clientX;
            // Calculate how far top the mouse is from the top of the window.
            const mouseTop = ev.clientY;

            // Set the element to absolute, then apply it's left and top to match the cursor.
            window.editor.movingContext.movingElement.style.position = "absolute";
            window.editor.movingContext.movingElement.style.left = `${mouseLeft - canvasLeft}px`;
            window.editor.movingContext.movingElement.style.top = `${mouseTop - canvasTop}px`;
            window.editor.utils.slideEdited();

        }
    } else if (editor.currentTool == "text" && ev.target.id == "canvas") {

        // Get the fontSize id value.
        const fontSize = document.getElementById("fontSize").value;

        // Create a new text element at the mouse position.
        const text = document.createElement("div");
        text.classList.add("text");
        text.style.position = "absolute";
        text.style.left = `${ev.clientX - canvasLeft}px`;
        text.style.top = `${ev.clientY - canvasTop}px`;
        text.style.minWidth = `${fontSize}px`;
        text.style.minHeight = "10px";
        text.style.width = "fit-content";
        text.style.height = "fit-content";
        text.contentEditable = true;
        text.style.fontSize = `${fontSize}px`;

        // Use the font family in the fontFamily id element.
        text.style.fontFamily = document.getElementById("fontFamily").value;

        // Add it at the end of the canvas.
        editor.canvas.appendChild(text);

        text.focus();

        // Make 'enter' submit the text, as long as shift isn't pressed.
        bindDefaults(text);

    } else if (editor.currentTool == "image" && ev.target.id == "canvas") {
        // Prompt the user for an image URL.
        const url = prompt("Enter an image URL");
        if (url) {
            // Create a new image element at the mouse position.
            const image = document.createElement("img");
            image.classList.add("image");
            image.style.position = "absolute";
            image.style.left = `${ev.clientX - canvasLeft}px`;
            image.style.top = `${ev.clientY - canvasTop}px`;
            image.src = url;
            // Add it at the end of the canvas.
            editor.canvas.appendChild(image);
            window.editor.utils.slideEdited();
        }
    } else if (editor.currentTool == "delete") {
        // Check if ev.target is a child in the canvas element.
        if (utils.isParent(ev.target, editor.canvas, 4)) {
            // console.log(ev.target)
            ev.target.remove();
            window.editor.utils.slideEdited();
        }
    } else if (ev.target.className == "slide") {
        // If the user clicked on a slide, set the current slide to the clicked slide.
        const clickedSlide = Array.from(document.getElementById("slideContainer").children).indexOf(ev.target);

        // Return if the user clicked on the slide they're editing.
        if (clickedSlide == window.editor.editingSlide) {
            return;
        } else {
            // Set the current slide to the clicked slide.
            window.editor.editingSlide = clickedSlide;
            const html = await requestSlide(window.editor.editingSlide);
            window.editor.canvas.innerHTML = html;
        }
    }
})

window.addEventListener("mousemove", (ev) => {
    if (window.editor.movingContext.moving) {
        // Calculate how far left the mouse is from the left of the window.
        const mouseLeft = ev.clientX;
        // Calculate how far top the mouse is from the top of the window.
        const mouseTop = ev.clientY;

        // Set the element to absolute, then apply it's left and top to match the cursor.
        window.editor.movingContext.movingElement.style.left = `${mouseLeft - window.editor.movingContext.canvasLeft}px`;
        window.editor.movingContext.movingElement.style.top = `${mouseTop - window.editor.movingContext.canvasTop}px`;
    }

    if (window.editor.currentTool == "draw") {
        // Return if mouse is not down.
        if (!ev.buttons) {
            return;
        }

        // Return if the mouse is not over the canvas.
        if (ev.target != editor.canvas) {
            return;
        }

        // Get the lineWidth id value.
        const lineWidth = document.getElementById("brushSize").value;
        // Get the lineColor id value.
        const lineColor = document.getElementById("brushColor").value;

        // create a new circular div with the color of the brush, and the size of the brush.
        const circle = document.createElement("div");
        circle.classList.add("circleShape");
        circle.style.position = "absolute";
        circle.style.left = `${ev.clientX - window.editor.movingContext.canvasLeft}px`;
        circle.style.top = `${ev.clientY - window.editor.movingContext.canvasTop}px`;
        circle.style.width = `${lineWidth}px`;
        circle.style.height = `${lineWidth}px`;
        circle.style.borderRadius = "50%";
        circle.style.backgroundColor = lineColor;

        // Add it at the end of the canvas.
        editor.canvas.appendChild(circle);
        window.editor.utils.slideEdited();
    }
});

window.addEventListener("mouseup", (ev) => {
    if (window.editor.movingContext.moving) {
        window.editor.movingContext.moving = false;
        window.editor.movingContext.movingElement = null;
        slideEdited();
    }
});

async function requestSlide(num) {
    console.log("Requesting Slide " + num);
    let result = "";
    try {
        const response = await fetch(`http://localhost:8080/getSlide?number=${num}`, {
            method: "GET"
        }).then((res) => res.text());
        result = response;
    } catch (_) {
        alert(`Internal Error: Could not get slide ${num} from backend.`)
    }

    return result;
}