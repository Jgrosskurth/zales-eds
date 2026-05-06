/* =============================================================================
   ZALES EDS — split-banner.js
   50/50 editorial split: image side + content side.
   Variant: add 'right' class to block for image-right layout.

   Block table structure:
     Row 0: image
     Row 1: eyebrow text
     Row 2: headline
     Row 3: body text
     Row 4: CTA link
   ============================================================================= */

/**
 * EDS block decorator.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Parse rows
  const imgEl = rows[0]?.querySelector('img');
  const imgSrc = imgEl?.src || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format&fit=crop';
  const imgAlt = imgEl?.alt || '';

  const eyebrow = rows[1]?.textContent.trim() || 'New Collection';
  const headline = rows[2]?.innerHTML.trim() || 'Timeless Pieces for Every Occasion';
  const body = rows[3]?.textContent.trim() || '';

  const ctaRow = rows[4];
  const ctaEl = ctaRow?.querySelector('a');
  const ctaLabel = ctaEl?.textContent.trim() || 'Shop Now';
  const ctaHref = ctaEl?.href || '#';

  // Build DOM
  block.innerHTML = `
    <div class="split-banner-image">
      <img
        src="${imgSrc}"
        alt="${imgAlt}"
        loading="lazy"
        decoding="async"
      />
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

  // Scroll reveal
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        block.classList.add('is-visible');
        io.unobserve(block);
      }
    },
    { threshold: 0.12 }
  );
  io.observe(block);
}
