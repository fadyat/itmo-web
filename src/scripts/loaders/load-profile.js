document.addEventListener('DOMContentLoaded', () => {
    const userProfile = document.querySelector('.user-profile');
    userProfile.innerHTML = `
    <img alt="avatar"
             src="https://avatars.githubusercontent.com/u/70910148?v=4"
             class="user-avatar-body user-avatar"
        >
            <div class="user-editable-content">
                <h1 class="user-actual-name">Artyom Fadeyev</h1>
                <h3 class="user-name">fadyat</h3>
                <div class="user-about">Я аниме девочка</div>
                <nav class="header-navigation">
                    <a href="#"
                       class="navigation-item base-button edit-profile-button">
                        Edit profile
                    </a>
                </nav>
                <div class="user-follows">
                    <!-- href will be correct, when will be imported -->
                    <a href="followers.html" class="follows-redirect">
                        <span class="follows-number">14</span> followers
                    </a>
                    <a href="#" class="follows-redirect">
                        <span class="follows-number">1</span> following
                    </a>
                </div>
                <ul class="user-work-status">
                    <li class="user-organization-name with-icon">
                        <!-- src will be correct, when will be imported -->
                        <img src="src/images/org.png" alt="location" class="in-profile-icon">
                            GitHub, Copilot-developer
                    </li>
                    <li class="user-location with-icon">
                        <!-- src will be correct, when will be imported -->
                        <img src="src/images/location.png" alt="location" class="in-profile-icon">
                            Near you
                    </li>
                </ul>
                <div class="user-contacts">
                    <div class="user-contact with-icon">
                        <!-- src will be correct, when will be imported -->
                        <img src="src/images/tg.svg" alt="tg-icon" class="in-profile-icon">
                            <a href="https://t.me/not_fadyat"
                               class="user-option-redirect"
                               style="padding: 0">
                                @not_fadyat
                            </a>
                    </div>
                </div>
            </div>`;
})