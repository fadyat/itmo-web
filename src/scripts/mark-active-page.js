(() => {
    document.addEventListener('DOMContentLoaded', () => {
        const currentPath = location.pathname.split('/').pop();
        const activeLinks = document.querySelectorAll(`header a[href="${currentPath}"]`);
        activeLinks.forEach((link) => {
            if (!link.classList.contains('organization-logo-redirect')) {
                link.classList.add('active');
            }
            if (link.parentElement.classList.contains('user-option')) {
                link.parentElement.classList.add('active');
            }
        });
    });
})()