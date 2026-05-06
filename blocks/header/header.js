/*
 * ZALES EDS — blocks/header/header.js
 * Full header with ZALES wordmark, centered primary nav (with dropdowns),
 * icon tray (Search, Account, Wishlist, Bag), mobile hamburger + slide-in menu.
 *
 * Data source: hardcoded nav structure (EDS nav document is optional override).
 * The block reads from the EDS /nav document if present; otherwise uses defaults.
 */

/* ── Navigation structure ───────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: 'New',         href: '/new',         class: '' },
  {
    label: 'Engagement',
    href: '/engagement',
    class: 'has-dropdown',
    children: [
      { label: 'Engagement Rings',    href: '/engagement/rings' },
      { label: 'Wedding Bands',       href: '/engagement/bands' },
      { label: 'Bridal Sets',         href: '/engagement/bridal-sets' },
      { label: 'Build Your Own Ring', href: '/engagement/build' },
      { label: 'Diamond Guide',       href: '/engagement/diamond-guide' },
    ],
  },
  {
    label: 'Jewelry',
    href: '/jewelry',
    class: 'has-dropdown',
    children: [
      { label: 'Necklaces',  href: '/jewelry/necklaces' },
      { label: 'Earrings',   href: '/jewelry/earrings' },
      { label: 'Bracelets',  href: '/jewelry/bracelets' },
      { label: 'Rings',      href: '/jewelry/rings' },
      { label: 'Anklets',    href: '/jewelry/anklets' },
    ],
  },
  {
    label: 'Watches',
    href: '/watches',
    class: 'has-dropdown',
    children: [
      { label: "Women's Watches", href: '/watches/womens' },
      { label: "Men's Watches",   href: '/watches/mens' },
      { label: 'Luxury Watches',  href: '/watches/luxury' },
    ],
  },
  {
    label: 'Gifts',
    href: '/gifts',
    class: 'has-dropdown',
    children: [
      { label: 'Gifts Under $100', href: '/gifts/under-100' },
      { label: 'Gifts for Her',    href: '/gifts/for-her' },
      { label: 'Gifts for Him',    href: '/gifts/for-him' },
      { label: 'Gift Cards',       href: '/gifts/cards' },
    ],
  },
  {
    label: 'Collections',
    href: '/collections',
    class: 'has-dropdown',
    children: [
      { label: 'Holiday Collection', href: '/collections/holiday' },
      { label: 'Vera Wang Love',      href: '/collections/vera-wang' },
      { label: 'Disney Enchanted',    href: '/collections/disney' },
      { label: 'Endless Embrace',     href: '/collections/endless-embrace' },
    ],
  },
  { label: '✦ Customize', href: '/customize', class: 'nav-customize' },
  { label: 'Sale',        href: '/sale',      class: 'nav-sale' },
];

/* ── SVG Icons ──────────────────────────────────────────────────────────────── */
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

  chevronRight: `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;flex-shrink:0;">
    <polyline points="9,6 15,12 9,18"/>
  </svg>`,

  chevronDown: `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;">
    <polyline points="6,9 12,15 18,9"/>
  </svg>`,
};

/* ── Build primary nav HTML ─────────────────────────────────────────────────── */
function buildNav() {
  const items = NAV_ITEMS.map((item) => {
    const dropdownHTML = item.children
      ? `<div class="header-dropdown" role="menu">
           <ul>
             ${item.children.map((c) => `
               <li role="none">
                 <a href="${c.href}" role="menuitem">${c.label}</a>
               </li>`).join('')}
           </ul>
         </div>`
      : '';

    return `<li class="${item.class || ''}" role="none">
      <a href="${item.href}" role="menuitem">${item.label}</a>
      ${dropdownHTML}
    </li>`;
  }).join('');

  return `<nav class="header-nav" aria-label="Main navigation">
    <ul role="menubar">${items}</ul>
  </nav>`;
}

/* ── Build icon tray HTML ───────────────────────────────────────────────────── */
function buildIcons() {
  return `<div class="header-icons" role="list">
    <button
      class="header-icon-btn"
      aria-label="Search"
      aria-expanded="false"
      aria-controls="site-search"
      data-action="search"
      role="listitem"
    >
      ${ICONS.search}
      <span class="header-search-label" aria-hidden="true">Search</span>
    </button>

    <a href="/account" class="header-icon-btn" aria-label="My Account" role="listitem">
      ${ICONS.account}
    </a>

    <a href="/wishlist" class="header-icon-btn" aria-label="Wishlist" role="listitem">
      ${ICONS.heart}
    </a>

    <a href="/cart" class="header-icon-btn" aria-label="Shopping bag, 0 items" role="listitem">
      ${ICONS.bag}
      <span class="cart-count" aria-hidden="true" data-count="0">0</span>
    </a>
  </div>`;
}

