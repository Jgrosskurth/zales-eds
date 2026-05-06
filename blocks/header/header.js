/* =============================================================================
   ZALES EDS — header.js
   Full header with logo, primary nav (dropdown support), icon tray, search,
   and mobile hamburger menu.
   ============================================================================= */

const NAV_ITEMS = [
  { label: 'New', href: '/new', class: '' },
  {
    label: 'Engagement',
    href: '/engagement',
    class: 'has-dropdown',
    children: [
      { label: 'Engagement Rings', href: '/engagement/rings' },
      { label: 'Wedding Bands', href: '/engagement/bands' },
      { label: 'Bridal Sets', href: '/engagement/bridal-sets' },
      { label: 'Build Your Own Ring', href: '/engagement/build' },
      { label: 'Diamond Guide', href: '/engagement/diamond-guide' },
    ],
  },
  {
    label: 'Jewelry',
    href: '/jewelry',
    class: 'has-dropdown',
    children: [
      { label: 'Necklaces', href: '/jewelry/necklaces' },
      { label: 'Earrings', href: '/jewelry/earrings' },
      { label: 'Bracelets', href: '/jewelry/bracelets' },
      { label: 'Rings', href: '/jewelry/rings' },
      { label: 'Anklets', href: '/jewelry/anklets' },
    ],
  },
  {
    label: 'Watches',
    href: '/watches',
    class: 'has-dropdown',
    children: [
      { label: "Women's Watches", href: '/watches/womens' },
      { label: "Men's Watches", href: '/watches/mens' },
      { label: 'Luxury Watches', href: '/watches/luxury' },
    ],
  },
  {
    label: 'Gifts',
    href: '/gifts',
    class: 'has-dropdown',
    children: [
      { label: 'Gifts Under $100', href: '/gifts/under-100' },
      { label: 'Gifts for Her', href: '/gifts/for-her' },
      { label: 'Gifts for Him', href: '/gifts/for-him' },
      { label: 'Gift Cards', href: '/gifts/cards' },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
    class: 'has-dropdown',
    children: [
      { label: 'Holiday Collection', href: '/collections/holiday' },
      { label: 'Vera Wang Love', href: '/collections/vera-wang' },
      { label: 'Disney Enchanted', href: '/collections/disney' },
      { label: 'Endless Embrace', href: '/collections/endless-embrace' },
    ],
  },
  { label: '✦ Customize', href: '/customize', class: 'nav-customize' },
  { label: 'Sale', href: '/sale', class: 'nav-sale' },
];

const ICONS = {
  search: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="7"/>
    <line x1="16.5" y1="16.5" x2="22" y2="22"/>
  </svg>`,
  account: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="7" r="4"/>
    <path d="M20 21a8 8 0 1 0-16 0"/>
  </svg>`,
  heart: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>`,
  bag: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>`,
  close: `<svg viewBox="0 0 24 24" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;">
    <polyline points="9,6 15,12 9,18"/>
  </svg>`,
};

/**
 * Builds primary navigation HTML.
 */
function buildNav() {
  const items = NAV_ITEMS.map((item) => {
    const dropdownHTML = item.children
      ? `<div class="header-dropdown">
          <ul>
            ${item.children.map((c) => `<li><a href="${c.href}">${c.label}</a></li>`).join('')}
          </ul>
        </div>`
      : '';

    return `<li class="${item.class || ''}">
      <a href="${item.href}">${item.label}</a>
      ${dropdownHTML}
    </li>`;
  }).join('');

  return `<nav class="header-nav" aria-label="Main navigation">
    <ul role="menubar">${items}</ul>
  </nav>`;
}

/**
 * Builds icon tray HTML.
 */
function buildIcons() {
  return `
    <div class="header-icons">
      <button class="header-icon-btn" aria-label="Search" data-action="search">
        ${ICONS.search}
      </button>
      <a href="/account" class="header-icon-btn" aria-label="Account">
        ${ICONS.account}
      </a>
      <a href="/wishlist" class="header-icon-btn" aria-label="Wishlist">
        ${ICONS.heart}
      </a>
      <a href="/cart" class="header-icon-btn" aria-label="Shopping bag, 0 items">
        ${ICONS.bag}
        <span class="cart-count" aria-hidden="true">0</span>
      </a>
    </div>`;
}

/**
 * Builds mobile navigation HTML.
 */
function buildMobileMenu() {
  const mobileItems = NAV_ITEMS.map((item) => `
    <li class="${item.class || ''}">
      <a href="${item.href}">
        ${item.label}
        ${item.children ? ICONS.chevronRight : ''}
      </a>
    </li>`).join('');

  return `
    <div class="header-mobile-menu" id="mobile-menu" role="dialog" aria-label="Mobile navigation" aria-modal="true">
      <div class="mobile-menu-header">
        <span class="logo-wordmark" style="font-family:var(--font-body);font-size:20px;font-weight:900;letter-spacing:0.22em;color:var(--color-primary);">ZALES</span>
        <button class="mobile-menu-close" aria-label="Close menu" data-action="close-menu">
          ${ICONS.close}
        </button>
      </div>
      <ul class="mobile-nav-list" role="menu">
        ${mobileItems}
      </ul>
      <div class="mobile-utility-links">
        <a href="/stores">Find a Store</a>
        <a href="/book-appointment">Book an Appointment</a>
        <a href="/vault-rewards">Vault Rewards</a>
        <a href="/help">Help</a>
      </div>
    </div>
    <div class="mobile-menu-overlay" aria-hidden="true"></div>`;
}

/**
 * Builds search tray HTML.
 */
function buildSearchTray() {
  return `
    <div class="header-search-wrapper" role="search" id="site-search">
      <input
        type="search"
        class="header-search-input"
        placeholder="Search for rings, necklaces, collections..."
        aria-label="Search Zales"
        autocomplete="off"
      />
      <button class="header-search-close" aria-label="Close search" data-action="close-search">
        ${ICONS.close}
      </button>
    </div>`;
}

/**
 * Wires up interactive behaviors.
 * @param {Element} headerEl — the <header> element
 */
function initBehaviors(headerEl) {
  const searchBtn = headerEl.querySelector('[data-action="search"]');
  const searchTray = headerEl.querySelector('#site-search');
  const searchInput = headerEl.querySelector('.header-search-input');
  const closeSearch = headerEl.querySelector('[data-action="close-search"]');
  const hamburger = headerEl.querySelector('.header-hamburger');
  const mobileMenu = headerEl.querySelector('#mobile-menu');
  const overlay = headerEl.querySelector('.mobile-menu-overlay');
  const closeMobile = headerEl.querySelector('[data-action="close-menu"]');

  // Search toggle
  if (searchBtn && searchTray) {
    searchBtn.addEventListener('click', () => {
      const isOpen = searchTray.classList.toggle('open');
      searchBtn.setAttribute('aria-expanded', isOpen);
      if (isOpen) {
        window.requestAnimationFrame(() => searchInput?.focus());
      }
    });
  }

  if (closeSearch && searchTray) {
    closeSearch.addEventListener('click', () => {
      searchTray.classList.remove('open');
      if (searchBtn) searchBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // Escape closes search
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (searchTray?.classList.contains('open')) {
        searchTray.classList.remove('open');
        searchBtn?.setAttribute('aria-expanded', 'false');
      }
      if (mobileMenu?.classList.contains('open')) {
        closeMobileMenu();
      }
    }
  });

  // Mobile menu
  function openMobileMenu() {
    mobileMenu?.classList.add('open');
    overlay?.classList.add('open');
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
    overlay?.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });
  }

  if (closeMobile) closeMobile.addEventListener('click', closeMobileMenu);
  if (overlay) overlay.addEventListener('click', closeMobileMenu);

  // Active nav item
  const currentPath = window.location.pathname;
  headerEl.querySelectorAll('.header-nav a').forEach((a) => {
    if (a.pathname === currentPath) {
      a.closest('li')?.classList.add('active');
    }
  });
}

/**
 * EDS block decorator.
 * @param {Element} block
 */
export default function decorate(block) {
  const headerEl = block.closest('header') || document.querySelector('header') || block;

  // Build full header HTML
  headerEl.innerHTML = `
    <div class="header-nav-wrapper">
      <button class="header-hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div class="header-logo">
        <a href="/" aria-label="Zales — Home">
          <span class="logo-wordmark">ZALES</span>
        </a>
      </div>

      ${buildNav()}
      ${buildIcons()}
    </div>

    ${buildSearchTray()}
    ${buildMobileMenu()}
  `;

  initBehaviors(headerEl);
}
