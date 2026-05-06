/* =============================================================================
   ZALES EDS — category-nav.js
   Grid of image tiles with label overlay.
   Variant: add 'six-up' class for 6-column grid.

   Block table structure:
     Row 0: heading | subtitle
     Row 1+: image | tile label | tile link href
   ============================================================================= */

const DEFAULT_CATEGORIES = [
  {
    name: 'Rings',
    href: '/jewelry/rings',
    imgSrc: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=500&q=80&auto=format&fit=crop',
    imgAlt: 'Shop Rings',
  },
  {
    name: 'Necklaces',
    href: '/jewelry/necklaces',
    imgSrc: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&q=80&auto=format&fit=crop',
    imgAlt: 'Shop Necklaces',
  },
  {
    name: 'Earrings',
    href: '/jewelry/earrings',
    imgSrc: 'https://images.unsplash.com/photo-1573408301185-9519f94815ae?w=500&q=80&auto=format&fit=crop',
    imgAlt: 'Shop Earrings',
  },
  {
    name: 'Bracelets',
    href: '/jewelry/bracelets',
    imgSrc: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80&auto=format&fit=crop',
    imgAlt: 'Shop Bracelets',
  },
];

/**
 * Parse categories from block rows.
 */
function parseCategories(rows) {
  if (!rows.length) return DEFAULT_CATEGORIES;

  return rows.map((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const imgEl = cells[0]?.querySelector('img');
    const linkEl = cells[2]?.querySelector('a') || cells[1]?.querySelector('a');
    return {
      imgSrc: imgEl?.src || null,
      imgAlt: imgEl?.alt || '',
      name: cells[1]?.textContent.trim() || linkEl?.textContent.trim() || '',
      href: linkEl?.href || '#',
    };
  }).filter((c) => c.name);
}

/**
 * Build a single tile element.
 */
function buildTile(category) {
  const tile = document.createElement('a');
  tile.className = 'category-nav-tile';
  tile.href = category.href;
  tile.setAttribute('aria-label', `Shop ${category.name}`);

  if (category.imgSrc) {
    const img = document.createElement('img');
    img.className = 'category-nav-tile-image';
    img.src = category.imgSrc;
    img.alt = category.imgAlt || category.name;
    img.loading = 'lazy';
    img.decoding = 'async';
    tile.appendChild(img);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'category-nav-tile-placeholder';
    tile.appendChild(placeholder);
  }

  const label = document.createElement('div');
  label.className = 'category-nav-tile-label';
  label.innerHTML = `
    <span class="category-nav-tile-name">${category.name}</span>
    <span class="category-nav-tile-arrow" aria-hidden="true">→</span>
  `;
  tile.appendChild(label);

  return tile;
}

/**
 * Stagger reveal via IntersectionObserver.
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
    { threshold: 0.06, rootMargin: '0px 0px -32px 0px' }
  );

  tiles.forEach((tile) => io.observe(tile));
}

/**
 * EDS block decorator.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  let heading = 'Shop by Category';
  let subtitle = '';
  let categoryRows = rows;

  if (rows.length > 0) {
    const headerCells = [...rows[0].querySelectorAll(':scope > div')];
    // Only treat as header if no image in row
    if (!rows[0].querySelector('img') && headerCells[0]?.textContent.trim()) {
      heading = headerCells[0].textContent.trim();
      subtitle = headerCells[1]?.textContent.trim() || '';
      categoryRows = rows.slice(1);
    }
  }

  const categories = parseCategories(categoryRows);

  // Build DOM
  block.innerHTML = `
    <div class="category-nav-header">
      <h2>${heading}</h2>
      ${subtitle ? `<p class="category-nav-subtitle">${subtitle}</p>` : ''}
    </div>
    <div class="category-nav-grid"></div>
  `;

  const grid = block.querySelector('.category-nav-grid');
  categories.forEach((cat) => {
    grid.appendChild(buildTile(cat));
  });

  initReveal(grid);
}
