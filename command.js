(() => {
  const pages = [
    { command: '/about', section: 'about', label: 'About me' },
    { command: '/audits', section: 'audit-portfolio', label: 'Audit portfolio' },
    { command: '/bounties', section: 'bug-bounties', label: 'Bug bounties' },
    { command: '/talks', section: 'talks', label: 'Talks & podcasts' },
    { command: '/writings', section: 'writing', label: 'Articles & writing' },
    { command: '/tools', section: 'tools-open-source', label: 'Tools & open source' },
    { command: '/community', section: 'community', label: 'Community' },
    { command: '/highlights', section: 'highlights', label: 'Highlights' },
    { command: '/home', section: null, label: 'Back to the start' },
  ];
  const aliases = { '/writing': '/writings', '/audit-portfolio': '/audits', '/bug-bounties': '/bounties', '/tools-open-source': '/tools', '/': '/home' };
  const input = document.querySelector('#command');
  const caret = document.querySelector('.block-caret');
  const menu = document.querySelector('#commands');
  const error = document.querySelector('.command-error');
  const main = document.querySelector('main');
  const scrollHint = document.querySelector('.scroll-hint');
  let matches = [];
  let selected = 0;
  let currentCommand = '/home';

  function updateScrollHint() {
    const section = document.querySelector('.content-section:not([hidden])');
    if (!document.body.classList.contains('is-page') || !section) {
      scrollHint.hidden = true;
      return;
    }
    const viewportBottom = main.getBoundingClientRect().top + main.clientHeight;
    const textNodes = document.createTreeWalker(section, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let contentBottom = 0;
    while (textNodes.nextNode()) {
      if (!textNodes.currentNode.textContent.trim()) continue;
      range.selectNodeContents(textNodes.currentNode);
      for (const rect of range.getClientRects()) {
        if (rect.height) contentBottom = Math.max(contentBottom, rect.bottom);
      }
    }
    section.querySelectorAll('img, svg, video, canvas').forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.height) contentBottom = Math.max(contentBottom, rect.bottom);
    });
    scrollHint.hidden = contentBottom <= viewportBottom + 2;
  }

  function updateCaret() {
    const position = input.value ? input.selectionStart : 0;
    caret.style.left = `calc(${position}ch - ${input.scrollLeft}px)`;
    caret.textContent = (input.value || input.placeholder)[position] || '\u00a0';
    caret.hidden = input.selectionStart !== input.selectionEnd ||
      (Boolean(input.value) && document.activeElement !== input);
  }

  function closeMenu() {
    menu.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    updateCaret();
  }

  function openPage(command) {
    const normalized = command.trim().toLowerCase();
    const canonical = aliases[normalized] || normalized;
    const page = pages.find(page => page.command === canonical);
    if (!page) {
      closeMenu();
      error.textContent = `Unknown command: ${command}. Type / to see the commands.`;
      error.hidden = false;
      return;
    }
    if (page.command === currentCommand) {
      input.value = '';
      error.hidden = true;
      closeMenu();
      return;
    }
    location.hash = page.section ? page.command : '/';
    renderPage();
  }

  function renderMenu() {
    updateCaret();
    const query = input.value.trim().toLowerCase();
    error.hidden = true;
    if (!query) return closeMenu();
    matches = pages.filter(page => page.command !== currentCommand &&
      (page.command.startsWith(query) || page.command === aliases[query]));
    selected = Math.min(selected, Math.max(0, matches.length - 1));
    menu.replaceChildren();
    if (!matches.length) return closeMenu();
    matches.forEach((page, index) => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'command-option';
      option.id = `command-option-${index}`;
      option.setAttribute('role', 'option');
      option.setAttribute('aria-selected', String(index === selected));
      const name = document.createElement('span');
      name.textContent = page.command;
      const label = document.createElement('span');
      label.textContent = page.label;
      option.append(name, label);
      option.addEventListener('click', () => openPage(page.command));
      menu.append(option);
    });
    menu.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    input.setAttribute('aria-activedescendant', `command-option-${selected}`);
    menu.children[selected]?.scrollIntoView({ block: 'nearest' });
  }

  function renderPage() {
    const route = location.hash.slice(1).replace(/^\/?/, '/');
    const canonical = aliases[route] || route;
    const page = pages.find(page => page.command === canonical);
    const section = page?.section;
    currentCommand = page?.command || '/home';
    document.body.classList.toggle('is-page', Boolean(section));
    document.querySelector('.page-header').hidden = !section;
    document.querySelector('.page-content').hidden = !section;
    document.querySelectorAll('.content-section').forEach(element => {
      element.hidden = element.dataset.section !== section;
    });
    document.querySelector('.breadcrumb').textContent = section ? ` / ${page.command.slice(1)}` : '';
    document.title = section ? `${page.label} — nisedo` : 'nisedo';
    input.value = '';
    closeMenu();
    error.hidden = true;
    if (!page && route !== '/') {
      error.textContent = 'Page not found. Type / to see the commands.';
      error.hidden = false;
    }
    window.scrollTo(0, 0);
    document.querySelector('main').scrollTop = 0;
    if (section) document.querySelector(`[data-section="${section}"]`).focus({ preventScroll: true });
    else input.focus({ preventScroll: true });
    updateScrollHint();
  }

  main.addEventListener('scroll', updateScrollHint, { passive: true });
  const contentResizeObserver = new ResizeObserver(updateScrollHint);
  contentResizeObserver.observe(main);
  contentResizeObserver.observe(document.querySelector('.page-content'));
  scrollHint.addEventListener('click', () => {
    main.scrollBy({
      top: main.clientHeight,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  });

  input.addEventListener('input', () => { selected = 0; renderMenu(); });
  ['keyup', 'click', 'select', 'scroll', 'focus', 'blur'].forEach(event => {
    input.addEventListener(event, updateCaret);
  });
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeMenu(); return; }
    if (menu.hidden) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      selected = (selected + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length;
      renderMenu();
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      input.value = matches[selected].command;
      renderMenu();
    }
  });
  document.querySelector('.command-box').addEventListener('submit', event => {
    event.preventDefault();
    openPage(!menu.hidden && matches.length ? matches[selected].command : input.value);
  });
  document.querySelector('#show-commands').addEventListener('click', () => {
    input.value = '/'; input.focus(); selected = 0; renderMenu();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    event.preventDefault();
    input.value = '/'; input.focus(); selected = 0; renderMenu();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.command-area')) closeMenu();
  });
  window.addEventListener('hashchange', renderPage);
  renderPage();
})();
