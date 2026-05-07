/*
 * ZALES EDS — blocks/editorial-text/editorial-text.js
 * Full-width centered text section with gold rule, headline, body, CTA.
 * Reveals with fade+slide-up via IntersectionObserver.
 *
 * EDS block table:
 *   Row 0: category / eyebrow label
 *   Row 1: headline
 *   Row 2: body text
 *   Row 3: CTA link (optional)
 *
 * Variant classes:
 *   .light  — white background
 *   .dark   — navy purple background
 */

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  /* Parse rows */
  const category = rows[0]?.textContent.trim() ?? '';
  // Preserve inline HTML in headline (allows <em>, <strong>)
  const headline = rows[1]?.innerHTML?.trim() ?? 'Every Love Story Deserves the Perfect Ring.';
  const body     = rows[2]?.textContent.trim() ?? '';

  const ctaEl    = rows[3]?.querySelector('a');
  const ctaLabel = ctaEl?.textContent.trim() ?? '';
  const ctaHref  = ctaEl?.href ?? '#';

  /* Build DOM */
  block.innerHTML = `
    <div class="editorial-text-inner">
      ${category ? `<span class="editorial-text-category">${category}</span>` : ''}
      <div class="editorial-text-rule" aria-hidden="true"></div>
      <h2 class="editorial-text-headline">${headline}</h2>
      ${body ? `<p class="editorial-text-body">${body}</p>` : ''}
      ${ctaLabel ? `
        <a href="${ctaHref}" class="editorial-text-cta">
          ${ctaLabel}
          <span class="editorial-text-cta-arrow" aria-hidden="true">→</span>
        </a>` : ''}
    </div>
  `;

  /* Scroll reveal */
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
