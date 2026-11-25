/* ==========================================================================
   TRINITY MASTER BUILDERS — mother page engine
   The page introduces Trinity and routes to each business line.
   GSAP + ScrollTrigger drive every moment; Lenis smooths fine-pointer wheels.
   Touch keeps native momentum and drives the same timelines.
   ========================================================================== */
(() => {
  const D = window.TRINITY;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce) document.documentElement.classList.add('rm');

  gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------------- analytics (IDs come from Site Settings) ---------------- */
  window.dataLayer = window.dataLayer || [];
  const track = (event, params = {}) => {
    window.dataLayer.push({ event, ...params });
    if (window.fbq) window.fbq('trackCustom', event, params);
  };
  (function loadTags({ gtm, ga4 }) {
    const add = (src) => { const s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); };
    if (gtm) { window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' }); add(`https://www.googletagmanager.com/gtm.js?id=${gtm}`); }
    if (ga4) { add(`https://www.googletagmanager.com/gtag/js?id=${ga4}`); window.gtag = function () { dataLayer.push(arguments); }; gtag('js', new Date()); gtag('config', ga4); }
  })(D.settings);

  /* ---------------- images (Unsplash id or a full URL) ---------------- */
  const src = (id, w) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`;
  const setImg = (img, id, alt, { sizes = '100vw', eager = false } = {}) => {
    if (/^(https?:|assets\/)/.test(id)) img.src = id;
    else {
      img.src = src(id, 1600);
      img.srcset = [640, 1080, 1600, 2200].map((w) => `${src(id, w)} ${w}w`).join(', ');
      img.sizes = sizes;
    }
    img.alt = alt || ''; img.decoding = 'async'; img.loading = eager ? 'eager' : 'lazy';
    return img;
  };

  /* ==========================================================================
     THE MARK — three ellipses, radial at 120°, woven over/under
     Ring 0 (top) Scaping · Ring 1 (lower-left) Home · Ring 2 (lower-right) Water
     ========================================================================== */
  const RING_ANGLES = [-90, 150, 30];
  const RD = 100, RX = 90, RY = 152;
  const geom = RING_ANGLES.map((a) => {
    const r = (a * Math.PI) / 180;
    return { cx: RD * Math.cos(r), cy: RD * Math.sin(r), rot: a + 90 };
  });
  const pt = (i, t) => {
    const { cx, cy, rot } = geom[i]; const r = (rot * Math.PI) / 180;
    const x = RX * Math.cos(t), y = RY * Math.sin(t);
    return { x: cx + x * Math.cos(r) - y * Math.sin(r), y: cy + x * Math.sin(r) + y * Math.cos(r) };
  };
  const inside = (j, p) => {
    const { cx, cy, rot } = geom[j]; const r = (rot * Math.PI) / 180;
    const dx = p.x - cx, dy = p.y - cy;
    const qx = dx * Math.cos(r) + dy * Math.sin(r), qy = -dx * Math.sin(r) + dy * Math.cos(r);
    return (qx / RX) ** 2 + (qy / RY) ** 2 - 1;
  };
  const crossings = (i, j) => {
    const out = []; const N = 1440; let prev = inside(j, pt(i, 0));
    for (let k = 1; k <= N; k++) {
      const p = pt(i, (k / N) * Math.PI * 2); const v = inside(j, p);
      if (Math.sign(v) !== Math.sign(prev)) out.push(p);
      prev = v;
    }
    return out.sort((a, b) => Math.hypot(a.x, a.y) - Math.hypot(b.x, b.y));
  };
  // Cyclic weave: at the inner crossing ring i passes over i+1, at the outer one it passes under.
  const WEAVE = [[0, 1], [1, 2], [2, 0]].flatMap(([a, b]) => {
    const c = crossings(a, b);
    return [{ p: c[0], top: a, under: b }, { p: c[c.length - 1], top: b, under: a }];
  });

  let markUid = 0;
  // intro: guides + hairlines for every ring · draft: rings still "on the drawing board"
  function buildMark(svg, { intro = false, draft = [], weight = 1, shine = false, guides = false } = {}) {
    const uid = `m${markUid++}`; const edgeW = 28 * weight, ribW = 21 * weight;
    const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
    const ell = (i, cls, sw, parent, extra = { pathLength: 1 }) => {
      const { cx, cy, rot } = geom[i];
      return mk('ellipse', { cx, cy, rx: RX, ry: RY, transform: `rotate(${rot} ${cx} ${cy})`, class: cls, 'stroke-width': sw, ...extra }, parent);
    };
    const defs = mk('defs', {}, svg);
    const parts = { guides: [], hairs: [], ribs: [], patches: [], dashes: [], notes: [], shines: [] };
    // shine: a narrow band of light that travels across the gold (one gradient shared by every ring)
    const sid = `${uid}-shine`;
    if (shine) {
      const lg = mk('linearGradient', { id: sid, gradientUnits: 'userSpaceOnUse', x1: -160, y1: -260, x2: 160, y2: 260, gradientTransform: 'translate(-700 0)' }, defs);
      [[0.32, 0], [0.5, 1], [0.68, 0]].forEach(([o, a]) => mk('stop', { offset: o, 'stop-color': '#FFF6DF', 'stop-opacity': a }, lg));
      parts.shineGrad = lg; parts.sweep = 700;
    }
    const addShine = (i, g) => shine && parts.shines.push(ell(i, 'shine', ribW * 0.7, g, { stroke: `url(#${sid})` }));
    const gilded = (i) => !draft.includes(i);

    if (intro || guides || draft.length) {
      const g = mk('g', { class: 'guides' }, svg);
      parts.guides.push(mk('line', { x1: -290, y1: 0, x2: 290, y2: 0, class: 'guide', pathLength: 1 }, g));
      parts.guides.push(mk('line', { x1: 0, y1: -290, x2: 0, y2: 290, class: 'guide', pathLength: 1 }, g));
      RING_ANGLES.forEach((a) => {
        const r = (a * Math.PI) / 180;
        parts.guides.push(mk('line', { x1: 0, y1: 0, x2: 270 * Math.cos(r), y2: 270 * Math.sin(r), class: 'guide', pathLength: 1 }, g));
      });
      parts.guides.push(mk('circle', { cx: 0, cy: 0, r: RD, class: 'guide guide--dash' }, g));
      geom.forEach(({ cx, cy }) => parts.guides.push(mk('circle', { cx, cy, r: 3, class: 'guide guide--dot' }, g)));
      const hg = mk('g', { class: 'hairs' }, svg);
      geom.forEach((_, i) => { if (intro || !gilded(i)) parts.hairs.push(ell(i, 'hair', 1, hg)); });
    }

    geom.forEach((_, i) => {
      const g = mk('g', { class: 'ring', 'data-ring': i }, svg);
      if (gilded(i)) { parts.ribs.push([ell(i, 'rib-edge', edgeW, g), ell(i, 'rib', ribW, g)]); addShine(i, g); }
      else {
        // the unbuilt ring: a live drafting line crawling around its path
        parts.dashes.push(ell(i, 'dash', 1, g, {}));
        const { cx, cy } = geom[i];
        const t = mk('text', { x: cx, y: cy + 6, class: 'note', 'text-anchor': 'middle' }, g);
        t.textContent = 'III'; parts.notes.push(t);
      }
    });
    // Each patch redraws the upper ring only where it overlaps the lower ring's band,
    // near that crossing — so there are no visible cut edges.
    WEAVE.forEach(({ p, under, top }, k) => {
      if (!gilded(top) || !gilded(under)) return;
      const cid = `${uid}-c${k}`, mid = `${uid}-m${k}`;
      mk('circle', { cx: p.x, cy: p.y, r: 60 }, mk('clipPath', { id: cid }, defs));
      const mask = mk('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: -320, y: -320, width: 640, height: 640 }, defs);
      const band = ell(under, '', edgeW + 3, mk('g', { 'clip-path': `url(#${cid})` }, mask));
      band.setAttribute('fill', 'none'); band.setAttribute('stroke', '#fff');
      const g = mk('g', { class: 'ring', 'data-ring': top, mask: `url(#${mid})` }, svg);
      ell(top, 'rib-edge', edgeW, g); ell(top, 'rib', ribW, g); addShine(top, g);
      parts.patches.push(g);
    });
    svg.parts = parts;
    return svg;
  }
  const focusRings = (svg, idx) => {
    svg.classList.toggle('has-focus', idx != null);
    $$('.ring', svg).forEach((r) => r.classList.toggle('is-focus', idx != null && [].concat(idx).includes(+r.dataset.ring)));
  };

  const W = D.services.water;
  const waterLive = W.status === 'active';
  const introMark = buildMark($('#introMark'), { intro: true });
  const navMark = buildMark($('#navMark'), { weight: 1.5 });
  // Three worlds: the real Trinity mark (inlined from the brand file) — six ribbon segments, three icons
  const tmbParts = (svg) => (svg.parts = { segs: $$('.tmb-seg', svg), shines: $$('.tmb-shine', svg), icons: $$('.tmb-icon', svg), shineGrad: $('linearGradient', svg), sweep: 320 });
  const trioMark = $('#trioMark');
  // the same mark lives again in the chooser and the close — cloned with its own ids
  const cloneTmb = (host, id) => {
    const c = trioMark.cloneNode(true);
    c.id = id; c.setAttribute('class', 'tmb'); c.setAttribute('aria-hidden', 'true'); c.removeAttribute('role');
    c.innerHTML = c.innerHTML.replace(/tmbC(\d)/g, `${id}C$1`).replace(/tmbShine/g, `${id}Shine`);
    host.appendChild(c);
    return tmbParts(c), c;
  };
  tmbParts(trioMark);
  const pathMark = cloneTmb($('#pathMark'), 'pathTmb');
  const closeMark = cloneTmb($('#closeMark'), 'closeTmb');
  const focusIcon = (idx) => {
    trioMark.classList.toggle('has-focus', idx != null);
    trioMark.parts.icons.forEach((g) => g.classList.toggle('is-focus', +g.dataset.ring === idx));
  };
  // each world's chapter carries the full mark on the drawing board, its own ring in focus
  const siteMarks = $$('[data-site-mark]').map((svg) => {
    buildMark(svg, { guides: true, shine: true, draft: waterLive ? [] : [2] });
    const i = +svg.dataset.siteMark;
    focusRings(svg, i);
    // the brand first appears inside its own ring (as in the Trinity mark), then takes over
    const brand = svg.parentNode.querySelector('.site__brand');
    brand.style.setProperty('--bx', `${50 + geom[i].cx / 6}%`);
    brand.style.setProperty('--by', `${50 + geom[i].cy / 6}%`);
    svg.brand = brand;
    return svg;
  });
  buildMark($('#footMark'), { weight: 1.5 });
  // Our story: chapters and beats (copy + photos); the last beat closes on the drawing-board mark
  const ST = D.story;
  setImg($('#storyIntroImg'), ST.intro.image, '', { eager: true });
  $('#storyTag').textContent = ST.intro.tagline;
  $$('.story__word').forEach((w) => (w.innerHTML = [...w.textContent].map((c) => `<span class="ch" aria-hidden="true">${c}</span>`).join('')));
  $('#storyChapters').innerHTML = ST.chapters.map((c) =>
    `<p class="story__chapter"><span class="logo logo--${c.logo}"></span><b class="display">${c.name}</b></p>`).join('');
  $('#storyBeats').innerHTML = ST.beats.map((b, i) => {
    const c = ST.chapters[b.chapter];
    const fig = b.mark
      ? `<div class="story__fig story__fig--mark"><svg class="mark mark--story" id="storyMark" viewBox="-300 -300 600 600" aria-hidden="true"></svg>${['scaping', 'home', 'water'].map((k, r) => `<span class="story__logo logo logo--${k}" data-ring="${r}" aria-hidden="true"></span>`).join('')}</div>`
      : `<div class="story__fig story__fig--${b.images.length > 1 ? 'duo' : 'solo'}">${b.images.map((im, k) => `<figure class="story__shot"><img data-k="${i}-${k}"></figure>`).join('')}</div>`;
    return `<article class="story__beat"${i ? ' aria-hidden="true"' : ''}><div class="story__copy"><p class="mono story__chap">${c.name}</p><p class="mono story__k">(${String(i + 1).padStart(2, '0')})</p><h3 class="display story__h">${b.title}</h3><p class="story__p">${b.body}</p></div>${fig}</article>`;
  }).join('');
  $$('.story__shot img').forEach((img) => { const [i, k] = img.dataset.k.split('-'); const im = ST.beats[i].images[k]; setImg(img, im.src, im.alt, { eager: true }); });
  $('#storyTicks').innerHTML = ST.beats.map((b, i) => `<li${i && b.chapter !== ST.beats[i - 1].chapter ? ' class="is-new"' : ''}><i></i></li>`).join('');
  $('#storyAll').textContent = String(ST.beats.length).padStart(2, '0');
  const storyMark = buildMark($('#storyMark'), { guides: true, shine: true });
  $$('.story__logo').forEach((l) => { const g = geom[+l.dataset.ring]; l.style.setProperty('--bx', `${50 + g.cx / 6}%`); l.style.setProperty('--by', `${50 + g.cy / 6}%`); });

  /* ==========================================================================
     CONTENT (rendered from the CMS payload)
     ========================================================================== */
  setImg($('#heroImg'), D.hero.image, D.hero.alt, { eager: true });
  $$('[data-src-key]').forEach((img) => { const s = D.services[img.dataset.srcKey]; setImg(img, s.image.src, s.image.alt); });
  $$('[data-statement]').forEach((e) => (e.textContent = D.services[e.dataset.statement].statement));
  $$('[data-domain]').forEach((e) => (e.textContent = D.services[e.dataset.domain].domain));
  // every portal link points at its business line's own site
  $$('[data-portal]').forEach((a) => { const s = D.services[a.dataset.portal]; if (s.url) a.href = s.url; });

  // World chapters — copy, list and links from each business line (Water follows `status`)
  $$('.site').forEach((sec) => {
    const key = sec.dataset.service, S = D.services[key];
    const c = key === 'water' ? S.copy[waterLive ? 'active' : 'coming_soon'] : S.copy;
    $$('[data-c]', sec).forEach((e) => (e.textContent = c[e.dataset.c] || ''));
    $$('[data-c="badge"]', sec).forEach((e) => (e.hidden = !c.badge));
    $('[data-c-vision]', sec).innerHTML = S.vision.map((v) => `<li>${v}</li>`).join('');
    $$('[data-site-link]', sec).forEach((a) => {
      if (S.url && S.status === 'active') { a.href = S.url; a.dataset.portal = key; }
      else if (a.classList.contains('btn')) a.href = `mailto:${D.settings.email}?subject=${encodeURIComponent(`${S.name} — keep me posted`)}`;
      else a.removeAttribute('data-cursor');
    });
  });

  const mail = $('#mailLink'); mail.href = `mailto:${D.settings.email}`; mail.textContent = D.settings.email;
  $$('[data-phone]').forEach((a) => { a.href = `tel:${D.settings.phone.replace(/\D/g, '')}`; a.textContent = D.settings.phone; });

  // Start a project — each business line goes to its own site; the whole property goes to Trinity by email
  $$('[data-path]').forEach((a) => {
    const key = a.dataset.path;
    if (key === 'complete') {
      a.href = `mailto:${D.settings.email}?subject=${encodeURIComponent('Complete transformation — project request')}&body=${encodeURIComponent('Hi Trinity team,\n\nI would like to talk about a complete transformation of my property.\n\nLocation:\nWhat I have in mind:\n\nThank you,\n')}`;
      return;
    }
    const S = D.services[key], live = S.status === 'active' && S.url;
    const c = key === 'water' ? S.copy[waterLive ? 'active' : 'coming_soon'] : S.copy;
    $('[data-path-slogan]', a).textContent = c.title;
    $('[data-path-cta]', a).textContent = live ? `Visit ${S.name}` : c.cta;
    if (live) { a.href = S.url; a.dataset.portal = key; }
    else a.href = `mailto:${D.settings.email}?subject=${encodeURIComponent(`${S.name} — keep me posted`)}`;
  });
  $('#year').textContent = new Date().getFullYear();

  /* ==========================================================================
     SMOOTH SCROLL
     ========================================================================== */
  let lenis = null;
  if (fine && !reduce && window.Lenis) {
    lenis = window.__lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollTo = (target) => {
    const el = typeof target === 'string' ? $(target) : target;
    if (!el) return;
    lenis ? lenis.scrollTo(el, { duration: 1.8 }) : el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  /* ==========================================================================
     NAV · MENU · CURSOR · LINKS
     ========================================================================== */
  const menu = $('#menu'), menuBtn = $('#menuBtn');
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', open);
    document.body.classList.toggle('menu-open', open);
    if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); lenis?.stop(); $('a', menu).focus({ preventScroll: true }); }
    else { menu.classList.remove('is-open'); lenis?.start(); setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, 900); }
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });

  document.addEventListener('click', (e) => {
    if (e.target.closest('#pathComplete')) { track('form_start', { type: 'Complete transformation', method: 'email' }); return; }
    const portal = e.target.closest('[data-portal]');
    if (portal) { track('service_click', { service: portal.dataset.portal, url: portal.href, source: portal.closest('section,footer,nav')?.id || 'page' }); return; }
    const c = e.target.closest('a[href^="mailto:"],a[href^="tel:"]');
    if (c) { track('contact_click', { method: c.href.split(':')[0] }); return; }
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    e.preventDefault();
    const wasOpen = menu.classList.contains('is-open');
    if (wasOpen) setMenu(false);
    if (id === '#vision') track('start_project', { source: a.closest('section,footer,header')?.id || 'nav' });
    setTimeout(() => scrollTo(id), wasOpen ? 250 : 0);
  });

  const nav = $('#nav');
  ScrollTrigger.create({
    start: () => innerHeight, end: 'max',
    onUpdate: (s) => nav.classList.toggle('is-hidden', s.direction === 1 && !menu.classList.contains('is-open')),
    onLeaveBack: () => nav.classList.remove('is-hidden'),
  });

  if (fine && !reduce) {
    const cur = $('#cursor'), label = $('#cursorLabel');
    const xTo = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
    addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const t = e.target.closest('[data-cursor]');
      cur.classList.toggle('has-label', !!t);
      if (t) label.textContent = t.dataset.cursor;
    });
  }

  /* ---------- chapter indicator + atmosphere ---------- */
  const ATMOS = { bone: '#F1E8D9', olive: '#1B1F16', walnut: '#1E140D', night: '#091014', umber: '#24170D' };
  const chapter = $('#chapter');
  let chapterText = chapter.textContent;
  const setChapter = (txt) => {
    if (txt === chapterText) return; chapterText = txt;
    gsap.timeline().to(chapter, { yPercent: -100, duration: 0.3, ease: 'power2.in' })
      .add(() => (chapter.textContent = txt)).fromTo(chapter, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'expo.out' });
  };
  const setAtmos = (sec) => {
    gsap.to(document.body, { backgroundColor: ATMOS[sec.dataset.atmos || 'bone'], duration: reduce ? 0 : 1.1, ease: 'power2.out', overwrite: 'auto' });
    document.body.classList.toggle('on-dark', sec.dataset.theme === 'dark');
    setChapter(sec.dataset.chapter);
  };
  const seen = new Set();
  // created after the pinned narrative so their offsets include pin spacing
  const atmosTriggers = () => {
    // the active section (or the hero when none is) always owns the atmosphere
    const sync = () => {
      const a = trs.filter((t) => t.isActive).pop();
      if (a && a.trigger.id !== 'top') return setAtmos(a.trigger);
      gsap.to(document.body, { backgroundColor: ATMOS.bone, duration: reduce ? 0 : 0.8, overwrite: 'auto' });
      setChapter($('#top').dataset.chapter);
    };
    const trs = $$('[data-chapter]').map((sec) => ScrollTrigger.create({
      trigger: sec, start: 'top 50%', end: 'bottom 50%', refreshPriority: -1,
      onToggle: (s) => {
        sync();
        const svc = sec.dataset.service;
        if (s.isActive && svc && !seen.has(svc)) { seen.add(svc); track('view_service', { service: svc, status: D.services[svc].status }); }
      },
    }));
    ScrollTrigger.addEventListener('refresh', sync);
  };

  /* ==========================================================================
     INTRO — "Trinity is being built in front of you"
     ========================================================================== */
  const intro = $('#intro');
  const heroLines = $$('.hero__type .mask > span');
  function heroIn() {
    document.body.classList.remove('is-loading');
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.from(heroLines, { yPercent: 110, duration: 1.4, stagger: 0.09 })
      .fromTo('#heroMedia', { opacity: 0 }, { opacity: 1, duration: 1.4 }, 0.35)
      .from('#heroImg', { scale: 1.6, duration: 2.2 }, 0.35)
      .from('.hero__foot', { opacity: 0, y: 12, duration: 1 }, 0.8)
      .from('#nav', { opacity: 0, y: -10, duration: 1 }, 0.6);
    drawMark(navMark, 1.4, 0.5);
    return tl;
  }
  function drawMark(svg, dur = 1.6, delay = 0) {
    const ribs = svg.parts.ribs.flat();
    gsap.set(svg.parts.patches, { opacity: 0 });
    gsap.fromTo(ribs, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur, delay, stagger: 0.06, ease: 'power3.inOut' });
    gsap.to(svg.parts.patches, { opacity: 1, duration: 0.3, delay: delay + dur * 0.92 });
  }

  const toTop = () => { window.scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true, force: true }); };
  function runIntro() {
    toTop();
    if (reduce) { intro.remove(); heroIn(); return; }
    const P = introMark.parts;
    const ribs = P.ribs.flat();
    const drawn = P.guides.filter((g) => g.getAttribute('pathLength'));
    const marks = P.guides.filter((g) => !g.getAttribute('pathLength'));
    const repeat = sessionStorage.getItem('tmb-intro');
    const count = $('#introCount'); const c = { v: 0 };
    lenis?.stop();
    gsap.set([...drawn, ...P.hairs, ...ribs], { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(marks, { opacity: 0 });
    gsap.set(P.patches, { opacity: 0 });
    gsap.set('.intro__trinity span', { yPercent: 110 });
    gsap.set('.intro__sub', { opacity: 0, letterSpacing: '1.2em' });

    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: () => sessionStorage.setItem('tmb-intro', 1) });
    tl.from('.intro__grid', { opacity: 0, scale: 1.08, duration: 1.4, ease: 'power2.out' })
      .to(drawn.slice(0, 2), { strokeDashoffset: 0, duration: 0.9 }, 0.15)
      .to(drawn.slice(2), { strokeDashoffset: 0, duration: 0.8, stagger: 0.08 }, 0.5)
      .to(marks, { opacity: 1, duration: 0.6, stagger: 0.06 }, 0.8)
      .to(P.hairs, { strokeDashoffset: 0, duration: 1.3, stagger: 0.14 }, 1.0)
      .to(ribs, { strokeDashoffset: 0, duration: 1.5, stagger: 0.05, ease: 'power4.inOut' }, 2.0)
      .to(P.patches, { opacity: 1, duration: 0.25 }, 3.45)
      .to([...P.guides, ...P.hairs], { opacity: 0, duration: 0.8, ease: 'power2.out' }, 3.3)
      .to('.intro__trinity span', { yPercent: 0, duration: 1.1, stagger: 0.045, ease: 'expo.out' }, 3.4)
      .to('.intro__sub', { opacity: 0.7, letterSpacing: '.6em', duration: 1.4, ease: 'expo.out' }, 3.7)
      .to(c, { v: 100, duration: 4.4, ease: 'power1.inOut', onUpdate: () => (count.textContent = String(Math.round(c.v)).padStart(3, '0')) }, 0)
      // exit: the mark recedes, the curtain lifts into the hero
      .to('.intro__stage', { scale: 0.78, yPercent: -6, duration: 1.2, ease: 'expo.inOut' }, 4.7)
      .to(['.intro__word', '.intro__meta'], { opacity: 0, y: -20, duration: 0.7, ease: 'power2.in' }, 4.7)
      .to(intro, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.3, ease: 'expo.inOut' }, 5.2)
      .add(() => { heroIn(); }, 5.45)
      .add(() => { intro.remove(); ScrollTrigger.refresh(); toTop(); lenis?.start(); }, 6.6);
    if (repeat) tl.timeScale(2.6);
    // a click or key skips ahead — never trap the visitor
    const skip = () => { if (tl.time() < 4.7) tl.time(4.7); };
    intro.addEventListener('click', skip); addEventListener('keydown', skip, { once: true });
  }

  /* ==========================================================================
     SCROLL NARRATIVE
     ========================================================================== */
  const mm = gsap.matchMedia();

  // geometry of the inline hero window, relative to the pinned stage
  const windowInset = () => {
    const pin = $('.hero__pin').getBoundingClientRect(), w = $('#heroWindow').getBoundingClientRect();
    return `inset(${w.top - pin.top}px ${pin.right - w.right}px ${pin.bottom - w.bottom}px ${w.left - pin.left}px)`;
  };

  mm.add({ desk: '(min-width: 681px)', mob: '(max-width: 680px)', rm: '(prefers-reduced-motion: reduce)' }, (ctx) => {
    const { mob, rm } = ctx.conditions;
    const vw = () => innerWidth;

    /* ---- 1 · Hero: window → world ---- */
    gsap.set('#heroMedia', { clipPath: windowInset() });
    if (!rm) {
      const hero = $('#top');
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero, pin: '.hero__pin', start: 'top top', end: '+=190%', scrub: 0.6, invalidateOnRefresh: true,
          onUpdate: (s) => {
            const open = s.progress > 0.42;
            hero.classList.toggle('is-open', open);
            if (s.isActive) document.body.classList.toggle('on-dark', open);
          },
        },
      });
      tl.fromTo('#heroMedia', { clipPath: () => windowInset() }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1, ease: 'power2.inOut' }, 0)
        .fromTo('#heroImg', { scale: 1.25 }, { scale: 1, duration: 1.3 }, 0)
        .to('.hero__line--1', { x: () => -vw() * 0.45, duration: 0.8 }, 0)
        .to('.hero__line--2 .mask:first-child', { x: () => -vw() * 0.35, duration: 0.8 }, 0)
        .to('.hero__line--2 .mask:last-child', { x: () => vw() * 0.35, duration: 0.8 }, 0)
        .to('.hero__line--3', { x: () => vw() * 0.45, duration: 0.8 }, 0)
        .to('.hero__type', { opacity: 0, duration: 0.35 }, 0.45)
        .to('.hero__foot', { opacity: 0, duration: 0.2 }, 0)
        .fromTo('#heroOver .display span', { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.12, duration: 0.4, ease: 'power3.out' }, 0.95)
        .fromTo('#heroOver .hero__one', { opacity: 0 }, { opacity: 0.85, duration: 0.3 }, 1.25)
        .to({}, { duration: 0.4 });
    }

    /* ---- 2 · Trio: the mark returns as an index ---- */
    if (!rm) {
      const T = trioMark.parts;
      // the ribbons arrive one by one and lock into the knot, then each world's icon settles in its ring
      gsap.timeline({ scrollTrigger: { trigger: '#trio', start: 'top 75%', end: 'center 55%', scrub: 0.8 } })
        .fromTo(T.segs, { opacity: 0, scale: 0.6, rotation: (i) => (i % 2 ? -40 : 40), svgOrigin: '131 120' },
          { opacity: 1, scale: 1, rotation: 0, stagger: 0.12, duration: 0.5, ease: 'power3.out' })
        .fromTo(T.icons, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, stagger: 0.1, duration: 0.3, ease: 'back.out(2)' }, '-=0.15')
        .fromTo(T.shines, { opacity: 0 }, { opacity: 1, duration: 0.05 });
      gsap.from('.trio__title', { yPercent: 30, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.trio__title', start: 'top 85%' } });
      gsap.from('.trio__list li', { y: 40, opacity: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out', scrollTrigger: { trigger: '.trio__list', start: 'top 85%' } });
    }

    /* ---- 3–5 · The three worlds: one chapter format, each on its own ring ---- */
    siteMarks.forEach((svg) => {
      const sec = svg.closest('.site'), P = svg.parts, q = (sel) => $$(sel, sec);
      const lines = P.guides.filter((g) => g.getAttribute('pathLength'));
      const dots = P.guides.filter((g) => !g.getAttribute('pathLength'));
      if (rm) { gsap.set(svg.brand, { opacity: 1, left: '50%', top: '50%', scale: 2.2 }); gsap.set(svg, { opacity: 0.2 }); return; }
      // offset that brings the brand from the ring drawing to the centre of the screen
      const toCentre = (axis) => () => {
        const el = svg.parentNode, p = $('.site__pin', sec).getBoundingClientRect(), m = el.getBoundingClientRect();
        const g = gsap.getProperty(el, axis); // ignore any offset already applied
        return axis === 'x' ? p.left + p.width / 2 - (m.left - g + m.width / 2) : p.top + p.height / 2 - (m.top - g + m.height / 2);
      };
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: sec, pin: $('.site__pin', sec), start: 'top top', end: '+=300%', scrub: 0.7, invalidateOnRefresh: true } })
        .fromTo(q('.site__media img'), { scale: 1.3, opacity: 0.15 }, { scale: 1.05, opacity: 0.55, duration: 1.4 }, 0)
        .fromTo(q('.site__grid'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0)
        .fromTo(lines, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.04 }, 0.05)
        .fromTo(dots, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.4)
        .fromTo([...P.ribs.flat(), ...P.patches, ...P.shines], { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.2)
        .fromTo(P.hairs, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8 }, 0.45)
        .fromTo([...P.dashes, ...P.notes], { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.0)
        .fromTo(q('.site__title span'), { x: () => -vw() * 0.15, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.3)
        .fromTo(q('.site__title em'), { x: () => vw() * 0.15, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.3)
        .fromTo(q('.site__num, .site__line, .site__top, .site__foot'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.35, ease: 'power3.out' }, 0.9)
        // ring → brand: the logo surfaces inside its ring, then grows out of it while the drawing recedes
        .fromTo(svg.brand, { opacity: 0, scale: 0.5, filter: 'blur(8px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }, 1.1)
        .to(svg.brand, { left: '50%', top: '50%', scale: 2.2, duration: 0.6, ease: 'power2.inOut' }, 1.55)
        .to(svg, { opacity: 0.18, scale: 0.92, transformOrigin: '50% 50%', duration: 0.6, ease: 'power2.inOut' }, 1.55)
        // the brand stands alone: everything else steps back, the screen stays held on the logo
        .to(q('.site__type, .site__top, .site__foot'), { opacity: 0, y: -16, duration: 0.45, ease: 'power2.in' }, 2.3)
        .to([svg, ...q('.site__grid')], { opacity: 0, duration: 0.45 }, 2.3)
        .to(q('.site__media img'), { opacity: 0.22, scale: 1.12, duration: 0.6 }, 2.3)
        .to(svg.parentNode, { x: toCentre('x'), y: toCentre('y'), duration: 0.6, ease: 'power2.inOut' }, 2.3)
        .to(svg.brand, { scale: 2.9, duration: 0.6, ease: 'power2.inOut' }, 2.3)
        .to({}, { duration: 0.7 });
    });

    /* ---- 6 · Our story: the title overture, one beat per scroll step, then the knot ---- */
    {
      const P = storyMark.parts, beats = $$('.story__beat'), n = beats.length;
      const chapters = $$('.story__chapter'), ticks = $$('#storyTicks i');
      const lines = P.guides.filter((g) => g.getAttribute('pathLength'));
      const ring = (i) => $$(`.ring[data-ring="${i}"]`, storyMark);
      const logos = $$('.story__logo');
      let cur = -1, knot = null;
      const setBeat = (i) => {
        if (i === cur) return;
        const B = ST.beats[i], ch = B ? B.chapter : -1;
        beats.forEach((b, k) => { b.classList.toggle('is-on', k === i); b.classList.toggle('is-past', k < i); b.setAttribute('aria-hidden', k !== i); });
        chapters.forEach((c, k) => { c.classList.toggle('is-on', k === ch); c.classList.toggle('is-past', k < ch); });
        $('#storyNow').textContent = String(Math.max(i, 0) + 1).padStart(2, '0');
        if (knot) B && B.mark ? knot.play() : knot.reverse();
        cur = i;
      };
      setBeat(rm ? 0 : -1);
      if (rm) { beats.forEach((b) => { b.classList.add('is-on'); b.removeAttribute('aria-hidden'); }); }
      else {
        // the closing mark: guides draw, each craft takes its ring with its brand, then the weave closes
        gsap.set([...P.ribs.flat(), ...P.patches, ...P.shines], { opacity: 0 });
        gsap.set(logos, { opacity: 0, scale: 0.6 });
        knot = gsap.timeline({ paused: true, defaults: { ease: 'power2.out' } })
          .fromTo(lines, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, stagger: 0.04 }, 0)
          .fromTo(P.hairs, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.12 }, 0.2);
        [0, 1, 2].forEach((i) => {
          knot.to(ring(i).filter((g) => !g.hasAttribute('mask')).flatMap((g) => [...g.children]), { opacity: 1, duration: 0.4 }, 0.9 + i * 0.3)
            .to(logos[i], { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 0.95 + i * 0.3);
        });
        knot.to([...P.patches, ...P.shines], { opacity: 1, duration: 0.3 }, 1.9)
          .to([...P.guides, ...P.hairs], { opacity: 0.25, duration: 0.6 }, 2);

        // overture, part 1 — as the section arrives the title rises letter by letter over a small window
        const oval = (w, h) => `ellipse(${w}% ${h}% at 50% 50%)`, small = mob ? oval(30, 17) : oval(13, 20);
        gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: '#story', start: 'top 80%', end: 'top top', scrub: 0.6 } })
          .fromTo('.story__media', { clipPath: oval(0, 0) }, { clipPath: small, duration: 0.8, ease: 'power2.out' }, 0.15)
          .fromTo('.story__word .ch', { yPercent: 115, rotation: 6 }, { yPercent: 0, rotation: 0, stagger: 0.07, duration: 0.55, ease: 'power3.out' }, 0)
          .fromTo('.story__tag', { opacity: 0, y: 20 }, { opacity: 0.75, y: 0, duration: 0.35 }, 0.6);

        // overture, part 2 (pinned) — the window opens onto the founder, then the title parts like the hero's
        const INTRO = 1.6, total = n * 0.85 + INTRO, f = INTRO / total;
        const overture = gsap.timeline({ defaults: { ease: 'none' } })
          .fromTo('.story__media', { clipPath: small }, { clipPath: () => (mob ? oval(62, 36) : oval(34, 46)), duration: f * 0.45, ease: 'power2.inOut', immediateRender: false }, 0)
          .fromTo('.story__media img', { scale: 1.3 }, { scale: 1, duration: f * 0.5, immediateRender: false }, 0)
          .to('.story__tag', { opacity: 0, y: -20, duration: f * 0.2 }, f * 0.48)
          .to('.story__word:first-child', { x: () => -innerWidth * 0.55, opacity: 0, duration: f * 0.38, ease: 'power2.in' }, f * 0.55)
          .to('.story__word:last-child', { x: () => innerWidth * 0.55, opacity: 0, duration: f * 0.38, ease: 'power2.in' }, f * 0.55)
          .to('.story__media', { opacity: 0, scale: 1.08, duration: f * 0.33 }, f * 0.62)
          .fromTo(['.story__head', '.story__progress'], { opacity: 0 }, { opacity: 1, duration: f * 0.14 }, f * 0.86)
          .set({}, {}, 1);
        ScrollTrigger.create({
          trigger: '#story', pin: '.story__pin', start: 'top top', end: `+=${total * 100}%`, animation: overture, scrub: 0.6, invalidateOnRefresh: true,
          onLeaveBack: () => setBeat(-1),
          onUpdate: (s) => {
            const t = ((s.progress - f) / (1 - f)) * n;
            setBeat(t < 0 ? -1 : Math.min(n - 1, Math.floor(t * 0.9999)));
            ticks.forEach((tk, k) => gsap.set(tk, { scaleX: gsap.utils.clamp(0, 1, t - k) }));
          },
        });
      }
    }

    /* ---- 7 · Start a project: the four ways in rise like the worlds before them ---- */
    if (!rm) {
      gsap.fromTo('.path', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '#paths', start: 'top 85%', end: 'top 35%', scrub: 0.8 } });
      gsap.fromTo('.path__media img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '#paths', start: 'top bottom', end: 'bottom top', scrub: true } });
    }

    /* ---- 8 · Vision · close ---- */
    if (!rm) {
      gsap.from('.paths__head > *', { y: 40, opacity: 0, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '#vision', start: 'top 70%' } });
      gsap.from('.close__title', { yPercent: 25, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.close', start: 'top 70%' } });
      assemble(pathMark, { trigger: '#paths', start: 'top 80%', end: 'top 35%', scrub: 0.8 });
      assemble(closeMark, { trigger: '.close', start: 'top 75%', end: 'top 15%', scrub: 0.8 });
    }

    ScrollTrigger.sort();
    return () => { document.body.classList.remove('on-dark'); };
  });
  atmosTriggers();

  /* ---------- trio: the mark is alive — light, float, tilt ---------- */
  function assemble(svg, st) {
    const T = svg.parts;
    gsap.timeline({ scrollTrigger: st })
      .fromTo(T.segs, { opacity: 0, scale: 0.6, rotation: (i) => (i % 2 ? -40 : 40), svgOrigin: '131 120' },
        { opacity: 1, scale: 1, rotation: 0, stagger: 0.12, duration: 0.5, ease: 'power3.out' })
      .fromTo(T.icons, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, stagger: 0.1, duration: 0.3, ease: 'back.out(2)' }, '-=0.15')
      .fromTo(T.shines, { opacity: 0 }, { opacity: 1, duration: 0.05 });
  }
  function alive(svg, area, trigger) {
    const loop = () => { sweep(2.6, svg); gsap.delayedCall(4.5 + Math.random() * 2.5, loop); };
    ScrollTrigger.create({ trigger, start: 'top 40%', once: true, onEnter: () => gsap.delayedCall(0.8, loop) });
    gsap.to(svg, { y: -12, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    if (!fine) return;
    gsap.set(svg, { transformPerspective: 900 });
    const rx = gsap.quickTo(svg, 'rotationX', { duration: 1.2, ease: 'power3.out' });
    const ry = gsap.quickTo(svg, 'rotationY', { duration: 1.2, ease: 'power3.out' });
    area.addEventListener('pointermove', (e) => {
      const r = svg.getBoundingClientRect();
      ry(((e.clientX - (r.left + r.width / 2)) / r.width) * 18);
      rx(-((e.clientY - (r.top + r.height / 2)) / r.height) * 14);
    });
    area.addEventListener('pointerleave', () => { rx(0); ry(0); });
  }
  const sweep = (dur = 2.6, svg = trioMark) => gsap.fromTo(svg.parts.shineGrad,
    { attr: { gradientTransform: `translate(${-svg.parts.sweep} 0)` } },
    { attr: { gradientTransform: `translate(${svg.parts.sweep} 0)` }, duration: dur, ease: 'power2.inOut', overwrite: true });
  if (!reduce) {
    alive(trioMark, $('.trio__body'), '#trio');
    alive(pathMark, $('#pathComplete'), '#paths');
    alive(closeMark, $('.close'), '.close');
    [...siteMarks, storyMark].forEach((svg) => {
      const loopS = () => { sweep(2.8, svg); gsap.delayedCall(5 + Math.random() * 3, loopS); };
      ScrollTrigger.create({ trigger: svg.closest('section'), start: 'top 20%', once: true, onEnter: () => gsap.delayedCall(1.2, loopS) });
    });
  }

  /* ---------- trio hover → ring focus ---------- */
  $$('.trio__list li').forEach((li) => {
    const on = () => { focusIcon(+li.dataset.ring); reduce || sweep(1.3); }, off = () => focusIcon(null);
    li.addEventListener('pointerenter', on); li.addEventListener('pointerleave', off);
    li.addEventListener('focusin', on); li.addEventListener('focusout', off);
  });

  /* ---------- start a project: the open panel follows the pointer / focus ---------- */
  const paths = $$('.path');
  const openPath = (p) => paths.forEach((x) => x.classList.toggle('is-open', x === p));
  paths.forEach((p) => { p.addEventListener('pointerenter', () => openPath(p)); p.addEventListener('focus', () => openPath(p)); });
  $('#paths').addEventListener('pointerleave', () => openPath($('#pathComplete')));

  /* ---------- go ---------- */
  document.fonts.ready.then(() => { ScrollTrigger.refresh(); runIntro(); });
})();
