(() => {
  const aliases = {
    '/home': '/',
    '/writing': '/writings',
    '/audit-portfolio': '/audits',
    '/bug-bounties': '/bounties',
    '/tools-open-source': '/tools',
  };
  const dock = document.querySelector('.site-dock');
  const links = Array.from(dock.querySelectorAll('.dock-link'));
  const homeLink = links[0];
  const header = document.querySelector('.page-header');
  const main = document.querySelector('main');
  const pageContent = document.querySelector('.page-content');
  const sections = Array.from(pageContent.querySelectorAll('.content-section'));
  const scrollFade = document.querySelector('.scroll-fade');
  let activeSection;

  function updateScrollFade() {
    if (!activeSection || main.scrollHeight - main.clientHeight - main.scrollTop <= 2) {
      scrollFade.hidden = true;
      return;
    }
    const scrollBottom = main.getBoundingClientRect().bottom;
    const visibleBottom = Math.min(scrollBottom, dock.getBoundingClientRect().top - 6);
    const textNodes = document.createTreeWalker(activeSection, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let contentBottom = 0;
    while (textNodes.nextNode()) {
      if (!textNodes.currentNode.textContent.trim()) continue;
      range.selectNodeContents(textNodes.currentNode);
      for (const rect of range.getClientRects()) {
        if (rect.height) contentBottom = Math.max(contentBottom, rect.bottom);
      }
    }
    for (const element of activeSection.querySelectorAll('img, svg, video, canvas')) {
      const rect = element.getBoundingClientRect();
      if (rect.height) contentBottom = Math.max(contentBottom, rect.bottom);
    }
    scrollFade.hidden = contentBottom <= visibleBottom + 2;
    if (!scrollFade.hidden) {
      const rect = pageContent.getBoundingClientRect();
      const height = Math.min(52, main.clientHeight);
      scrollFade.style.left = `${rect.left}px`;
      scrollFade.style.width = `${rect.width}px`;
      scrollFade.style.top = `${visibleBottom - height}px`;
      scrollFade.style.height = `${height + scrollBottom - visibleBottom}px`;
    }
  }

  function renderPage(moveFocus = false) {
    const route = location.hash.slice(1).replace(/^\/?/, '/');
    const canonical = aliases[route] || route;
    const current = links.find(link => link.hash === `#${canonical}`) || homeLink;
    activeSection = sections.find(section => section.dataset.section === current.dataset.dockSection);

    document.body.classList.toggle('is-page', Boolean(activeSection));
    header.hidden = !activeSection;
    pageContent.hidden = !activeSection;
    for (const section of sections) section.hidden = section !== activeSection;
    for (const link of links) {
      if (link === current) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    }
    document.title = activeSection ? `${current.getAttribute('aria-label')} — nisedo` : 'nisedo';
    main.scrollTop = 0;
    if (moveFocus) (activeSection || homeLink).focus({ preventScroll: true });
    updateScrollFade();
  }

  main.addEventListener('scroll', updateScrollFade, { passive: true });
  const observer = new ResizeObserver(updateScrollFade);
  observer.observe(main);
  observer.observe(pageContent);
  observer.observe(dock);
  window.addEventListener('hashchange', () => renderPage(true));
  renderPage();
})();
