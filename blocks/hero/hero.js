/*
 * ZALES EDS — blocks/hero/hero.js
 * Full-bleed cinematic hero. Handles image, eyebrow, H1, body, CTAs.
 * Triggers Ken Burns + text stagger reveal on load.
 * Optional scroll-based parallax on pointer devices.
 *
 * EDS block table row order:
 *   Row 0: media — <picture>/<img> element or video URL string
 *   Row 1: eyebrow text (small caps label)
 *   Row 2: headline (H1)
 *   Row 3: body paragraph
 *   Row 4+: CTA links (each row = one button; first = outline, rest = accent)
 *
 * Variant classes:
 *   .video  — enables <video> autoplay instead of image
 */

/**
 * Parse CTA rows into structured objects.
 *
 * @param {Element[]} ctaEls
 * @returns {{ href: string, label: string, style: string }[]}
 */
function parseCTAs(ctaEls) {
  return ctaEls.map((el, i) => {
    const a = el.querySelector('a');
    return {
      href:  a?.href || '#',
      label: a?.textContent?.trim() || el.textContent?.trim() || 'Shop Now',
      style: i === 0 ? 'btn btn-outline' : 'btn btn-accent',
    };
  });
}

/**
 * Resolve the media source from a block row.
 * Handles: <picture>, <img>, plain text URL.
 *
 * @param {Element} mediaRow
 * @returns {{ el: Element|null, src: string|null, alt: string }}
 */
function resolveMedia(mediaRow) {
  if (!mediaRow) return { el: null, src: null, alt: '' };

  // EDS wraps images in <picture>
  const pictureEl = mediaRow.querySelector('picture');
  if (pictureEl) {
    const img = pictureEl.querySelector('img');
    return { el: pictureEl, src: img?.src ?? null, alt: img?.alt ?? '' };
  }

  const imgEl = mediaRow.querySelector('img');
  if (imgEl) return { el: imgEl, src: imgEl.src, alt: imgEl.alt ?? '' };

  const linkEl = mediaRow.querySelector('a');
  if (linkEl) return { el: null, src: linkEl.href, alt: '' };

  const text = mediaRow.textContent.trim();
  if (text.match(/\.(jpg|jpeg|png|webp|gif|mp4|webm)/i)) {
    return { el: null, src: text, alt: '' };
  }

  return { el: null, src: null, alt: '' };
}

/**
 * Build and inject the hero DOM structure.
 *
 * @param {Element} block
 * @param {object} data
 */
function buildHero(block, { eyebrow, headline, body, media, ctas, isVideo }) {
  /* ── Media layer ── */
  const mediaEl = document.createElement('div');
  mediaEl.className = 'hero-media';

  if (isVideo && media.src) {
    const video = document.createElement('video');
    video.src = media.src;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('aria-hidden', 'true');
    mediaEl.appendChild(video);
  } else if (media.el) {
    // Preserve EDS picture/img element (srcset, lazy loading etc.)
    const cloned = media.el.cloneNode(true);
    // Override loading for hero (LCP element — eager)
    const img = cloned.tagName === 'IMG' ? cloned : cloned.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
      img.decoding = 'async';
    }
    mediaEl.appendChild(cloned);
  } else if (media.src) {
    const img = document.createElement('img');
    img.src = media.src;
    img.alt = media.alt ?? '';
    img.loading = 'eager';
    img.fetchPriority = 'high';
    img.decoding = 'async';
    mediaEl.appendChild(img);
  } else {
    // Fallback gradient background
    mediaEl.style.background = 'linear-gradient(135deg, #1a0f3c 0%, #2B1650 55%, #3d2070 100%)';
  }

  /* ── CTA HTML ── */
  const ctaHTML = ctas
    .map((c) => `<a href="${c.href}" class="${c.style}">${c.label}</a>`)
    .join('');

  /* ── Content layer ── */
  const contentEl = document.createElement('div');
  contentEl.className = 'hero-content';
  contentEl.innerHTML = `
    <div class="hero-content-inner">
      ${eyebrow ? `<span class="hero-eyebrow">${eyebrow}</span>` : ''}
      <div class="hero-gold-rule" aria-hidden="true"></div>
      <h1 class="hero-headline">${headline || 'Every Look You Own'}</h1>
      ${body ? `<p class="hero-body">${body}</p>` : ''}
      ${ctas.length ? `<div class="hero-ctas">${ctaHTML}</div>` : ''}
    </div>`;

  /* ── Scroll indicator ── */
  const scrollEl = document.createElement('div');
  scrollEl.className = 'hero-scroll';
  scrollEl.setAttribute('aria-hidden', 'true');
  scrollEl.innerHTML = `
    <div class="hero-scroll-line"></div>
    <span class="hero-scroll-text">Scroll for more</span>`;

  /* ── Assemble ── */
  block.innerHTML = '';
  block.appendChild(mediaEl);
  block.appendChild(contentEl);
  block.appendChild(scrollEl);
}

/**
 * Trigger the staggered reveal animation once the hero enters the viewport.
 * Uses a very low threshold so it fires almost immediately on page load.
 *
 * @param {Element} block
 */
function initReveal(block) {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        window.requestAnimationFrame(() => {
          window.setTimeout(() => block.classList.add('hero-visible'), 60);
        });
        io.unobserve(block);
      }
    },
    { threshold: 0.01 },
  );
  io.observe(block);
}

/**
 * Subtle CSS-driven parallax on scroll (pointer-fine devices only).
 * Rate of 0.3: for every 100px scrolled, image moves 30px down.
 *
 * @param {Element} block
 */
function initParallax(block) {
  // Skip on touch devices — avoids jank and battery drain
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const mediaInner = block.querySelector('.hero-media img, .hero-media video');
  if (!mediaInner) return;

  let rafPending = false;

  function onScroll() {
    if (rafPending) return;
    rafPending = true;
    window.requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      // Only apply while hero is in view (scrolled < hero height)
      if (scrolled < block.offsetHeight) {
        mediaInner.style.transform = `translateY(${scrolled * 0.28}px)`;
      }
      rafPending = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── EDS block decorator ────────────────────────────────────────────────────── */
export default function decorate(block) {
  const isVideo = block.classList.contains('video');
  const rows    = [...block.querySelectorAll(':scope > div')];

  /* Parse row data */
  const mediaRow = rows[0] ?? null;
  const eyebrow  = rows[1]?.textContent.trim() ?? '';
  const headline = rows[2]?.textContent.trim() ?? '';
  const body     = rows[3]?.textContent.trim() ?? '';
  const ctaEls   = rows.slice(4);

  const media = resolveMedia(mediaRow);
  const ctas  = parseCTAs(ctaEls);

  /* Build DOM */
  buildHero(block, { eyebrow, headline, body, media, ctas, isVideo });

  /* Variant class */
  if (isVideo) block.classList.add('hero-video');

  /* Reveal animation */
  initReveal(block);

  /* Parallax (desktop only) */
  initParallax(block);
}
