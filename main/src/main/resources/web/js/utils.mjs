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