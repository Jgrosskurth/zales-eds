/*
 * ZALES EDS — blocks/footer/footer.js
 * Multi-column dark footer with social icons, link columns (accordion on mobile),
 * email signup, and legal bar with payment icons.
 *
 * All content is hardcoded (standard e-commerce footer pattern).
 * The block renders into the <footer> element.
 */

/* ── Social link definitions ────────────────────────────────────────────────── */
const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com/zalesjewelry',
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
    </svg>`,
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com/zales',
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>`,
  },
  {
    name: 'Pinterest',
    href: 'https://pinterest.com/zalesjewelry',
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.88 6.38 9.35-.09-.81-.17-2.06.03-2.94.19-.8 1.27-5.38 1.27-5.38s-.32-.65-.32-1.6c0-1.5.87-2.62 1.95-2.62.92 0 1.37.69 1.37 1.52 0 .93-.59 2.31-.9 3.6-.25 1.07.54 1.95 1.59 1.95 1.91 0 3.19-2.43 3.19-5.3 0-2.19-1.49-3.73-3.62-3.73-2.47 0-3.92 1.85-3.92 3.77 0 .74.29 1.55.64 1.99.07.09.08.17.06.26-.07.27-.22.85-.25.97-.04.16-.13.19-.3.12-1.12-.52-1.82-2.16-1.82-3.48 0-2.83 2.06-5.43 5.93-5.43 3.11 0 5.53 2.22 5.53 5.18 0 3.09-1.95 5.58-4.66 5.58-.91 0-1.77-.47-2.06-1.03l-.56 2.1c-.2.78-.75 1.75-1.12 2.34.84.26 1.74.4 2.67.4 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
    </svg>`,
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com/@zales',
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.33 6.33 0 0 0-6.34 6.33 6.33 6.33 0 0 0 6.34 6.33 6.33 6.33 0 0 0 6.33-6.33V8.88a8.19 8.19 0 0 0 4.79 1.52V7.01a4.85 4.85 0 0 1-1.02-.32z"/>
    </svg>`,
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/zales',
    icon: `<svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.4a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
      <polygon points="9.75,15.02 15.5,12 9.75,8.98" fill="#1A1A1A"/>
    </svg>`,
  },
];

/* ── Footer link columns ────────────────────────────────────────────────────── */
const FOOTER_LINKS = [
  {
    heading: 'Engagement',
    links: [
      { label: 'Engagement Rings',    href: '/engagement/rings' },
      { label: 'Wedding Bands',       href: '/engagement/bands' },
      { label: 'Bridal Sets',         href: '/engagement/bridal-sets' },
      { label: 'Build Your Ring',     href: '/engagement/build' },
      { label: 'Diamond Guide',       href: '/engagement/diamond-guide' },
    ],
  },
  {
    heading: 'Jewelry',
    links: [
      { label: 'Rings',      href: '/jewelry/rings' },
      { label: 'Necklaces',  href: '/jewelry/necklaces' },
      { label: 'Earrings',   href: '/jewelry/earrings' },
      { label: 'Bracelets',  href: '/jewelry/bracelets' },
      { label: 'Watches',    href: '/watches' },
    ],
  },
  {
    heading: 'Services & Support',
    links: [
      { label: 'Find a Store',         href: '/stores' },
      { label: 'Book an Appointment',  href: '/book-appointment' },
      { label: 'Ring Sizing Guide',    href: '/ring-sizing' },
      { label: 'Jewelry Care',         href: '/jewelry-care' },
      { label: 'Repair Services',      href: '/repairs' },
      { label: 'Vault Rewards',        href: '/vault-rewards' },
      { label: 'Contact Us',           href: '/contact' },
    ],
  },
];

/* ── Payment methods ────────────────────────────────────────────────────────── */
const PAYMENT_METHODS = ['Visa', 'MC', 'Amex', 'PayPal', 'Affirm', 'Klarna'];

