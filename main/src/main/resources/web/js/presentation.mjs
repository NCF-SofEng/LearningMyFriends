/**
 * The base SlideShow class.
 * 
 * This was a later implementation that I decided to use a class approch for. In hindsight,
 * I should have done classes for everything, but oh well. 
 */
export class SlideShow {
    static running = false;
    static slideshowRootDiv = null;
    static slideshowCanvas = null;

    static currentSlide = 1;

    static pointer = false;
    static awaitingResult = false;

    /**
     * Starts the presentation mode, appending the grayscale element and the canvas container.
     * @returns {Promise<void>}
     */
    static start() {
        if (window.SlideShow.running) return;

        window.SlideShow.running = true;
        // Create a new div that fits over the entire viewport.
        SlideShow.slideshowRootDiv = document.createElement("div");
        SlideShow.slideshowCanvas = document.createElement("div");

        SlideShow.slideshowRootDiv.classList.add("slideshowRootDiv");
        SlideShow.slideshowCanvas.classList.add("slideshowCanvas");

        // Append slideshowRootDiv at the bottom of body.
        document.body.appendChild(SlideShow.slideshowRootDiv);
        SlideShow.slideshowRootDiv.appendChild(SlideShow.slideshowCanvas);

        SlideShow.sizeCanvas();
        this.presentSlide(SlideShow.currentSlide);
    }
    
    /**
     * Resizes the canvas to fit the viewport with as much zoom as possible to make it fill up the screen.
     */
    static sizeCanvas() {
        /*
        The editor's canvas is of the size: width: 1056px; height: 642px;
        Calculate the amount of zoom needed to fit the editor's canvas into the full screen, preserving aspect ratio. 
        */

        const width = window.innerWidth;
        const height = window.innerHeight;

        const editorWidth = 1056;
        const editorHeight = 642;

        const zoom = Math.min(width / editorWidth, height / editorHeight);

        SlideShow.slideshowCanvas.style.zoom = zoom;

    }

    /**
     * Stops the running presentation, setting all the variables to their default values.
     * @returns {void}
     */
    static stop() {
        if (!window.SlideShow.running) return;

        SlideShow.running = false;
        SlideShow.slideshowRootDiv.remove();
        SlideShow.slideshowRootDiv = null;
        SlideShow.currentSlide = 1;
    }

    /**
     * Presents a given slide at an index.
     * @param {number} slideNumber The slide to render
     * @returns {Promise<void>}
     */
    static async presentSlide(slideNumber) {
        try {
            // Insure the amount of slides is not out of bounds.
            const slideCount = window.editor.utils.slideDeckSlides().length;
            if (slideCount == 0) return;

            const html = await window.editor.utils.requestSlide(slideNumber);
            SlideShow.slideshowCanvas.innerHTML = html + SlideShow.setSlideNumber();
        } catch (e) {
            console.log(e);
            SlideShow.stop();
        }
    }

    /**
     * Just returns the html to create a slide number during the presentation.
     * @returns {string} The HTML for the number
     */
    static setSlideNumber() {
        return `<h1 class="presentationNumber">${SlideShow.currentSlide}</h1>`
    }
}

/**
 * This one's just hadling keyboard input for the running SlideShow instance.
 */
window.addEventListener("keydown", (ev) => {
    if (!SlideShow.running) return;
    const slideCount = window.editor.utils.slideDeckSlides().length;
    console.log(ev.key)
    switch (ev.key) {
        case "Escape":
            SlideShow.stop();
        break;
        case "ArrowLeft": 
        case "Left":
            // Make sure paging left wouldn't go out of bounds.
            if ((SlideShow.currentSlide - 1) >= 1 && SlideShow.currentSlide > 1) {
                SlideShow.currentSlide--;
                SlideShow.presentSlide(SlideShow.currentSlide);
            }
        break;
        case "ArrowRight":
            // If currentSlide + 1 wont go out of bounds, then present the next slide.
            if ((SlideShow.currentSlide + 1) <= slideCount) {
                SlideShow.currentSlide++;
                SlideShow.presentSlide(SlideShow.currentSlide);
            }
        break;
        case "p":
            if (SlideShow.pointer == false) {
                // Set the pointer in canvas to crosshair
                SlideShow.slideshowCanvas.style.cursor = "crosshair";
                SlideShow.pointer = true;
            } else {
                // Set the pointer in canvas to default
                SlideShow.slideshowCanvas.style.cursor = "default";
                SlideShow.pointer = false;
            }
        break;
    }
})

window.addEventListener("click", async (ev) => {
    if (SlideShow.running == true && (ev.target.tagName == "CODE" || ev.target.tagName == "PRE")) {
        const r = await window.editor.utils.runCodeBlock(ev.target);
        if (r == "|NONE|") {
            return;
        } else {
            alert("Evaluated Response:\n" + r);
        }
    }
})

window.SlideShow = SlideShow;