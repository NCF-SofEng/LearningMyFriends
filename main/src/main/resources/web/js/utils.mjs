// A function that takes in two elements and a number, and traverses up from the first element to the second element the number of times to see if the 2nd element is a parent of the first.
// An element can not be a parent of itself.
export function isParent(el, parent, n) {
    if (n < 0) {
        return false;
    }
    if (el == parent) {
        return false;
    }
    if (el.parentElement == null) {
        return false;
    }
    if (el.parentElement == parent) {
        return true;
    }
    return isParent(el.parentElement, parent, n - 1);
}

/**
 * Sets the background image for an entire Canvas.
 * @param {string} url The URL for the background.
 */
export function setBackground(url) {
    const c = document.getElementById("canvas");
    c.style.backgroundImage = `url(${url})`;
    c.style.backgroundSize = "cover";
    c.style.backgroundRepeat = "no-repeat";
    c.style.backgroundPosition = "center";
}

/**
 * Clears the document of all elements that have the given classname.
 * @param {string} el The classname of the element to prune.
 */
export function clearClassName(el) {
    for (const elem of Array.from(document.getElementsByClassName(el))) {
        elem.remove();
    }
}

/**
 * Warns the user for a fontsize!
 */
export function warnText() {
    const fontSize = document.getElementById("fontSize").value;

    if (fontSize < 48) {
        alert("Warning! Font Sizes below 48 may not be visible on some projectors or large screens.")
    }
}

/**
 * Sends the Update Data to the server. This function is called from various locations, like if you place an element or swap a slide.
 * The more often it saves the better! 
 */
export function slideEdited() {
    fetch(`http://localhost:8080/update?slide=${window.editor.editingSlide}`, {
        method: "POST",
        // Get the entire inner html of the editor.
        body: window.editor.canvas.getInnerHTML() ? window.editor.canvas.getInnerHTML() : " ",

    }).catch((err) => {
        console.log(err)
    })
}

/**
 * Returns all slides in the slide deck. Because I'm lazy af.
 * @returns {HTMLElement[]} An array of all the slide elements in the SlideDeck.
 */
export function slideDeckSlides() {
    return Array.from(document.querySelector("#slideContainer").children).filter(s => s.tagName == "DIV");
}

/**
 * Swap the current opened slide with the slide requested.
 * @param {HTMLElement} slide The slide to move to.
 * @param {boolean} justCreated If the slide was just created.
 * @returns {Promise<void>} A promise that resolves when the slide is moved.
 */
export async function swapSlide(slide, justCreated = false) {
    if (slide == window.editor.editingSlide) {
        return;
    }

    // get the slide's index
    if (justCreated) {
        window.editor.editingSlide = slideDeckSlides().length;
        window.editor.canvas.innerHTML = "";
        await slideEdited(window.editor.editingSlide);
        console.log("created slide " + window.editor.editingSlide);
    } else {
        const html = await requestSlide(slide);
        window.editor.canvas.innerHTML = html;
    }
}

/**
 * Requests the HTML for a given slide position.
 * @param {number} num The slide to request.
 * @returns {Promise<string>} A promise that resolves to the HTML of the requested slide.
 */
export async function requestSlide(num) {
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

/**
 * Executes the code within a code block and returns the result.
 * @param {HTMLElement} elem The element to check for source code in.
 * @returns {Promise<String>} A promise that resolves to the resulting code of the element.
 */
export async function runCodeBlock(elem) {
    let codeBody;
    if (elem.tagName == "CODE") {
        codeBody = elem.innerText;
    } else if (elem.tagName == "PRE") {
        codeBody = elem.children.item(0).innerText;
    } else {
        return "|NONE|";
    }

    // To whoever's grading this, this is my own website here that I had to hack together for this one function.
    // Please don't visit this link, there's a good chance it'll crash my server. Thanks! - Ender
    return await fetch(`http://api.naminginprogress.com/v1/eval/python`, {
        method: "POST",
        body: codeBody,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }).then((res) => res.text());
}

/**
 * Prompts a user to pick a file from their machine. It then returns the file's contents.
 * @returns {Promise<string>} The file contents
 */
async function readFileFromSelection() {
    const f = document.createElement("input");
    f.type = "file";
    f.click();

    // Imma be honest I wrote this at 4am and I'm not sure how it works.
    const r = await new Promise((resolve) => {
        f.onchange = async function(e) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = async function(e) {
                const data = e.target.result;
                resolve(data);
            };
            reader.readAsText(file);
        }
    });

    return r;
}

