const randomUserAPI = "https://randomuser.me/api/";
const randomQuoteAPI = "https://api.quotable.io/random?maxLength=50";

class Follower {
    constructor(avatar, name, username, quote, city, country) {
        this.avatar = avatar;
        this.name = name;
        this.username = username;
        this.quote = quote;
        this.city = city;
        this.country = country;
    }
}


const fetchUsers = async (page, results) => {
    const response = await fetch(`${randomUserAPI}?page=${page}&results=${results}`);
    return await response.json();
}

const fetchQuote = async () => {
    const response = await fetch(randomQuoteAPI);
    return await response.json();
}

const createLoader = (followersBlock) => {
    const loader = document.createElement("div");
    loader.innerHTML = `<img src="https://media.tenor.com/89Xopy8Fm7gAAAAi/pepe-clap.gif" alt="loader">`;
    followersBlock.innerHTML = "";
    followersBlock.appendChild(loader);
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
    await renderFollowers(page, perPage);
});

const renderFollowers = async (page, perPage) => {
    const followersBlock = document.querySelector(".followers-list");
    createLoader(followersBlock)

    await new Promise(resolve => setTimeout(resolve, 1000));
    let isServerError = false;
    const followers = await Promise.all(
        await fetchUsers(page, perPage)
            .then(resp => resp.results)
            .catch(_ => {
                isServerError = true
                return [];
            })
            .then(data => data.map(async (item) => {
                const quote = await fetchQuote()
                    .then(data => data.content)
                    .catch(_ => "");

                return new Follower(
                    item.picture.large,
                    item.name.first,
                    item.login.username,
                    quote,
                    item.location.city,
                    item.location.country
                );
            }))
            .catch((e) => console.log(e))
    );

    if (isServerError) {
        followersBlock.innerHTML = `
        <div class="fetch-error">
            <h2 class="fetch-error-message">Server error</h2>
            <img src="https://media.tenor.com/ongULa4VHQcAAAAi/crying-pepe-the-frog.gif" alt="server-error">
        </div>`;
        return;
    }

    followersBlock.innerHTML = "";
    followersBlock.append(...followers.map(follower => renderFollower(follower)));
}

const renderFollower = (follower) => {
    const followerBlock = document.createElement("div");
    followerBlock.className = "follower";
    followerBlock.innerHTML = `
            <img src="${follower.avatar}"
                 alt="avatar"
                 class="user-avatar user-avatar-header follower-avatar"
            >
            <div class="follower-info">
                <div class="follower-names">
                    <div class="follower-name">${follower.name}</div>
                    <div class="follower-username">${follower.username}</div>
                </div>
                <div class="follower-profile-description">${follower.quote}</div>
                <div class="follower-locations">
                    <div class="follower-location">${follower.city}, ${follower.country}</div>
                </div>
            </div>`;
    return followerBlock;
}

document.addEventListener("DOMContentLoaded", async () => {
    const page = parseInt(localStorage.getItem("page"));
    const prevPageButton = document.querySelector(".prev-page");
    const nextPageButton = document.querySelector(".next-page");

    if (page <= 1) {
        prevPageButton.classList.add("disabled-button");
    }
    if (page >= 3) {
        nextPageButton.classList.add("disabled-button");
    }
    prevPageButton.addEventListener("click", async () => {
        localStorage.setItem("page", `${page - 1}`);
        window.location.reload();
    });

    nextPageButton.addEventListener("click", async () => {
        localStorage.setItem("page", `${page + 1}`);
        window.location.reload();
    });
});