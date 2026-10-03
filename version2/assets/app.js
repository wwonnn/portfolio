'use strict';
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const projectCards = [...document.querySelectorAll('[data-category]')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  projectCards.forEach(card => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
    if (!card.hidden) count++;
  });
  const result = document.querySelector('#filter-result');
  if (result) result.textContent = `${count}개의 프로젝트`;
}));

const lightbox = document.querySelector('.lightbox');
if (lightbox && typeof lightbox.showModal === 'function') {
  document.querySelectorAll('.image-zoom').forEach(button => button.addEventListener('click', () => {
    const source = button.querySelector('img');
    const target = lightbox.querySelector('img');
    target.src = source.src;
    target.alt = source.alt;
    lightbox.querySelector('p').textContent = source.alt;
    lightbox.showModal();
    document.documentElement.classList.add('no-scroll');
  }));
  lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => {
    if (event.target !== lightbox) return;
    const box = lightbox.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) lightbox.close();
  });
  lightbox.addEventListener('close', () => document.documentElement.classList.remove('no-scroll'));
}

const sectionLinks = [...document.querySelectorAll('.detail-nav a[href^="#section-"]')];
if (sectionLinks.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      sectionLinks.forEach(link => {
        const selected = link.getAttribute('href') === '#' + entry.target.id;
        link.classList.toggle('active', selected);
        if (selected) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-100px 0px -65% 0px' });
  document.querySelectorAll('.detail-section').forEach(section => observer.observe(section));
}
