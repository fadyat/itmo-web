(() => {
    const start = Date.now();
    window.addEventListener('load', () => {
        const end = Date.now();
        const loadTimeElement = document.getElementById('load-time')
        const endTime = new Date(end);

        loadTimeElement.innerText = `${endTime.toLocaleTimeString()}, ${end - start}ms`;
    });
})();