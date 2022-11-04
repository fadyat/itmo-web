(() => {
    const start = Date.now();
    window.addEventListener('load', () => {
        const end = Date.now();
        const loadTimeElement = document.getElementById('load-time')
        loadTimeElement.innerText = `Page loaded in ${end - start}ms`;
    });
})();