(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const currentPath = location.pathname.split('/').pop();
        const activeLinks = document.querySelectorAll(`header a[href="${currentPath}"]`);
        activeLinks.forEach((link) => {
            link.classList.add('active');
            const parent = link.parentElement;
            if (parent.classList.contains('user-option')) {
                parent.classList.add('active');
            }
        });
    });
})()