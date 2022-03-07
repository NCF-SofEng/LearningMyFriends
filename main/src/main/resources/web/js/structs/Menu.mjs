export class Menu {
    constructor(source) {
        if (window.openMenu) {
            window.openMenu.dispose();
        }

        window.openMenu = this;

        // Source is an HTMLElement
        // Find it's Width and Height.
        this.source = source;
        this.sourceWidth = source.offsetWidth;
        this.sourceHeight = source.offsetHeight;
        this.sourceBound = source.getBoundingClientRect();

        this.menu = document.createElement("div");
        this.menu.classList.add("menu");


        // Make it appear directly under the source element.
        this.menu.style.position = "absolute";
        this.menu.style.left = `${this.sourceBound.left}px`;

        this.menu.style.top = `${this.sourceBound.top + this.source.offsetHeight}px`;
        this.menu.style.width = `${source.offsetWidth}px`;
        this.menu.style.width = `fit-content`;
    }

    createButton(text, callback) {
        const button = document.createElement("p");
        button.innerText = text;
        button.addEventListener("click", () => {
            callback();
            this.dispose();
        });
        this.menu.appendChild(button);
    }

    dispose() {
        this.menu.remove();
        window.openMenu = null;
    }

    render() {
        document.body.appendChild(this.menu);
    }
}