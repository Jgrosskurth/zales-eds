/*
 * ZALES EDS — blocks/category-nav/category-nav.js
 * Grid of image tiles — "Shop by Category" navigation section.
 * Tiles reveal with stagger as they enter the viewport.
 *
 * EDS block table:
 *   Row 0: heading | subtitle  (optional — skipped if row has an image)
 *   Row 1+: image | tile label | tile link href
 *
 * Variant classes:
 *   .six-up — 6-column desktop grid
 */

const DEFAULT_CATEGORIES = [
  {
    name:    'Rings',
    href:    '/jewelry/rings',
    imgSrc:  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&q=80&auto=format&fit=crop',
    imgAlt:  'Shop Rings',
  },
  {
    name:    'Necklaces',
    href:    '/jewelry/necklaces',
    imgSrc:  'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&q=80&auto=format&fit=crop',
    imgAlt:  'Shop Necklaces',
  },
  {
    name:    'Earrings',
    href:    '/jewelry/earrings',
    imgSrc:  'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&q=80&auto=format&fit=crop',
    imgAlt:  'Shop Earrings',
  },
  {
    name:    'Bracelets',
    href:    '/jewelry/bracelets',
    imgSrc:  'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80&auto=format&fit=crop',
    imgAlt:  'Shop Bracelets',
  },
];

/**
 * Parse category tiles from block rows.
 * Cell order: image | name | link
 *
 * @param {Element[]} rows
 * @returns {object[]}
 */
function parseCategories(rows) {
  if (!rows.length) return DEFAULT_CATEGORIES;

  return rows.map((row) => {
    const cells    = [...row.querySelectorAll(':scope > div')];
    const pictureEl = cells[0]?.querySelector('picture') ?? null;
    const imgEl    = cells[0]?.querySelector('img') ?? null;
    const linkEl   = cells[2]?.querySelector('a') ?? cells[1]?.querySelector('a') ?? null;
    const nameText = cells[1]?.textContent.trim() ?? linkEl?.textContent.trim() ?? '';

    return {
      pictureEl: pictureEl,
      imgSrc:    !pictureEl ? (imgEl?.src ?? null) : null,
      imgAlt:    imgEl?.alt ?? pictureEl?.querySelector('img')?.alt ?? '',
      name:      nameText,
      href:      linkEl?.href ?? '#',
    };
  }).filter((c) => c.name);
}

/**
 * Build a single category tile element.
 *
 * @param {object} category
 * @returns {HTMLElement}
 */
function buildTile(category) {
  const tile     = document.createElement('a');
  tile.className = 'category-nav-tile';
  tile.href      = category.href;
  tile.setAttribute('aria-label', `Shop ${category.name}`);

  /* Image */
  if (category.pictureEl) {
    const pic = category.pictureEl.cloneNode(true);
    const img = pic.querySelector('img');
    if (img) {
      img.className = 'category-nav-tile-image';
      img.loading   = 'lazy';
      img.decoding  = 'async';
    }
    tile.appendChild(pic);
  } else if (category.imgSrc) {
    const img     = document.createElement('img');
    img.className = 'category-nav-tile-image';
    img.src       = category.imgSrc;
    img.alt       = category.imgAlt ?? category.name;
    img.loading   = 'lazy';
    img.decoding  = 'async';
    tile.appendChild(img);
  } else {
    const placeholder     = document.createElement('div');
    placeholder.className = 'category-nav-tile-placeholder';
    tile.appendChild(placeholder);
  }

  /* Label */
  const label     = document.createElement('div');
  label.className = 'category-nav-tile-label';
  label.setAttribute('aria-hidden', 'true');
  label.innerHTML = `
    <span class="category-nav-tile-name">${category.name}</span>
    <span class="category-nav-tile-arrow">→</span>
  `;
  tile.appendChild(label);

  return tile;
}

/**
 * Stagger reveal for tiles as they enter the viewport.
 *
 * @param {Element} grid
 */
function initReveal(grid) {
  const tiles = [...grid.querySelectorAll('.category-nav-tile')];

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
      threshold:  0.06,
      rootMargin: '9999px 0px 9999px 0px',
    },
  );

  tiles.forEach((tile) => io.observe(tile));
}

/* ── EDS block decorator ────────────────────────────────────────────────────── */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  /* Parse header row (must have no image) */
  let heading      = 'Shop by Category';
  let subtitle     = '';
  let categoryRows = rows;

  if (rows.length > 0) {
    const headerCells = [...rows[0].querySelectorAll(':scope > div')];
    const hasImage    = rows[0].querySelector('img') || rows[0].querySelector('picture');
    if (!hasImage && headerCells[0]?.textContent.trim()) {
      heading      = headerCells[0].textContent.trim();
      subtitle     = headerCells[1]?.textContent.trim() ?? '';
      categoryRows = rows.slice(1);
    }
  }

  const categories = parseCategories(categoryRows);

  /* Build DOM */
  block.innerHTML = `
    <div class="category-nav-header">
      <h2>${heading}</h2>
      ${subtitle ? `<p class="category-nav-subtitle">${subtitle}</p>` : ''}
    </div>
    <div class="category-nav-grid"></div>
  `;

  const grid = block.querySelector('.category-nav-grid');
  categories.forEach((cat) => grid.appendChild(buildTile(cat)));

  initReveal(grid);
}
