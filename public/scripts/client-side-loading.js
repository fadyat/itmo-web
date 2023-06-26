function clientSideLoadingTime() {
  const start = Date.now();

  window.addEventListener('load', () => {
    const serverLoadTime = document.querySelector('.server-load-time');
    const clientLoadTime = document.createElement('div');
    clientLoadTime.classList.add('client-load-time', 'footer-item');
    clientLoadTime.innerHTML = `Client load time: ${Date.now() - start}ms`;
    serverLoadTime.before(clientLoadTime);
  });
}

clientSideLoadingTime();
