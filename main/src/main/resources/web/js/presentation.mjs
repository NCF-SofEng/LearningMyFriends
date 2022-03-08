export class SlideShow {
    static running = false;
    static slideshowRootDiv = null;
    static currentSlide = 0;

    static start() {
        if (window.SlideShow.running) return;

        // Create a new div that fits over the entire viewport.
        SlideShow.slideshowRootDiv = document.createElement("div");
        SlideShow.slideshowRootDiv.classList.add("slideshowRootDiv");

        // Append it to the dom, and set it to fullscreen.
        document.body.appendChild(SlideShow.slideshowRootDiv);
    }

    static stop() {
        if (!window.SlideShow.running) return;

        SlideShow.running = false;
        SlideShow.slideshowRootDiv.remove();
        SlideShow.slideshowRootDiv = null;
        SlideShow.currentSlide = 0;
    }
}

window.addEventListener("keypress", (ev) => {
    switch (ev.key) {
        case "Escape":
            SlideShow.stop();
        break;
        case "Left": 
            SlideShow.pageLeft();
        break;
        case "Right":
            SlideShow.pageRight();
        break;
    }
})

window.SlideShow = SlideShow;