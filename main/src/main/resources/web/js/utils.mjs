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

export function setBackground(url) {
    const c = document.getElementById("canvas");
    c.style.backgroundImage = `url(${url})`;
    c.style.backgroundSize = "cover";
    c.style.backgroundRepeat = "no-repeat";
    c.style.backgroundPosition = "center";
}

export function clearClassName(el) {
    for (const elem of Array.from(document.getElementsByClassName(el))) {
        elem.remove();
    }
}

export function warnText() {
    const fontSize = document.getElementById("fontSize").value;

    if (fontSize < 48) {
        alert("Warning! Font Sizes below 48 may not be visible on some projectors or large screens.")
    }
}

export function slideEdited() {
    // console.log("Printing with :: " + (window.editor.editingSlide + "|==|" + document.getElementById("canvas").innerHTML))
    // console.log("Edit Body :: " + (n.toString() ? n.toString() : window.editor.editingSlide.toString()) + "|==|" + window.editor.canvas.getInnerHTML());
    fetch(`http://localhost:8080/update?slide=${window.editor.editingSlide}`, {
        method: "POST",
        // Get the entire inner html of the editor.
        body: window.editor.canvas.getInnerHTML() ? window.editor.canvas.getInnerHTML() : " ",

    }).catch((err) => {
        console.log(err)
    })
}

export function slideDeckSlides() {
    return Array.from(document.querySelector("#slideContainer").children).filter(s => s.tagName == "DIV");
}

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

export async function runCodeBlock(elem) {
    let codeBody;
    if (elem.tagName == "CODE") {
        codeBody = elem.innerText;
    } else if (elem.tagName == "PRE") {
        codeBody = elem.children.item(0).innerText;
    } else {
        return "|NONE|";
    }

    return await fetch(`http://api.naminginprogress.com/v1/eval/python`, {
        method: "POST",
        body: codeBody,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    }).then((res) => res.text());
}

async function readFileFromSelection() {
    const f = document.createElement("input");
    f.type = "file";
    f.click();

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

export async function save() {
    try {
        await fetch(`http://localhost:8080/save`, {
            method: "POST",
        });
    } catch (_) {};
}

export async function load() {
    try {
        const contents = await readFileFromSelection();
        const slide = await fetch(`http://localhost:8080/load`, {
            method: "POST",
            body: contents,
        });
    } catch (_) {
        alert("Internal Error: Could not load file.");
    };
}
