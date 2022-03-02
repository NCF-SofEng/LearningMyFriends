window.Globals = {
    editingSlide: 0
}

window.addEventListener("load", async () => {
    // Fetch the resource ./html2canvas.js
    const r = await fetch("/js/html2canvas.mjs")
    const text = await r.text()
    if (eval(text) == true) {
        console.log("HTML 2 Canvas Loaded Successfully.");
    }
    console.log("Starting Post Load Bindings.")
    postLoad();
    setInterval(renderSlides, 2000);
});

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

async function renderSlides() {
    // Get all slides in an array
    const slides = [ ...document.getElementsByClassName("slide") ];
    const editingSlide = Globals.editingSlide;
    // Render the slide and set the background image of the slide to the canvas.
    const render = await html2canvas(document.getElementById("canvas"));
    slides[editingSlide].style.backgroundImage = `url(${render.toDataURL()})`;
}

// window.html2canvas(document.getElementById("canvas")).then(d => {
//     const link = document.createElement("a");
//     link.download = "dl.png";
//     link.href = d.toDataURL("image/png");
//     link.click();
// })