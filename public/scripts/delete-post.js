window.addEventListener('DOMContentLoaded', async () => {
  const deletePostOption = document.querySelector('.delete-post-option');

  if (!deletePostOption) return;

  deletePostOption.addEventListener('click', async () => {
    const deletePost = confirm('Are you sure you want to delete this post?');
    const postId = deletePostOption.getAttribute('id');
    const action = deletePostOption.getAttribute('action');

    if (deletePost) {
      await fetch(action.replace(':postId', postId), {
        method: 'DELETE',
      });

      const currentLocation = window.location.href;
      window.location = currentLocation.split('/').slice(0, -1).join('/');
    }
  });
});
