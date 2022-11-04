function createPost(postData) {
    const postMeta = createPostMeta(postData.description, postData.author, postData.filename, postData.lastChange);
    const postContent = createPostContent(postData.content);

    const post = document.createElement('div');
    post.classList.add('post');
    post.appendChild(postMeta);
    post.appendChild(postContent);
    return post;
}

function createPostMeta(postDescription, postAuthor, postFilename, postLastChange) {
    const postMeta = document.createElement('div');
    postMeta.classList.add('post-meta');
    postMeta.innerHTML = `    
        <div class="post-changes-info">
        <span class="post-path">
            <a href="index.html" class="post-author">${postAuthor}</a>
            /
            <a href="#" class="post-name">${postFilename}</a>
        </span>
            <span class="post-last-change">Last active ${getDatesDiff(postLastChange)} ago</span>
            <span class="post-description">${postDescription}</span>
        </div>
        <ul class="post-info">
            <li class="post-info-item">0 stars</li>
            <li class="post-info-item">0 forks</li>
            <li class="post-info-item">0 comments</li>
        </ul>
        `;
    return postMeta;
}

function createPostContent(content) {
    const postTable = createPostTable(content);

    const postContent = document.createElement('div');
    postContent.classList.add('post-content');
    postContent.appendChild(postTable);
    return postContent;
}

function createPostTable(content) {
    const postTable = document.createElement('table');
    postTable.classList.add('code-table');

    const tableBody = document.createElement('tbody');
    postTable.appendChild(tableBody);

    content.split('\n').forEach((line, index) => {
        const singleLine = createTableLine(line, index);
        postTable.appendChild(singleLine);
    });

    return postTable;
}

function createTableLine(line, index) {
    const singleLine = document.createElement('tr');
    singleLine.classList.add('code-line');
    singleLine.innerHTML = `
            <td class="code-line-number">${index + 1}</td>
            <td class="code-line-content">${line.replace(/ /g, '&nbsp;')}</td>
        `;
    return singleLine;
}


const renderPostInPlace = (postData) => {
    const post = createPost(postData);
    const postsBlock = document.querySelector('.posts');
    postsBlock.appendChild(post);
}