'use strict';
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const panels = [...document.querySelectorAll('main > section:not(#top) > .container')];
  if (!panels.length) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-revealed');
      observer.unobserve(entry.target);
    }
  }, {rootMargin: '0px 0px -7% 0px', threshold: 0});
  panels.forEach(panel => {
    panel.classList.add('scroll-reveal');
    observer.observe(panel);
  });
  motion.addEventListener('change', event => {
    if (!event.matches) return;
    panels.forEach(panel => panel.classList.add('is-revealed'));
    observer.disconnect();
  });
})();

// Prebuilt templates keep every project available without a separate request.
(() => {
  const popup = document.querySelector('.project-modal');
  if (!popup || typeof popup.showModal !== 'function') return;
  const content = popup.querySelector('.project-modal-content');
  const closeButton = popup.querySelector('.project-modal-close');
  const imagePopup = document.querySelector('.lightbox');
  let returnFocus = null;
  let pagePosition = {left: 0, top: 0};
  let pointerStartedOutside = false;
  let sectionObserver = null;

  function projectTemplate(link) {
    const match = link.getAttribute('href')?.match(/^projects\/([^/?#]+)\.html$/);
    return match ? document.getElementById('project-' + match[1]) : null;
  }

  function watchSections() {
    sectionObserver?.disconnect();
    if (!('IntersectionObserver' in window)) return;
    const links = [...content.querySelectorAll('.detail-nav a[href^="#"]')];
    sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach(link => {
          const selected = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', selected);
          if (selected) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, {root: content, rootMargin: '0px 0px -55% 0px', threshold: 0});
    content.querySelectorAll('.detail-section').forEach(section => sectionObserver.observe(section));
  }

  function openProject(template, trigger) {
    const alreadyOpen = popup.open;
    if (!alreadyOpen) {
      returnFocus = trigger;
      pagePosition = {left: window.scrollX, top: window.scrollY};
    }
    content.replaceChildren(template.content.cloneNode(true));
    popup.setAttribute('aria-labelledby', content.querySelector('h1').id);
    if (!alreadyOpen) {
      document.documentElement.style.setProperty('--project-scrollbar-width', (window.innerWidth - document.documentElement.clientWidth) + 'px');
      document.documentElement.classList.add('project-modal-open');
      popup.showModal();
    }
    content.scrollTop = 0;
    closeButton.focus({preventScroll: true});
    watchSections();
  }

  document.querySelectorAll('a[href^="projects/"]').forEach(link => {
    if (projectTemplate(link)) link.setAttribute('aria-haspopup', 'dialog');
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const template = projectTemplate(link);
    if (template) {
      event.preventDefault();
      openProject(template, link);
    }
  });

  content.addEventListener('click', event => {
    const zoom = event.target.closest('.image-zoom');
    if (zoom && imagePopup && typeof imagePopup.showModal === 'function') {
      const source = zoom.querySelector('img');
      const target = imagePopup.querySelector('img');
      target.src = source.src;
      target.alt = source.alt;
      imagePopup.querySelector('p').textContent = source.alt;
      imagePopup.showModal();
      return;
    }
    const link = event.target.closest('a');
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.getAttribute('href') === 'index.html#projects') {
      event.preventDefault();
      popup.close();
    } else if (link.getAttribute('href')?.startsWith('#')) {
      const section = content.querySelector(link.getAttribute('href'));
      if (section) {
        event.preventDefault();
        content.scrollTo({top: content.scrollTop + section.getBoundingClientRect().top - content.getBoundingClientRect().top - 24, behavior: 'auto'});
      }
    }
  });
  closeButton.addEventListener('click', () => popup.close());
  function outside(event) {
    const rect = popup.getBoundingClientRect();
    return event.target === popup && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  }
  popup.addEventListener('pointerdown', event => {pointerStartedOutside = outside(event);});
  popup.addEventListener('click', event => {
    if (pointerStartedOutside && outside(event)) popup.close();
    pointerStartedOutside = false;
  });
  popup.addEventListener('close', () => {
    sectionObserver?.disconnect();
    document.documentElement.classList.remove('project-modal-open');
    document.documentElement.style.removeProperty('--project-scrollbar-width');
    content.replaceChildren();
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll: true});
    window.scrollTo({...pagePosition, behavior: 'instant'});
  });
})();
