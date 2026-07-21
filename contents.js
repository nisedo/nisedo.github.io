(() => {
  const links = [...document.querySelectorAll('.contents-nav a[href^="#"]')];
  const sections = links
    .map((link) => document.querySelector(link.hash))
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = () => {
    const marker = Math.min(window.innerHeight * 0.15, 96);
    const atBottom =
      Math.ceil(window.scrollY + window.innerHeight) >=
      document.documentElement.scrollHeight;
    const active = atBottom
      ? sections[sections.length - 1]
      : [...sections]
          .reverse()
          .find((section) => section.getBoundingClientRect().top <= marker);

    links.forEach((link) => {
      if (active && link.hash === `#${active.id}`) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  let scheduled = false;
  const scheduleUpdate = () => {
    if (scheduled) return;

    scheduled = true;
    window.requestAnimationFrame(() => {
      setActive();
      scheduled = false;
    });
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  setActive();
})();
