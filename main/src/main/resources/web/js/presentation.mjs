export class SlideShow {
    static running = false;
    static slideshowRootDiv = null;
    static slideshowCanvas = null;

    static currentSlide = 1;

    static pointer = false;
    static awaitingResult = false;

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

        // console.log(zoom);
        // console.log(`${editorWidth * zoom}px width`);
        // console.log(`${editorHeight * zoom}px height`);
        // SlideShow.slideshowCanvas.style.width = `${editorWidth * zoom}px`;
        // SlideShow.slideshowCanvas.style.height = `${editorHeight * zoom}px`;
        SlideShow.slideshowCanvas.style.zoom = zoom;

    }

    static stop() {
        if (!window.SlideShow.running) return;

        SlideShow.running = false;
        SlideShow.slideshowRootDiv.remove();
        SlideShow.slideshowRootDiv = null;
        SlideShow.currentSlide = 1;
    }

    static async presentSlide(slideNumber) {
        try {
            // Insure the amount of slides is not out of bounds.
            const slideCount = window.editor.utils.slideDeckSlides().length;
            if (slideCount == 0) return;

            const html = await window.editor.utils.requestSlide(slideNumber);
            SlideShow.slideshowCanvas.innerHTML = html;
        } catch (e) {
            console.log(e);
            SlideShow.stop();
        }
    }
}

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

window.SlideShow = SlideShow;