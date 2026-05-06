/* =============================================================================
   ZALES EDS — hero.js
   Full-bleed cinematic hero block.
   Reads from block table: row 1 = image/video, row 2 = eyebrow, row 3 = headline,
   row 4 = body, row 5+ = CTA links.
   Variants: 'video' class on block enables video playback.
   ============================================================================= */

/**
 * Parse CTA rows from the block table.
 * Each row after the body text is treated as a CTA.
 * Returns an array of { href, label, style } objects.
 */
function parseCTAs(ctaEls) {
  return ctaEls.map((el, i) => {
    const a = el.querySelector('a');
    return {
      href: a?.href || '#',
      label: a?.textContent?.trim() || el.textContent?.trim() || 'Shop Now',
      style: i === 0 ? 'btn btn-outline' : 'btn btn-accent',
    };
  });
}

/**
 * Build the hero DOM structure.
 */
function buildHero(block, { eyebrow, headline, body, media, ctas, isVideo }) {
  // Media layer
  const mediaEl = document.createElement('div');
  mediaEl.className = 'hero-media';

  if (isVideo && media) {
    const video = document.createElement('video');
    video.src = media;
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute('aria-hidden', 'true');
    mediaEl.appendChild(video);
  } else if (media) {
    // If media is already an img element, clone it
    const imgSrc = typeof media === 'string' ? media : media.src || media.querySelector('img')?.src;
    const imgAlt = typeof media === 'object' ? media.querySelector('img')?.alt || '' : '';
    const img = document.createElement('img');
    img.src = imgSrc || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&auto=format&fit=crop';
    img.alt = imgAlt;
    img.loading = 'eager'; // hero image is LCP
    img.fetchPriority = 'high';
    img.decoding = 'async';
    mediaEl.appendChild(img);
  } else {
    // Placeholder gradient background if no image provided
    mediaEl.style.background = `linear-gradient(135deg, #1a0f3c 0%, #2A1750 50%, #3d2070 100%)`;
  }

  // Content
  const ctaHTML = ctas.map((c) => `<a href="${c.href}" class="${c.style}">${c.label}</a>`).join('');

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

  // Scroll indicator
  const scrollEl = document.createElement('div');
  scrollEl.className = 'hero-scroll';
  scrollEl.setAttribute('aria-hidden', 'true');
  scrollEl.innerHTML = `
    <div class="hero-scroll-line"></div>
    <span class="hero-scroll-text">Scroll</span>`;

  // Assemble
  block.innerHTML = '';
  block.appendChild(mediaEl);
  block.appendChild(contentEl);
  block.appendChild(scrollEl);
}

/**
 * Trigger reveal animation.
 * Uses IntersectionObserver for scroll-based reveal.
 */
function initReveal(block) {
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        // Small delay to ensure paint
        window.requestAnimationFrame(() => {
          window.setTimeout(() => block.classList.add('hero-visible'), 80);
        });
        io.unobserve(block);
      }
    },
    { threshold: 0.01 }
  );
  io.observe(block);
}

/**
 * Subtle parallax on scroll (pointer devices only).
 */
function initParallax(block) {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const img = block.querySelector('.hero-media img');
  if (!img) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;
        img.style.transform = `translateY(${rate}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * EDS block decorator.
 * @param {Element} block
 */
export default function decorate(block) {
  const isVideo = block.classList.contains('video');
  const rows = [...block.querySelectorAll(':scope > div')];

  // Parse rows from the EDS block table
  // Row structure (flexible — falls back gracefully):
  // Row 0: media (image or video URL)
  // Row 1: eyebrow text
  // Row 2: headline
  // Row 3: body text
  // Row 4+: CTA links

  let mediaEl = null;
  let eyebrow = '';
  let headline = '';
  let body = '';
  const ctaEls = [];

  if (rows.length > 0) {
    // Row 0 — media
    const mediaRow = rows[0];
    const imgEl = mediaRow.querySelector('img');
    const aEl = mediaRow.querySelector('a');
    if (imgEl) {
      mediaEl = imgEl;
    } else if (aEl) {
      mediaEl = aEl.href;
    } else {
      mediaEl = mediaRow.textContent.trim() || null;
    }
  }

  if (rows.length > 1) eyebrow = rows[1].textContent.trim();
  if (rows.length > 2) headline = rows[2].textContent.trim();
  if (rows.length > 3) body = rows[3].textContent.trim();

  // Remaining rows = CTAs
  for (let i = 4; i < rows.length; i++) {
    ctaEls.push(rows[i]);
  }

  const ctas = parseCTAs(ctaEls);

  // Build DOM
  buildHero(block, { eyebrow, headline, body, media: mediaEl, ctas, isVideo });

  // Add variant classes
  if (isVideo) block.classList.add('hero-video');

  // Trigger reveal
  initReveal(block);

  // Parallax
  initParallax(block);
}
