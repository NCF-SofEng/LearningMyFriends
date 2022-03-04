import * as utils from "./utils.mjs";

window.editor = {
    canvas: document.getElementById("canvas"),

    currentTool: "text",

    movingContext: {
        moving: false,
        movingElement: null,
        canvasLeft: 0,
        canvasTop: 0
    },

    utils: utils
};

window.addEventListener("mousedown", (ev) => {
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
        }
    } else if (editor.currentTool == "text" && ev.target.id == "canvas") {

        // Create a new text element at the mouse position.
        const text = document.createElement("div");
        text.classList.add("text");
        text.style.position = "absolute";
        text.style.left = `${ev.clientX - canvasLeft}px`;
        text.style.top = `${ev.clientY - canvasTop}px`;
        text.style.width = "100px";
        text.style.height = "100px";
        text.contentEditable = true;
        // Add it at the end of the canvas.
        editor.canvas.appendChild(text);

        text.focus();

        // If it's submitted without being edited, remove it.
        // text.addEventListener("blur", (e) => {
        //     console.log(text.innerText)
        //     if (text.innerText == "") {
        //         console.log("removing")
        //         text.remove();
        //     }
        // });

        // Make 'enter' submit the text, as long as shift isn't pressed.
        text.addEventListener("keypress", (e) => {
            if (e.keyCode == 13 && !e.shiftKey) {
                text.blur();
            }
        });
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
});

window.addEventListener("mouseup", (ev) => {
    if (window.editor.movingContext.moving) {
        window.editor.movingContext.moving = false;
        window.editor.movingContext.movingElement = null;
    }
});