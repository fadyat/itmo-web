const randomUserAPI = "https://randomuser.me/api/";
const randomQuoteAPI = "https://api.quotable.io/random?maxLength=50";

const fetchUsers = async (page, results) => {
    const response = await fetch(`${randomUserAPI}?page=${page}&results=${results}`);
    return await response.json();
}

const fetchQuote = async () => {
    const response = await fetch(randomQuoteAPI);
    return await response.json();
}

if (!localStorage.getItem("page")) {
    localStorage.setItem("page", "1");
}

if (!localStorage.getItem("perPage")) {
    localStorage.setItem("perPage", "5");
}


document.addEventListener("DOMContentLoaded", async () => {
    const page = localStorage.getItem("page");
    const perPage = localStorage.getItem("perPage");

    const followers = await fetchUsers(page, perPage).then(data => data.results).catch(error => console.log(error))
    const followersBlock = document.querySelector(".followers-list");
    console.log(followersBlock.style)
    for (const follower of followers) {
        const quote = await fetchQuote().then(data => data.content).catch(error => console.log(error));
        const followerBlock = await renderFollower(follower, quote);
        followersBlock.appendChild(followerBlock);
    }
});

async function renderFollower(follower, quote) {
    const followerBlock = document.createElement("div");
    followerBlock.className = "follower";
    followerBlock.innerHTML = `
            <img src="${follower.picture.large}" alt="avatar" class="user-avatar user-avatar-header follower-avatar">
            <div class="follower-info">
                <div class="follower-names">
                    <div class="follower-name">
                        ${follower.name.first} ${follower.name.last}
                    </div>
                    <div class="follower-username">
                        ${follower.login.username}
                    </div>
                </div>
                <div class="follower-profile-description">
                    ${quote}
                </div>
                <div class="follower-locations">
                    <div class="follower-location">
                        ${follower.location.city}, ${follower.location.country}
                    </div>
                </div>
            </div>`;
    return followerBlock;
}

document.addEventListener("DOMContentLoaded", () => {
    const page = localStorage.getItem("page");
    const prevPageButton = document.querySelector(".prev-page");

    prevPageButton.addEventListener("click", () => {
        localStorage.setItem("page", `${page - 1}`);
        window.location.reload();
    });

    if (page > 1) {
        prevPageButton.style.pointerEvents = "auto";
    }

    const nextPageButton = document.querySelector(".next-page");
    nextPageButton.addEventListener("click", () => {
        localStorage.setItem("page", `${+page + 1}`);
        window.location.reload();
    });

    if (page > 3) {
        nextPageButton.style.pointerEvents = "none";
    }
});