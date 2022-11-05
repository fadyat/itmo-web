const fileExtensions = {
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


document.addEventListener('DOMContentLoaded', () => {
    hljs.highlightAll();

    console.log(hljs.listLanguages());
    document.querySelectorAll('.post').forEach((post) => {
        const postName = post.querySelector('.post-name');
        const postExtension = postName.innerText.split('.').pop()
        let postLanguage = fileExtensions[postExtension];
        if (!postLanguage) {
            postLanguage = 'plaintext';
        }
        const table = post.querySelector('.code-table');
        table.querySelectorAll('.code-line-content').forEach((line) => {
            line.innerHTML = line.innerHTML.replace(/ /g, '&nbsp;');
            line.classList.add(postLanguage);
            hljs.highlightElement(line);
        });
    });
});