/* ── Build search tray HTML ─────────────────────────────────────────────────── */
function buildSearchTray() {
  return `<div
    class="header-search-wrapper"
    id="site-search"
    role="search"
    aria-label="Site search"
  >
    <input
      type="search"
      class="header-search-input"
      placeholder="Search rings, necklaces, collections..."
      aria-label="Search Zales"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
    />
    <button
      class="header-search-close"
      aria-label="Close search"
      data-action="close-search"
    >
      ${ICONS.close}
    </button>
  </div>`;
}

/* ── Build mobile slide-in menu HTML ────────────────────────────────────────── */
function buildMobileMenu() {
  const mobileItems = NAV_ITEMS.map((item) => `
    <li class="${item.class || ''}" role="none">
      <a href="${item.href}" role="menuitem">
        ${item.label}
        ${item.children ? ICONS.chevronRight : ''}
      </a>
    </li>`).join('');

  return `
    <nav
      class="header-mobile-menu"
      id="mobile-menu"
      aria-label="Mobile navigation"
      aria-hidden="true"
    >
      <div class="mobile-menu-header">
        <span class="logo-wordmark" aria-hidden="true">ZALES</span>
        <button
          class="mobile-menu-close"
          aria-label="Close navigation menu"
          data-action="close-menu"
        >
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
    </nav>

    <div
      class="mobile-menu-overlay"
      aria-hidden="true"
      tabindex="-1"
    ></div>`;
}

/* ── Wire up interactive behaviors ─────────────────────────────────────────── */
function initBehaviors(headerEl) {
  const searchBtn   = headerEl.querySelector('[data-action="search"]');
  const searchTray  = headerEl.querySelector('#site-search');
  const searchInput = headerEl.querySelector('.header-search-input');
  const closeSearch = headerEl.querySelector('[data-action="close-search"]');
  const hamburger   = headerEl.querySelector('.header-hamburger');
  const mobileMenu  = headerEl.querySelector('#mobile-menu');
  const overlay     = headerEl.querySelector('.mobile-menu-overlay');
  const closeMobile = headerEl.querySelector('[data-action="close-menu"]');

  /* ── Search tray ── */
  function openSearch() {
    searchTray?.classList.add('open');
    searchBtn?.setAttribute('aria-expanded', 'true');
    window.requestAnimationFrame(() => searchInput?.focus());
  }

  function closeSearchTray() {
    searchTray?.classList.remove('open');
    searchBtn?.setAttribute('aria-expanded', 'false');
  }

  searchBtn?.addEventListener('click', () => {
    const isOpen = searchTray?.classList.contains('open');
    if (isOpen) closeSearchTray();
    else openSearch();
  });

  closeSearch?.addEventListener('click', closeSearchTray);

  /* ── Mobile menu ── */
  function openMobileMenu() {
    mobileMenu?.classList.add('open');
    mobileMenu?.setAttribute('aria-hidden', 'false');
    overlay?.classList.add('open');
    hamburger?.classList.add('open');
    hamburger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Focus first nav item for a11y
    window.requestAnimationFrame(() => {
      mobileMenu?.querySelector('a')?.focus();
    });
  }

  function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    overlay?.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    if (isOpen) closeMobileMenu();
    else openMobileMenu();
  });

  closeMobile?.addEventListener('click', closeMobileMenu);
  overlay?.addEventListener('click', closeMobileMenu);

  /* ── Escape key closes everything ── */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (searchTray?.classList.contains('open')) {
      closeSearchTray();
      searchBtn?.focus();
    }
    if (mobileMenu?.classList.contains('open')) {
      closeMobileMenu();
      hamburger?.focus();
    }
  });

  /* ── Scrolled state for shadow ── */
  window.addEventListener(
    'scroll',
    () => {
      headerEl.classList.toggle('scrolled', window.scrollY > 10);
    },
    { passive: true },
  );

  /* ── Mark active nav item based on current path ── */
  const currentPath = window.location.pathname;
  headerEl.querySelectorAll('.header-nav > ul > li > a').forEach((a) => {
    // Match exact path or if current path starts with the link's path (for sub-pages)
    if (
      a.getAttribute('href') === currentPath
      || (a.getAttribute('href') !== '/' && currentPath.startsWith(a.getAttribute('href')))
    ) {
      a.closest('li')?.classList.add('active');
    }
  });

  /* ── Cart count live update (hook for cart module) ── */
  document.addEventListener('zales:cart-updated', (e) => {
    const count = e.detail?.count ?? 0;
    const badge = headerEl.querySelector('.cart-count');
    if (badge) {
      badge.textContent = count;
      badge.setAttribute('data-count', count);
      const bagBtn = badge.closest('.header-icon-btn');
      if (bagBtn) {
        bagBtn.setAttribute('aria-label', `Shopping bag, ${count} item${count !== 1 ? 's' : ''}`);
      }
    }
  });
}

/* ── EDS block decorator ────────────────────────────────────────────────────── */
export default function decorate(block) {
  // The header block renders into the <header> element
  const headerEl = block.closest('header') ?? document.querySelector('header') ?? block;

  headerEl.innerHTML = `
    <div class="header-nav-wrapper">

      <button
        class="header-hamburger"
        aria-label="Open navigation menu"
        aria-expanded="false"
        aria-controls="mobile-menu"
      >
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
