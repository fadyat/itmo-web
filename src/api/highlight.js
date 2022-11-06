const fileExtensions = (() => {
    const values = {
        'js': 'javascript', 'ts': 'typescript',
        'html': 'html', 'css': 'css',
        'py': 'python', 'rb': 'ruby',
        'go': 'go', 'java': 'java',
        'c': 'c', 'cpp': 'cpp',
        'cs': 'csharp', 'sh': 'bash',
        'json': 'json', 'md': 'markdown',
        'txt': 'plaintext', 'yml': 'yaml',
        'kt': 'kotlin', 'rs': 'rust',
        'php': 'php', 'swift': 'swift',
        'dart': 'dart', 'scala': 'scala',
    }

    for (const [key, value] of Object.entries(values)) {
        values[key] = `language-${value}`;
    }

    return values;
})();


/*
    * This file is used to highlight code in the post.
    * It uses the https://github.com/highlightjs/highlight.js library.
    *
    * Allows you to highlight code in the post.
    * Supports the following languages like: python, go, js, java etc.
    *
    * Before using this file, you need to add the following code to the <head> tag:
    *
    * VSCode theme for highlighting your code:
    * - <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.3.1/styles/vs2015.min.css">
    *
    * Highlight.js library itself:
    * - <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/highlight.min.js"></script>
    *
    * "hljs.highlightElement()" function - it highlights passed element.
    * Language may be detected automatically, but you can also pass it to the element classes with the language name.
 */

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.post').forEach((post) => {
        const postName = post.querySelector('.post-name');
        const postExtension = postName.innerText.split('.').pop()
        let postLanguage = fileExtensions[postExtension];
        if (!postLanguage) {
            postLanguage = 'language-plaintext';
        }
        const table = post.querySelector('.code-table');
        table.querySelectorAll('.code-line-content').forEach((line) => {
            line.innerHTML = line.innerHTML.replace(/ /g, '&nbsp;');
            line.classList.add(postLanguage);
            hljs.highlightElement(line);
        });
    });
});

const syncScroll = (element, textarea) => {
    element.scrollTop = textarea.scrollTop;
    element.scrollLeft = textarea.scrollLeft;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("new-post-form");
    if (!form) {
        return;
    }

    form.addEventListener('input', (e) => {
        const target = e.target;
        let value = target.value;

        let code = document.querySelector("#highlighting-content");
        if (target.tagName === 'TEXTAREA') {
            if (value[value.length - 1] === '\n') {
                value += ' ';
            }

            code.innerHTML = value.replace(new RegExp("&", "g"), "&").replace(new RegExp("<", "g"), "<");
        }

        const postName = form.querySelector('#post-filename');
        const postExtension = postName.value.split('.').pop()
        let postLanguage = fileExtensions[postExtension];
        if (!postLanguage) {
            postLanguage = 'language-plaintext';
        }

        code.classList.forEach((className) => {
            if (className.startsWith('language-')) {
                code.classList.remove(className);
            }
        });

        code.classList.add(postLanguage);
        hljs.highlightElement(code);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.querySelector('textarea')
    if (!textarea) {
        return;
    }

    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            let value = textarea.value;
            let before_tab = value.slice(0, textarea.selectionStart);
            let after_tab = value.slice(textarea.selectionEnd, textarea.value.length);
            let cursor_pos = textarea.selectionEnd + 1;
            textarea.value = before_tab + '\t' + after_tab;
            textarea.selectionStart = cursor_pos;
            textarea.selectionEnd = cursor_pos;

            const code = document.querySelector("#highlighting-content");
            code.innerHTML = textarea.value.replace(new RegExp("&", "g"), "&").replace(new RegExp("<", "g"), "<");

            hljs.highlightElement(code);
        }
    })

    textarea.addEventListener('scroll', (e) => {
        const target = e.target;
        let code = target.parentElement.querySelector('#highlighting-content');
        syncScroll(code, target);
    });
});
