(() => {
  const pages = [
    { command: '/about', section: 'about', label: 'About me' },
    { command: '/audits', section: 'audit-portfolio', label: 'Audit portfolio' },
    { command: '/bounties', section: 'bug-bounties', label: 'Bug bounties' },
    { command: '/talks', section: 'talks', label: 'Talks, podcasts & webinars' },
    { command: '/tools', section: 'tools-open-source', label: 'Tools & open source' },
    { command: '/writings', section: 'writing', label: 'Articles & writing' },
    { command: '/home', section: null, label: 'Back to the start' },
  ];
  const commands = pages;
  const aliases = { '/writing': '/writings', '/audit-portfolio': '/audits', '/bug-bounties': '/bounties', '/tools-open-source': '/tools', '/': '/home' };
  const input = document.querySelector('#command');
  const caret = document.querySelector('.block-caret');
  const menu = document.querySelector('#commands');
  const error = document.querySelector('.command-error');
  const main = document.querySelector('main');
  const scrollHint = document.querySelector('.scroll-hint');
  const commandArea = document.querySelector('.command-area');
  const commandBox = document.querySelector('.command-box');
  const mobileInput = window.matchMedia('(max-width: 600px), (hover: none) and (pointer: coarse)');
  const viewport = window.visualViewport;
  let matches = [];
  let selected = 0;
  let currentCommand = '/home';
  let layoutFrame = 0;
  let keyboardTimer = 0;
  let keyboardReferenceHeight = viewport?.height || window.innerHeight;
  let keyboardReferenceWidth = window.innerWidth;

  function keepSelectedVisible() {
    const option = menu.children[selected];
    if (!option || menu.hidden) return;
    const top = option.offsetTop - 6;
    const bottom = option.offsetTop + option.offsetHeight + 6;
    // Scroll only the list, never the document or the browser's visual viewport.
    if (top < menu.scrollTop) menu.scrollTop = Math.max(0, top);
    else if (bottom > menu.scrollTop + menu.clientHeight) menu.scrollTop = bottom - menu.clientHeight;
  }

  function updateCommandLayout() {
    const visibleTop = viewport?.offsetTop || 0;
    const visibleHeight = viewport?.height || window.innerHeight;
    const inputFocused = document.activeElement === input;
    if (!inputFocused || window.innerWidth !== keyboardReferenceWidth) {
      keyboardReferenceHeight = Math.max(visibleHeight, window.innerHeight, document.documentElement.clientHeight);
      keyboardReferenceWidth = window.innerWidth;
    }
    const keyboardOpen = mobileInput.matches && inputFocused &&
      (!viewport || Math.abs(viewport.scale - 1) < 0.01) &&
      Math.max(keyboardReferenceHeight, window.innerHeight, document.documentElement.clientHeight) - visibleHeight > 100;
    document.body.classList.toggle('keyboard-open', keyboardOpen);
    document.body.classList.toggle('keyboard-hide-brand', keyboardOpen && visibleHeight < 320);
    if (keyboardOpen) {
      // Absolute coordinates follow iOS viewport panning. Errors overlay the
      // space above the field, so the prompt stays put when a command fails.
      const top = visibleTop + visibleHeight - commandBox.offsetHeight;
      commandArea.style.setProperty('--command-top', `${window.scrollY + Math.max(visibleTop, top)}px`);
      document.body.style.setProperty('--keyboard-top', `${window.scrollY + visibleTop}px`);
    } else {
      commandArea.style.removeProperty('--command-top');
      document.body.style.removeProperty('--keyboard-top');
    }
    const available = commandArea.getBoundingClientRect().top - visibleTop - 22;
    menu.style.setProperty('--command-menu-height', `${Math.max(0, Math.min(360, available))}px`);
    keepSelectedVisible();
  }

  function scheduleCommandLayout() {
    if (layoutFrame) return;
    layoutFrame = requestAnimationFrame(() => {
      layoutFrame = 0;
      updateCommandLayout();
    });
  }

  function trackKeyboardViewport() {
    clearInterval(keyboardTimer);
    keyboardTimer = 0;
    if (!mobileInput.matches || document.activeElement !== input) return;
    let previousMetrics = '';
    // WebKit can update keyboard metrics after its focus/resize events.
    // Poll while focused, but only relayout when those measurements change.
    keyboardTimer = setInterval(() => {
      if (document.hidden) return;
      const metrics = [viewport?.height, viewport?.offsetTop, viewport?.scale,
        window.innerHeight, window.innerWidth, window.scrollY, document.documentElement.clientHeight].join(':');
      if (metrics === previousMetrics) return;
      previousMetrics = metrics;
      scheduleCommandLayout();
    }, 100);
  }

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
    scheduleCommandLayout();
  }

  function openPage(command) {
    const normalized = command.trim().toLowerCase();
    if (normalized === '/command' || normalized === '/commands') {
      input.value = '';
      selected = 0;
      renderMenu();
      return;
    }
    const canonical = aliases[normalized] || normalized;
    const page = commands.find(page => page.command === canonical);
    if (!page) {
      closeMenu();
      error.textContent = `Unknown command: ${command}. Type / to see the commands.`;
      error.hidden = false;
      return;
    }
    if (page.url) {
      window.open(page.url, '_blank', 'noopener,noreferrer');
      input.value = '';
      error.hidden = true;
      closeMenu();
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
    matches = commands.filter(page => page.command !== currentCommand &&
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
    updateCommandLayout();
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
    updateCommandLayout();
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
  commandBox.addEventListener('click', event => {
    if (event.target.closest('.submit-command')) return;
    input.focus({ preventScroll: true });
    selected = 0;
    renderMenu();
  });
  ['keyup', 'click', 'select', 'scroll', 'focus', 'blur'].forEach(event => {
    input.addEventListener(event, updateCaret);
  });
  ['focus', 'blur'].forEach(event => input.addEventListener(event, () => {
    trackKeyboardViewport();
    scheduleCommandLayout();
  }));
  viewport?.addEventListener('resize', scheduleCommandLayout);
  viewport?.addEventListener('scroll', scheduleCommandLayout);
  window.addEventListener('resize', scheduleCommandLayout);
  window.addEventListener('scroll', scheduleCommandLayout, { passive: true });
  mobileInput.addEventListener('change', () => {
    trackKeyboardViewport();
    scheduleCommandLayout();
  });
  // A tap must select the option before blur closes the keyboard and moves it.
  commandArea.addEventListener('pointerdown', event => {
    if (event.target.closest('.command-option, .submit-command')) event.preventDefault();
  });
  // WebKit rubber-bands overflow areas even when their content fits.
  // Constrain each area's touch scrolling, without moving its parent as well.
  [main, menu, error].forEach(scroller => {
    let activeTouch = null;
    scroller.addEventListener('touchstart', event => {
      const ownsGesture = event.target.closest('main, .command-menu, .command-error') === scroller &&
        !event.target.closest('input, textarea');
      const touch = ownsGesture && event.touches.length === 1 ? event.touches[0] : null;
      activeTouch = touch ? { id: touch.identifier, y: touch.clientY } : null;
    }, { passive: true });
    scroller.addEventListener('touchmove', event => {
      if (!activeTouch || event.touches.length !== 1) {
        activeTouch = null;
        return;
      }
      const touch = event.touches[0];
      if (touch.identifier !== activeTouch.id) return;
      const delta = activeTouch.y - touch.clientY;
      activeTouch.y = touch.clientY;
      if (!delta || !event.cancelable) return;
      event.preventDefault();
      const maximum = Math.max(0, scroller.scrollHeight - scroller.clientHeight);
      scroller.scrollTop = Math.max(0, Math.min(maximum, scroller.scrollTop + delta));
    }, { passive: false });
    ['touchend', 'touchcancel'].forEach(event => {
      scroller.addEventListener(event, () => { activeTouch = null; }, { passive: true });
    });
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
  commandBox.addEventListener('submit', event => {
    event.preventDefault();
    openPage(!menu.hidden && matches.length ? matches[selected].command : input.value);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey || /INPUT|TEXTAREA/.test(document.activeElement.tagName)) return;
    event.preventDefault();
    input.value = '/'; input.focus({ preventScroll: true }); selected = 0; renderMenu();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.command-area')) closeMenu();
  });
  window.addEventListener('hashchange', renderPage);
  renderPage();
})();