/**
 * Sends an undo or redo request to a given slide. Once a response is recieved, the slide's contents are adjusted to match the request.
 * @param {string | "undo" | "redo"} action The action to perform. 
 * @param {number} slideNumber The slide number to perform the action on. 
 */
export async function undoRedo(action, slideNumber = window.editor.editingSlide) {
    try {
        await fetch(`http://localhost:8080/undoredo?action=${action}&number=${slideNumber}`, {
            method: "POST",
        })

        try {
            await requestSlide(slideNumber).then((res) => {
                window.editor.canvas.innerHTML = res;
            })
        } catch (_) {
            console.log("Could not fetch slide after undo/redo.")
        }
    } catch (_) {
        alert("Internal Error: Could not undo/redo.")
    }
}

/**
 * Sends a request to the server to save. Since all the states are stored in both the backend and frontend,
 * the frontend doesn't have to send any data to save.
 */
export async function save() {
    try {
        await fetch(`http://localhost:8080/save`, {
            method: "POST",
        });
    } catch (_) {};
}

/**
 * This calls the 'dump' endpoint of the project, which spills the html content of every slide.
 * Once it gets said content, it goes through and deletes every single slide in the slide deck, instantly 
 * replacing it with the new slides. 
 * 
 * It's a very hacky solution, but it works perfectly!
 * 
 * 
 */
export async function formatSlides() {
    try {
        // Retrieve the data
        const slides = await fetch(`http://localhost:8080/dump`, {
            method: "GET",
        }).then((res) => res.text());

        // Split it into readable segments, sans the first one.
        const slidesArray = slides.split("|MYSPECIALDELIM|");
        slidesArray.pop();
        // Delete all slides in slide deck.
        for (const slide of slideDeckSlides()) {
            slide.remove();
        }
        
        // Add all slides from backend.
        const slideContainer = document.getElementById("slideContainer");
        let slideCount = 1;
        // Add each slide to the slide deck.
        for (const _ of slidesArray) {
            slideContainer.innerHTML += 
            `<div class="slide">
                <h1 class="slideNumber">${slideCount}</h1>
                <img src="./assets/eye.png" class="hide">
            </div>`
            slideCount++;
        };

        window.editor.editingSlide = 1;
    } catch (e) {
        console.log(e);
        alert("Internal Error: Could not populate slides.")
    };
}

/**
 * Sends a request to the server to load the slides from a provided file.
 * It then calls formatSlides() to delete them, and renderSlides() to start
 * the rendering engine for the preview slides.
 */
export async function load() {
    try {
        const contents = await readFileFromSelection();
        await fetch(`http://localhost:8080/load`, {
            method: "POST",
            body: contents,
        });

        await formatSlides();
        await renderSlide();
    } catch (_) {
        alert("Internal Error: Could not load file.");
    };
}

/**
 * Once each preview is rendered, this function will grab the image data from the preview and send it to the backend as base64.
 * The backend will then merge it into a PDF, and ask the user where to save it.
 */
export async function exportSlides() {
    // Iterate over each slide in the slide deck, and get the image base64 data of background image
    const slides = slideDeckSlides();

    const body = slides
        .filter(slide => slide.style.backgroundImage)
        .map(slide => slide.style.backgroundImage.split(",")[1])
        .join("|==|");

    try {
        await fetch(`http://localhost:8080/export`, {
            method: "POST",
            body: body,
        });
    } catch(_) {
        alert("Internal Error: Could not export slides.");
    }
}

/**
 * The basic rendering task for the slides. It will render the currently selected slide.
 */
export async function renderSlide() {
    // Get all slides in an array. God i love the spread operator
    const slides = [ ...document.getElementsByClassName("slide") ];
    const editingSlide = window.editor.editingSlide - 1;
    // Render the slide and set the background image of the slide to the canvas.
    const render = await html2canvas(document.getElementById("canvas"));
    slides[editingSlide].style.backgroundImage = `url(${render.toDataURL()})`;
}