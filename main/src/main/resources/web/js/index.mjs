import "./modules/slideInteractors.mjs"
import "./presentation.mjs"
import { Menu } from "./structs/Menu.mjs";

/**
 * Load the essential modules. In this case, HTML2Canvas on load.
 */
window.addEventListener("load", async () => {
    // Fetch the resource ./html2canvas.js
    const r = await fetch("/js/html2canvas.mjs")
    const text = await r.text()
    if (eval(text) == true) {
        console.log("HTML 2 Canvas Loaded Successfully.");
    }
    console.log("Starting Post Load Bindings.")
    postLoad();
    // setInterval(renderSlides, 2000);
});

/**
 * Bind some base functionalities to the entire webpage.
 */
function postLoad() {
    let elem = document.getElementsByClassName("titleText")[0];
    elem.addEventListener("blur", () => {
        if (elem.innerText == "") {
            elem.innerText = "Unnamed Project";
        }
    });

    // Also, if 'enter' is pressed in elem, it should be blurred.
    elem.addEventListener("keypress", (e) => {
        if (e.keyCode == 13) {
            elem.blur();
        }
    });
}

/**
 * Add the Menu Code to each button so dropdowns can be created & destroyed.
 */
window.addEventListener("load", () => {
    document.getElementById("toolsButton").addEventListener("click", (e) => {
        let m = new Menu(e.target);
        m.createButton("Run Code", () => {
            window.editor.currentTool = "eval"
            document.getElementById("functions").innerHTML = `Click a Code Block to Run it!`;
        });
        m.createButton("Manipulate", () => {
            window.editor.currentTool = "manipulator"
            document.getElementById("functions").innerHTML = ``;
        });
        m.createButton("Text", () => {
            window.editor.currentTool = "text";
            document.getElementById("functions").innerHTML = `<div class="functionHolder"> <p>Font Size</p><input onblur="window.editor.utils.warnText()" type="number" id="fontSize" min="12" max="64" value="12"> </div><div class="functionHolder"> <p>Font Family</p><select id="fontFamily"> <option value="Arial">Arial</option> <option value="Courier">Courier</option> <option value="Times New Roman">Times New Roman</option> <option value="Verdana">Verdana</option> </select> </div>`
        });
        m.createButton("Image", () => {
            window.editor.currentTool = "image"
            document.getElementById("functions").innerHTML = ``;
        });
        m.createButton("Delete", () => {
            window.editor.currentTool = "delete"
            document.getElementById("functions").innerHTML = ``;
        });
        m.createButton("Draw", () => {
            window.editor.currentTool = "draw"
            document.getElementById("functions").innerHTML = `<div class="functionHolder"> <p>Brush Size</p><input type="number" id="brushSize" min="12" max="64" value="12"> </div><div class="functionHolder"> <p>Brush Color</p><input type="color" id="brushColor" value="#000000"> </div><div class="functionHolder"> <button class="clearButton" onclick="window.editor.utils.clearClassName('circleShape')">Clear</button> </div>`;
        });
        m.render();
    });
    
    document.getElementById("editButton").addEventListener("click", (e) => {
        let m = new Menu(e.target);
        m.createButton("Background", () => {
            // Prompt the user for a background image.
            const url = prompt("Enter the URL of the background image");
            window.editor.utils.setBackground(url);
        });
        m.render();
    });

    document.getElementById("fileButton").addEventListener("click", async (e) => {
        let m = new Menu(e.target);
        m.createButton("Undo", async () => {
            await window.editor.utils.undoRedo("undo");
        });

        m.createButton("Redo", async () => {
            await window.editor.utils.undoRedo("redo");
        });

        m.createButton("Save", () => {
            window.editor.utils.save();
        });

        m.createButton("Load", () => {
            window.editor.utils.load();
        });

        m.createButton("Export", () => {
            window.editor.utils.exportSlides();
        });

        m.render();
    });
});