/* ── Legal links ────────────────────────────────────────────────────────────── */
const LEGAL_LINKS = [
  { label: 'Privacy Policy',     href: '/privacy' },
  { label: 'Terms of Use',       href: '/terms' },
  { label: 'CA Privacy Notice',  href: '/ca-privacy' },
  { label: 'Accessibility',      href: '/accessibility' },
  { label: 'Sitemap',            href: '/sitemap' },
];

/* ── Builders ───────────────────────────────────────────────────────────────── */

function buildSocialIcons() {
  return SOCIAL_LINKS.map((s) => `
    <a
      href="${s.href}"
      class="footer-social-link"
      aria-label="${s.name}"
      target="_blank"
      rel="noopener noreferrer"
    >
      ${s.icon}
    </a>`).join('');
}

function buildLinkGroup(group, index) {
  const collapseId = `footer-col-${index}`;
  const linksHTML  = group.links
    .map((l) => `<li><a href="${l.href}">${l.label}</a></li>`)
    .join('');

  const chevronDown = `<svg viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="6,9 12,15 18,9"/>
  </svg>`;

  return `
    <div class="footer-links-group">
      <button
        class="footer-links-toggle"
        aria-expanded="false"
        aria-controls="${collapseId}"
      >
        ${group.heading}
        ${chevronDown}
      </button>
      <h3 class="footer-links-heading">${group.heading}</h3>
      <div class="footer-links-collapsible" id="${collapseId}">
        <ul class="footer-links-list">
          ${linksHTML}
        </ul>
      </div>
    </div>`;
}

function buildPaymentIcons() {
  return PAYMENT_METHODS
    .map((m) => `<span class="footer-payment-icon">${m}</span>`)
    .join('');
}

/* ── Mobile accordion behavior ──────────────────────────────────────────────── */
function initAccordion(footer) {
  const toggles = [...footer.querySelectorAll('.footer-links-toggle')];
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const collapseId = toggle.getAttribute('aria-controls');
      const panel      = footer.querySelector(`#${collapseId}`);
      const isOpen     = toggle.getAttribute('aria-expanded') === 'true';

      toggle.setAttribute('aria-expanded', !isOpen);
      panel?.classList.toggle('open', !isOpen);
    });
  });
}

/* ── EDS block decorator ────────────────────────────────────────────────────── */
export default function decorate(block) {
  const footerEl = block.closest('footer') ?? document.querySelector('footer') ?? block;
  const year     = new Date().getFullYear();

  const linkColumnsHTML = FOOTER_LINKS.map((group, i) => buildLinkGroup(group, i)).join('');

  footerEl.innerHTML = `
    <div class="footer-main">

      <!-- Brand column -->
      <div class="footer-brand">
        <a href="/" class="footer-logo" aria-label="Zales — Home">ZALES</a>

        <p class="footer-tagline">
          America's Diamond Store Since 1924.
          Fine jewelry for every love story, every look, every life.
        </p>

        <nav class="footer-social" aria-label="Zales on social media">
          ${buildSocialIcons()}
        </nav>

        <div class="footer-signup">
          <span class="footer-signup-label">Stay in the Know</span>
          <form class="footer-signup-form" aria-label="Email newsletter signup" onsubmit="return false;">
            <input
              type="email"
              class="footer-signup-input"
              placeholder="Your email address"
              aria-label="Email address"
              autocomplete="email"
            />
            <button type="submit" class="footer-signup-btn">Join</button>
          </form>
        </div>
      </div>

      <!-- Link columns -->
      ${linkColumnsHTML}

    </div>

    <hr class="footer-divider" role="separator"/>

    <div class="footer-bottom">
      <p class="footer-copyright">
        © ${year} Zales Corporation. All Rights Reserved. A Signet Jewelers Company.
      </p>
      <ul class="footer-legal-links" aria-label="Legal links">
        ${LEGAL_LINKS.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
      </ul>
      <div class="footer-payment" aria-label="Accepted payment methods">
        ${buildPaymentIcons()}
      </div>
    </div>
  `;

  initAccordion(footerEl);
}
