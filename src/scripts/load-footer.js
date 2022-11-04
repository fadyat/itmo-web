document.addEventListener('DOMContentLoaded', () => {
    const footer = document.createElement("footer");
    footer.innerHTML = `
    <div class="left-side-footer">
        <a href="/src/pages/global/new.html" class="organization-logo-redirect">
            <img src="/public/logo.jpeg" class="organization-logo-small user-avatar" alt="logo">
        </a>
        <span class="organization-name-footer">2022 BebraCorp</span>
    </div>
    <div class="right-side-footer">
        <div class="load-time-footer" id="load-time">  
        </div>
    </div>
`;
    document.body.insertAdjacentElement('beforeend', footer);
});