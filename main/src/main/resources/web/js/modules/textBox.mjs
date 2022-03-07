export function bindDefaults(elem) {
    elem.addEventListener("keypress", (e) => {
        if (e.keyCode == 13 && !e.shiftKey) {
            elem.blur();
        }
    })

    elem.addEventListener("blur", (e) => {
        const content = elem.innerText;
        let match = content.match(/```([a-zA-Z]+)(?:\n|\<br\>)(.+)```/ms);
        if (match) {
            const language = match[1];
            const code = match[2];
            if (language != "tex" && language != "latex") {
                elem.innerHTML = `<pre><code class="language-${language}">${code}</code></pre>`;
            } else {
                let generator = new latexjs.HtmlGenerator({ hyphinate: false });
                generator = latexjs.parse(code, { generator });

                // append child to elem
                // elem.appendChild(generator.stylesAndScripts(""));
                elem.innerText = ""
                elem.appendChild(generator.domFragment());
            }
        }

        hljs.highlightAll();
    })
}