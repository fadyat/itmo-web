function getDatesDiff(date) {
    const diffTime = Math.abs(new Date() - new Date(date));
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    if (days > 0) {
        return `${days} days`;
    }

    const hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
    if (hours > 0) {
        return `${hours} hours`;
    }
    const minutes = Math.floor((diffTime / (1000 * 60)) % 60);
    if (minutes > 0) {
        return `${minutes} minutes`;
    }

    const seconds = Math.floor((diffTime / 1000) % 60);
    return `${seconds} seconds`;
}

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