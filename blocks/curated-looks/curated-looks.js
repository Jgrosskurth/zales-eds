/*
 * ZALES EDS — blocks/curated-looks/curated-looks.js
 * 4-up editorial image grid with stagger reveal on scroll.
 *
 * EDS block table:
 *   Row 0: section heading | "View All" link
 *   Row 1+: image | product name | CTA href
 *
 * Falls back to DEFAULT_LOOKS if no content rows found.
 */

const DEFAULT_LOOKS = [
  {
    name: 'Diamond Solitaire',
    href: '/jewelry/rings/diamond-solitaire',
    imgSrc: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Diamond Solitaire Ring on velvet',
  },
  {
    name: 'Gold Necklace Edit',
    href: '/jewelry/necklaces/gold',
    imgSrc: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Gold necklace layered styling',
  },
  {
    name: 'Bridal Looks',
    href: '/engagement',
    imgSrc: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Bridal jewelry collection',
  },
  {
    name: 'Holiday Sparkle',
    href: '/collections/holiday',
    imgSrc: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80&auto=format&fit=crop',
    imgAlt: 'Holiday jewelry sparkle collection',
  },
];

/**
 * Parse looks from block rows.
 * Row format: | image | name | link |
 *
 * @param {Element[]} rows
 * @returns {object[]}
 */
function parseLooks(rows) {
  if (!rows.length) return DEFAULT_LOOKS;

  return rows.map((row) => {
    const cells    = [...row.querySelectorAll(':scope > div')];
    const pictureEl = cells[0]?.querySelector('picture');
    const imgEl    = cells[0]?.querySelector('img');
    const aEl      = cells[0]?.querySelector('a') ?? cells[2]?.querySelector('a');
    const nameEl   = cells[1];

    return {
      name:     nameEl?.textContent.trim() ?? 'Shop Now',
      href:     aEl?.href ?? '#',
      // Prefer picture element for srcset support; fall back to img src
      pictureEl: pictureEl ?? null,
      imgSrc:   !pictureEl ? (imgEl?.src ?? null) : null,
      imgAlt:   imgEl?.alt ?? pictureEl?.querySelector('img')?.alt ?? '',
    };
  }).filter((look) => look.name);
}

/**
 * Build a single curated look card element.
 *
 * @param {object} look
 * @returns {HTMLElement}
 */
function buildCard(look) {
  const card    = document.createElement('article');
  card.className = 'curated-look-card';

  /* Image / picture */
  if (look.pictureEl) {
    // Clone the EDS picture element, ensure lazy loading
    const pic = look.pictureEl.cloneNode(true);
    const img = pic.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.decoding = 'async';
      img.className = 'curated-look-card-image';
    }
    card.appendChild(pic);
  } else if (look.imgSrc) {
    const img    = document.createElement('img');
    img.className = 'curated-look-card-image';
    img.src       = look.imgSrc;
    img.alt       = look.imgAlt ?? look.name;
    img.loading   = 'eager';
    img.decoding  = 'async';
    card.appendChild(img);
  } else {
    const placeholder    = document.createElement('div');
    placeholder.className = 'curated-look-card-placeholder';
    placeholder.textContent = look.name;
    card.appendChild(placeholder);
  }

  /* Hover overlay */
  const overlay    = document.createElement('div');
  overlay.className = 'curated-look-card-overlay';
  overlay.innerHTML = `
    <p class="curated-look-card-name">${look.name}</p>
    <a href="${look.href}" class="curated-look-card-cta" aria-label="Shop ${look.name}" tabindex="-1">Shop Now</a>
  `;
  card.appendChild(overlay);

  /* Whole card is a link (a11y: role=link, Enter/Space activates) */
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'link');
  card.setAttribute('aria-label', `Shop ${look.name}`);

  card.addEventListener('click', () => {
    window.location.href = look.href;
  });
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = look.href;
    }
  });

  return card;
}

/**
 * Stagger reveal via IntersectionObserver.
 * Each card becomes visible as it enters the viewport.
 *
 * @param {Element} grid
 */
function initStaggerReveal(grid) {
  const cards = [...grid.querySelectorAll('.curated-look-card')];

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold:  0.08,
      rootMargin: '9999px 0px 9999px 0px',
    },
  );

  cards.forEach((card) => io.observe(card));
}

/* ── EDS block decorator ────────────────────────────────────────────────────── */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  /* Header row */
  let heading     = 'Curated Looks';
  let viewAllHref = '/jewelry';
  let lookRows    = [];

  if (rows.length > 0) {
    const headerCells = [...rows[0].querySelectorAll(':scope > div')];
    heading           = headerCells[0]?.textContent.trim() || heading;
    const viewAllLink = headerCells[1]?.querySelector('a');
    if (viewAllLink) viewAllHref = viewAllLink.href;
    lookRows = rows.slice(1);
  }

  const looks = parseLooks(lookRows);

  /* Build DOM */
  block.innerHTML = `
    <div class="curated-looks-header">
      <h2 class="curated-looks-title">${heading}</h2>
      <a href="${viewAllHref}" class="curated-looks-link">View All</a>
    </div>
    <div class="curated-looks-grid"></div>
  `;

  const grid = block.querySelector('.curated-looks-grid');
  looks.forEach((look) => grid.appendChild(buildCard(look)));

  initStaggerReveal(grid);
}
