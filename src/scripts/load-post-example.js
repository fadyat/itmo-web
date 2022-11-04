document.addEventListener('DOMContentLoaded', () => {
    const postsClass = document.getElementsByClassName('posts');
    const post = document.createElement("div");
    post.className = "post";
    post.innerHTML = `
<div class="post-meta">
    <div class="post-changes-info">
        <span class="post-path">
            <a href="/src/index.html" class="post-author">fadyat</a>
            /
            <a href="#" class="post-name">bebra.py</a>
        </span>
        <span class="post-last-change">Last active 1 day ago</span>
        <span class="post-description">Smell some bebra code</span>
    </div>
    <ul class="post-info">
        <li class="post-info-item">0 stars</li>
        <li class="post-info-item">0 forks</li>
        <li class="post-info-item">0 comments</li>
    </ul>
</div>
<div class="post-content">
    <table class="code-table">
        <tbody>
        <tr class="code-line">
            <td class="code-line-number">1</td>
            <td class="code-line-content">import random</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">2</td>
            <td class="code-line-content"></td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">3</td>
            <td class="code-line-content">import gigachad</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">4</td>
            <td class="code-line-content"></td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">5</td>
            <td class="code-line-content"></td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">6</td>
            <td class="code-line-content">def flexing(</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">7</td>
            <td class="code-line-content tab">gigachad: gigachad.Gigachad,</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">8</td>
            <td class="code-line-content">):</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">9</td>
            <td class="code-line-content tab">flex_value = random.randint(0, 100)</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">10</td>
            <td class="code-line-content tab">while flex_value:</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">11</td>
            <td class="code-line-content tab2">flex_value -= 1</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">12</td>
            <td class="code-line-content tab2">print(f'{gigachad.name} flexing so hard')</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">13</td>
            <td class="code-line-content"></td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">14</td>
            <td class="code-line-content"></td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">15</td>
            <td class="code-line-content">if __name__ == '__main__':</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">16</td>
            <td class="code-line-content tab">gigachad_instance = gigachad.Gigachad()</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">17</td>
            <td class="code-line-content tab">flexing(gigachad_instance)</td>
        </tr>
        <tr class="code-line">
            <td class="code-line-number">18</td>
            <td class="code-line-content"></td>
        </tr>
        </tbody>
    </table>
</div>`;
    postsClass.item(0).insertAdjacentElement('beforeend', post);
});