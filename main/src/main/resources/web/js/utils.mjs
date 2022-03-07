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