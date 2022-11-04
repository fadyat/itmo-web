document.addEventListener('DOMContentLoaded', () => {
    const header = document.createElement("header");
    header.innerHTML = `
            <div class="left-side-header">
                <a href="#" class="organization-logo-redirect">
                    <img src="/public/logo.jpeg" alt="logo" class="organization-logo-small user-avatar">
                </a>
                <label title="search-input">
                    <input type="text" placeholder="Search..." class="header-input">
                </label>
                <nav class="header-navigation">
                    <a href="/src/pages/global/discover.html" class="navigation-item base-button">All gists</a>
                    <a href="https://genius.com/artists/Mentaldora" class="navigation-item base-button">Back to dora</a>
                </nav>
            </div>
            <div class="right-side-header">
                <details class="user-details">
                    <summary class="user-details-summary">
                        <img alt="avatar"
                             src="https://avatars.githubusercontent.com/u/70910148?v=4"
                             class="user-avatar user-avatar-header"
                        >
                    </summary>
                    <ul class="base-button user-options">
                        <li class="user-option">
                            <a href="/src/index.html" class="user-option-redirect">Your profile</a>
                        </li>
                        <li class="user-option">
                            <a href="#" class="user-option-redirect">Help</a>
                        </li>
                        <li class="user-option">
                            <a href="#" class="user-option-redirect">Settings</a>
                        </li>
                        <li class="user-option last-option">
                            <a href="#" class="user-option-redirect">Sign out</a>
                        </li>
                    </ul>
                </details>
            </div>`;
    document.body.insertAdjacentElement('afterbegin', header);
});
