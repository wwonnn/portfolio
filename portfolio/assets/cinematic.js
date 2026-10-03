'use strict';
(() => {
  const scenes = [...document.querySelectorAll('[data-scene]')];
  if (!scenes.length) return;
  const projects = JSON.parse(document.querySelector('#portfolio-data').textContent);
  const exhibits = [...document.querySelectorAll('[data-project]')];
  const stage = document.querySelector('.exhibition-stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const names = ['시작', '소개', '기술', '이력', '프로젝트'];
  const hashes = ['top', 'about', 'skills', 'education', 'projects'];
  let scene = 0, turning = false, turnTimer;
  let selected = projects.map((_, i) => i), target = 0, position = 0, announcedWork = -1;
  let raf = 0, wheelTotal = 0, lastWheel = 0, lastTurn = 0;
  let pointer = null, dragged = false, ignoreClickUntil = 0;
  let touch = null;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const hasDialog = () => Boolean(document.querySelector('dialog[open]'));
  const pane = () => scenes[scene].querySelector('.scene-inner');
  const canScroll = (node, delta) => Boolean(node && node.scrollHeight > node.clientHeight + 3 && (delta > 0 ? node.scrollTop + node.clientHeight < node.scrollHeight - 3 : node.scrollTop > 3));
  const currentWork = () => selected[clamp(Math.round(target), 0, selected.length - 1)];

  function finishTurn() {
    scenes.forEach(node => node.classList.remove('scene-leaving', 'scene-entering', 'reverse'));
    turning = false;
  }
  function syncScene() {
    scenes.forEach((node, i) => {
      node.setAttribute('aria-hidden', String(i !== scene));
      node.inert = i !== scene;
      node.classList.toggle('is-active', i === scene);
    });
    document.body.classList.toggle('in-exhibition', scene === 4);
    document.querySelector('#chapter-number').textContent = String(scene + 1).padStart(2, '0');
    document.querySelector('#chapter-name').textContent = names[scene];
    document.querySelector('#page-prev').disabled = scene === 0;
    document.querySelector('#page-next').disabled = scene === 4;
    document.querySelectorAll('[data-scene-link]').forEach(link => {
      const index = Number(link.dataset.sceneLink);
      const active = index === scene || (index === 1 && scene === 2);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    document.querySelector('#scene-announcement').textContent = `${scene + 1} / ${scenes.length}, ${names[scene]}`;
    if (scene === 4) requestRender();
  }
  function updateHash() {
    const suffix = scene === 4 ? `projects/${projects[currentWork()].slug}` : hashes[scene];
    history.replaceState(null, '', '#' + suffix);
  }
  function goTo(index, options = {}) {
    index = clamp(index, 0, scenes.length - 1);
    if (index === scene) return;
    const previous = scene, outgoing = scenes[previous], incoming = scenes[index];
    clearTimeout(turnTimer);
    finishTurn();
    scene = index;
    if (!options.instant && !reduced.matches) {
      turning = true;
      outgoing.classList.add('scene-leaving');
      incoming.classList.add('scene-entering');
      if (index < previous) {
        outgoing.classList.add('reverse');
        incoming.classList.add('reverse');
      }
      turnTimer = setTimeout(finishTurn, 920);
    }
    syncScene();
    updateHash();
    wheelTotal = 0;
    lastTurn = performance.now();
    if (options.focus) {
      incoming.tabIndex = -1;
      incoming.focus({preventScroll: true});
    }
  }
  document.querySelectorAll('[data-scene-link]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    goTo(Number(link.dataset.sceneLink), {focus: true});
  }));
  document.querySelector('#page-prev').addEventListener('click', () => goTo(scene - 1, {focus: true}));
  document.querySelector('#page-next').addEventListener('click', () => goTo(scene + 1, {focus: true}));

  function updateWorkInfo() {
    const index = currentWork();
    const p = projects[index];
    document.querySelector('#work-title').textContent = p.title;
    document.querySelector('#work-description').textContent = p.summary;
    document.querySelector('#work-meta').textContent = p.label + ' / ' + p.period;
    document.querySelector('#work-prev').disabled = target <= 0;
    document.querySelector('#work-next').disabled = target >= selected.length - 1;
    if (scene === 4) updateHash();
  }
  function render() {
    raf = 0;
    const distance = target - position;
    position = reduced.matches || Math.abs(distance) < .002 ? target : position + distance * .13;
    const rect = stage.getBoundingClientRect();
    // CSS width is independent of the perspective transform.
    const width = exhibits[0].offsetWidth;
    const small = rect.width < 600;
    const stride = width * (small ? .98 : .91);
    exhibits.forEach((item, index) => {
      const order = selected.indexOf(index);
      const offset = order - position;
      const visible = order !== -1 && Math.abs(offset) < 3.1;
      item.hidden = order === -1;
      item.style.visibility = visible ? 'visible' : 'hidden';
      item.setAttribute('aria-hidden', String(!visible));
      item.tabIndex = visible ? 0 : -1;
      if (!visible) return;
      const bend = Math.min(Math.abs(offset), 2.8);
      const x = offset * stride;
      const y = bend * (small ? 12 : 24);
      const z = -bend * (small ? 90 : 170);
      const angle = reduced.matches ? 0 : -clamp(offset, -2.8, 2.8) * (small ? 15 : 21);
      const roll = reduced.matches ? 0 : clamp(offset, -2, 2) * 1.3;
      item.style.transform = `translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateY(${angle}deg) rotateZ(${roll}deg)`;
      item.style.opacity = String(Math.max(.15, 1 - bend * .17));
      item.style.filter = `brightness(${Math.max(.4, 1 - bend * .19)})`;
      item.style.zIndex = String(20 - Math.round(bend * 5));
    });
    const now = currentWork();
    if (now !== announcedWork) {
      announcedWork = now;
      updateWorkInfo();
    }
    if (Math.abs(target - position) > .002 && scene === 4) requestRender();
  }
  function requestRender() { if (!raf) raf = requestAnimationFrame(render); }
  function setWork(value) {
    target = clamp(value, 0, selected.length - 1);
    updateWorkInfo();
    requestRender();
  }
  document.querySelector('#work-prev').addEventListener('click', () => setWork(Math.round(target) - 1));
  document.querySelector('#work-next').addEventListener('click', () => setWork(Math.round(target) + 1));
  document.querySelectorAll('[data-work-filter]').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.workFilter;
    selected = projects.map((_, i) => i).filter(i => category === 'all' || projects[i].category === category);
    target = position = 0;
    announcedWork = -1;
    document.querySelectorAll('[data-work-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    updateWorkInfo();
    requestRender();
  }));
  exhibits.forEach(link => {
    link.addEventListener('click', event => {
      if (performance.now() < ignoreClickUntil) { event.preventDefault(); return; }
      const index = Number(link.dataset.project);
      target = position = Math.max(0, selected.indexOf(index));
      updateHash();
    });
    link.addEventListener('focus', () => {
      const i = selected.indexOf(Number(link.dataset.project));
      if (i !== -1) setWork(i);
    });
  });
  stage.addEventListener('pointerdown', event => {
    if (scene !== 4 || event.button !== 0) return;
    pointer = {id:event.pointerId, x:event.clientX, target};
    dragged = false;
  });
  stage.addEventListener('pointermove', event => {
    if (!pointer || pointer.id !== event.pointerId) return;
    const delta = event.clientX - pointer.x;
    if (Math.abs(delta) > 8) {
      if (!dragged) stage.setPointerCapture(event.pointerId);
      dragged = true;
      stage.classList.add('is-dragging');
      setWork(pointer.target - delta / (exhibits[0].offsetWidth * .9));
    }
  });
  function endDrag(event) {
    if (!pointer || pointer.id !== event.pointerId) return;
    if (dragged) {
      ignoreClickUntil = performance.now() + 350;
      setWork(Math.round(target));
    }
    if (stage.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    stage.classList.remove('is-dragging');
    pointer = null;
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  window.addEventListener('wheel', event => {
    if (event.ctrlKey || hasDialog()) return;
    const scale = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1;
    const delta = (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * scale;
    if (Math.abs(delta) < .5) return;
    if (scene !== 4 && canScroll(pane(), delta)) {
      event.preventDefault();
      pane().scrollTop += delta;
      return;
    }
    event.preventDefault();
    if (turning) return;
    const now = performance.now();
    if (scene === 4) {
      if (target < .03 && delta < 0) {
        wheelTotal = now - lastWheel > 180 ? delta : wheelTotal + delta;
        lastWheel = now;
        if (wheelTotal < -120) goTo(3);
      } else {
        wheelTotal = 0;
        lastWheel = now;
        setWork(target + delta / 480);
      }
      return;
    }
    // A trackpad's trailing momentum must not turn the following page.
    const quiet = now - lastWheel;
    wheelTotal = quiet > 170 || Math.sign(wheelTotal) !== Math.sign(delta) ? delta : wheelTotal + delta;
    lastWheel = now;
    if (now - lastTurn < 1060) { wheelTotal = 0; return; }
    if (Math.abs(wheelTotal) >= 55) goTo(scene + Math.sign(wheelTotal));
  }, {passive:false});

  window.addEventListener('keydown', event => {
    if (hasDialog() || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.key === 'Home') { event.preventDefault(); goTo(0); return; }
    if (event.key === 'End') { event.preventDefault(); goTo(4); setWork(selected.length - 1); return; }
    const forward = ['ArrowDown','ArrowRight','PageDown'].includes(event.key) || (event.key === ' ' && !event.shiftKey && event.target === document.body);
    const back = ['ArrowUp','ArrowLeft','PageUp'].includes(event.key) || (event.key === ' ' && event.shiftKey && event.target === document.body);
    if (!forward && !back) return;
    if (turning) { event.preventDefault(); return; }
    const delta = forward ? 1 : -1;
    if (scene !== 4 && canScroll(pane(), delta)) {
      event.preventDefault();
      pane().scrollTop += delta * (/^Page/.test(event.key) ? pane().clientHeight * .8 : 70);
      return;
    }
    event.preventDefault();
    if (scene === 4) {
      if (back && target < .03) goTo(3);
      else setWork(Math.round(target) + delta);
    } else goTo(scene + delta);
  });
  window.addEventListener('touchstart', event => {
    if (hasDialog() || scene === 4 || event.touches.length !== 1) { touch = null; return; }
    touch = {y:event.touches[0].clientY, scrollUp:canScroll(pane(), -1), scrollDown:canScroll(pane(), 1)};
  }, {passive:true});
  window.addEventListener('touchend', event => {
    if (!touch || hasDialog() || turning || scene === 4) return;
    const delta = touch.y - event.changedTouches[0].clientY;
    const blocked = delta > 0 ? touch.scrollDown : touch.scrollUp;
    touch = null;
    if (Math.abs(delta) > 65 && !blocked) goTo(scene + Math.sign(delta));
  }, {passive:true});
  document.querySelectorAll('[data-open-dialog]').forEach(button => button.addEventListener('click', () => {
    document.getElementById(button.dataset.openDialog).showModal();
  }));
  document.querySelectorAll('.film-dialog').forEach(dialog => {
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
  });
  function loadHash() {
    const parts = location.hash.slice(1).split('/');
    if (parts[0] === 'contact' && !document.getElementById('contact').open) document.getElementById('contact').showModal();
    const chapter = hashes.indexOf(parts[0] === 'experience' ? 'education' : parts[0]);
    if (chapter === 4 && parts[1]) {
      const index = projects.findIndex(p => p.slug === parts[1]);
      if (index !== -1) {
        if (!selected.includes(index)) {
          selected = projects.map((_, i) => i);
          document.querySelectorAll('[data-work-filter]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.workFilter === 'all')));
        }
        target = position = selected.indexOf(index);
      }
    }
    if (chapter !== -1 && chapter !== scene) goTo(chapter, {instant:true});
    else syncScene();
    updateWorkInfo();
  }
  window.addEventListener('hashchange', loadHash);
  window.addEventListener('pageshow', loadHash);
  window.addEventListener('resize', requestRender);
  reduced.addEventListener('change', () => { finishTurn(); position = target; requestRender(); });
  loadHash();
  requestRender();
})();
