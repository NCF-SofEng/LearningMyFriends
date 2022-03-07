window.addEventListener("click", (ev) => {
    const target = ev.target;
    const parent = target.parentElement;
    if (target.className == "hide") {
        const slideNumberElement = parent.querySelector(".slideNumber");
        if (slideNumberElement.innerText == "Hidden") {
            console.log(1)
            const slideDeck = document.getElementById("slideContainer");
            // Get the current position of this slide in the slide deck.
            const slidePosition = Array.from(slideDeck.children).indexOf(parent);
            slideNumberElement.innerText = slidePosition;
        } else {
            slideNumberElement.innerText = "Hidden";
        }
    }
});

window.addEventListener("click", (ev) => {
    const target = ev.target;
    if (target.id == "plus") {
        // Create a new slide.
        const slideHtml = `
            <div class="slide">
                <h1 class="slideNumber">${document.getElementsByClassName("slide").length + 1}</h1>
                <img src="./assets/eye.png" class="hide">
            </div>`

        const slideDeck = document.getElementById("slideContainer");
        slideDeck.insertAdjacentHTML("beforeend", slideHtml);
    }
});