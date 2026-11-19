(() => {
  const aliases = {
    '/home': '/',
    '/writing': '/writings',
    '/audit-portfolio': '/audits',
    '/bug-bounties': '/bounties',
    '/tools-open-source': '/tools',
    '/talks/podcasts-webinars': '/podcasts',
    '/writings/featured-in': '/features',
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
  let activeTrigger;
  let activeTooltip;
  let dismissTimer;

  function hideTooltip() {
    clearTimeout(dismissTimer);
    if (activeTooltip) activeTooltip.hidden = true;
    activeTrigger = undefined;
    activeTooltip = undefined;
  }

  function showTooltip(trigger, tooltip) {
    hideTooltip();
    activeTrigger = trigger;
    activeTooltip = tooltip;
    tooltip.hidden = false;
    positionTooltip();
  }

  function positionTooltip() {
    const rect = activeTrigger.getBoundingClientRect();
    const gutter = 12;
    const gap = 8;
    const width = activeTooltip.offsetWidth;
    const height = activeTooltip.offsetHeight;
    const left = rect.left + (rect.width - width) / 2;
    const top = rect.top - gap - height;
    const bottomLimit = dock.getBoundingClientRect().top - gutter;
    activeTooltip.style.left = `${Math.max(gutter, Math.min(left, document.documentElement.clientWidth - width - gutter))}px`;
    activeTooltip.style.top = `${top >= gutter ? top : Math.max(gutter, Math.min(rect.bottom + gap, bottomLimit - height))}px`;
  }

  for (const [index, trigger] of [...main.querySelectorAll('[data-context]')].entries()) {
    const tooltip = document.createElement('div');
    tooltip.id = `context-tooltip-${index + 1}`;
    tooltip.className = 'tooltip context-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.textContent = trigger.dataset.context;
    tooltip.hidden = true;
    document.body.append(tooltip);
    trigger.setAttribute('aria-describedby', tooltip.id);
    if (!trigger.matches('a[href]')) trigger.tabIndex = 0;

    function scheduleDismiss() {
      if (activeTooltip !== tooltip) return;
      clearTimeout(dismissTimer);
      dismissTimer = setTimeout(() => {
        if (!trigger.matches(':hover, :focus-visible') && !tooltip.matches(':hover')) hideTooltip();
      }, 160);
    }

    trigger.addEventListener('pointerenter', event => {
      if (event.pointerType === 'mouse' || (event.pointerType === 'pen' && !event.buttons)) {
        showTooltip(trigger, tooltip);
      }
    });
    trigger.addEventListener('pointerleave', scheduleDismiss);
    trigger.addEventListener('focus', () => {
      if (trigger.matches(':focus-visible')) showTooltip(trigger, tooltip);
    });
    trigger.addEventListener('blur', scheduleDismiss);
    tooltip.addEventListener('pointerenter', () => clearTimeout(dismissTimer));
    tooltip.addEventListener('pointerleave', scheduleDismiss);
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') hideTooltip();
  });
  window.addEventListener('resize', hideTooltip);

  dock.addEventListener('click', event => {
    const link = event.target.closest('.dock-link');
    if (link && link.hash === location.hash && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      renderPage(true);
    }
  });

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
    hideTooltip();
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

  main.addEventListener('scroll', () => {
    if (activeTrigger?.matches(':focus-visible')) {
      const rect = activeTrigger.getBoundingClientRect();
      if (rect.bottom > main.getBoundingClientRect().top && rect.top < dock.getBoundingClientRect().top) {
        positionTooltip();
      } else {
        hideTooltip();
      }
    } else {
      hideTooltip();
    }
    updateScrollFade();
  }, { passive: true });
  const observer = new ResizeObserver(updateScrollFade);
  observer.observe(main);
  observer.observe(pageContent);
  observer.observe(dock);
  window.addEventListener('hashchange', () => renderPage(true));
  renderPage();
})();
