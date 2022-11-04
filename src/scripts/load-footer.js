document.addEventListener('DOMContentLoaded', () => {
    const footer = document.createElement("footer");
    footer.innerHTML = `
    <div class="left-side-footer">
        <a href="#" class="organization-logo-redirect">
            <!-- src will be correct, when will be imported -->
            <img src="public/logo.jpeg" class="organization-logo-small user-avatar" alt="logo">
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