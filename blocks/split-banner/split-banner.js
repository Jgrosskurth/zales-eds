/*
 * ZALES EDS — blocks/split-banner/split-banner.js
 * 50/50 editorial split: image + text with scroll-reveal slide-in.
 *
 * EDS block table:
 *   Row 0: image
 *   Row 1: eyebrow text
 *   Row 2: headline (may include HTML e.g. <em>)
 *   Row 3: body text
 *   Row 4: CTA link
 *
 * Variant classes (add to block):
 *   right — image on right (content on left)
 *   dark  — navy background for content side
 *   gray  — light gray background for content side
 */

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  /* ── Parse media ── */
  const mediaRow  = rows[0] ?? null;
  const pictureEl = mediaRow?.querySelector('picture') ?? null;
  const imgEl     = mediaRow?.querySelector('img') ?? null;
  const imgSrc    = !pictureEl ? (imgEl?.src ?? 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format&fit=crop') : null;
  const imgAlt    = imgEl?.alt ?? pictureEl?.querySelector('img')?.alt ?? '';

  /* ── Parse content ── */
  const eyebrow  = rows[1]?.textContent.trim() ?? 'New Collection';
  // Preserve innerHTML for headline (allows <em>, <strong>)
  const headline = rows[2]?.innerHTML?.trim() ?? 'Timeless Pieces for Every Occasion';
  const body     = rows[3]?.textContent.trim() ?? '';

  const ctaEl    = rows[4]?.querySelector('a');
  const ctaLabel = ctaEl?.textContent.trim() ?? 'Shop Now';
  const ctaHref  = ctaEl?.href ?? '#';

  /* ── Build image HTML ── */
  let imageHTML = '';
  if (pictureEl) {
    const pic = pictureEl.cloneNode(true);
    const img = pic.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      img.decoding = 'async';
    }
    imageHTML = pic.outerHTML;
  } else {
    imageHTML = `<img src="${imgSrc}" alt="${imgAlt}" loading="lazy" decoding="async"/>`;
  }

  /* ── Build DOM ── */
  block.innerHTML = `
    <div class="split-banner-image">
      ${imageHTML}
    </div>

    <div class="split-banner-content">
      <div class="split-banner-content-inner">
        ${eyebrow ? `<span class="split-banner-eyebrow">${eyebrow}</span>` : ''}
        <div class="split-banner-rule" aria-hidden="true"></div>
        <h2 class="split-banner-headline">${headline}</h2>
        ${body ? `<p class="split-banner-body">${body}</p>` : ''}
        <a href="${ctaHref}" class="split-banner-cta">${ctaLabel}</a>
      </div>
    </div>
  `;

  /* ── Scroll reveal ── */
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        block.classList.add('is-visible');
        io.unobserve(block);
      }
    },
    { threshold: 0.05, rootMargin: '9999px 0px 9999px 0px' },
  );
  io.observe(block);
}
