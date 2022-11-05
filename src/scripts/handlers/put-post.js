document.addEventListener('DOMContentLoaded', () => {
    const storedPosts = JSON.parse(localStorage.getItem('posts'));

    if (!storedPosts) {
        return;
    }

    const postsBlock = document.querySelector('.posts');
    storedPosts.forEach((post) => {
        const postBlock = createPost(post);
        postsBlock.appendChild(postBlock);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("new-post-form");

    if (!form) {
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const postData = {
            'author': 'fadyat'
        };

        let isValid = true;
        for (let i = 0; i < form.elements.length; i++) {
            const item = form.elements.item(i);
            if (!item.name) continue;
            !item.value && item.classList.add('error');
            isValid &&= item.value;
            postData[item.name] = item.value
        }

        if (!isValid) {
            return false;
        }

        postData['lastChange'] = new Date().toUTCString();
        addPost(postData);
        form.reset();
        renderPostInPlace(postData);
    });

    form.addEventListener('input', (e) => {
        const target = e.target;
        const value = target.value;

        if (!value) {
            target.classList.add('error');
            return;
        }

        target.classList.remove('error');
    });
});
