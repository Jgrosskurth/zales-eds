/*
 * ZALES EDS — blocks/product-carousel/product-carousel.js
 * Horizontal snap-scrolling product card carousel with arrow navigation
 * and per-card wishlist toggle.
 *
 * EDS block table:
 *   Row 0: section heading | "View All" link   (optional — skipped if row has img)
 *   Row 1+: product image | name | price | sale price | product link
 *
 * Falls back to DEFAULT_PRODUCTS if no content rows provided.
 */

/* ── SVG icons ──────────────────────────────────────────────────────────────── */
const HEART_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
</svg>`;

const ARROW_LEFT = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <polyline points="15,18 9,12 15,6"/>
</svg>`;

const ARROW_RIGHT = `<svg viewBox="0 0 24 24" aria-hidden="true">
  <polyline points="9,18 15,12 9,6"/>
</svg>`;

/* ── Default fallback products ──────────────────────────────────────────────── */
const DEFAULT_PRODUCTS = [
  {
    name:      '14K White Gold Round Diamond Solitaire Ring',
    price:     '$1,299',
    salePrice: null,
    href:      '/jewelry/rings/diamond-solitaire',
    imgSrc:    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80&auto=format&fit=crop',
    imgAlt:    'Diamond Solitaire Ring',
  },
  {
    name:      'Diamond Tennis Bracelet in Sterling Silver',
    price:     '$599',
    salePrice: '$419',
    href:      '/jewelry/bracelets/tennis',
    imgSrc:    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80&auto=format&fit=crop',
    imgAlt:    'Diamond Tennis Bracelet',
  },
  {
    name:      'Yellow Gold Hoop Earrings — Classic Collection',
    price:     '$349',
    salePrice: null,
    href:      '/jewelry/earrings/hoops',
    imgSrc:    'https://images.unsplash.com/photo-1573408301185-9519f94815ae?w=400&q=80&auto=format&fit=crop',
    imgAlt:    'Gold Hoop Earrings',
  },
  {
    name:      'Aquamarine & Diamond Pendant Necklace',
    price:     '$799',
    salePrice: null,
    href:      '/jewelry/necklaces/aquamarine-diamond',
    imgSrc:    'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80&auto=format&fit=crop',
    imgAlt:    'Aquamarine Diamond Pendant',
  },
  {
    name:      'Rose Gold Stackable Band Set — 3 Piece',
    price:     '$449',
    salePrice: '$314',
    href:      '/jewelry/rings/stackable',
    imgSrc:    'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80&auto=format&fit=crop',
    imgAlt:    'Rose Gold Stackable Rings',
  },
  {
    name:      'Sapphire Three-Stone Engagement Ring',
    price:     '$2,199',
    salePrice: null,
    href:      '/engagement/rings/sapphire-three-stone',
    imgSrc:    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80&auto=format&fit=crop',
    imgAlt:    'Sapphire Three Stone Ring',
  },
];

/**
 * Parse product rows from the block table.
 * Cell order: image | name | price | sale price | link
 *
 * @param {Element[]} rows
 * @returns {object[]}
 */
function parseProducts(rows) {
  if (!rows.length) return DEFAULT_PRODUCTS;

  return rows.map((row) => {
    const cells    = [...row.querySelectorAll(':scope > div')];
    const pictureEl = cells[0]?.querySelector('picture') ?? null;
    const imgEl    = cells[0]?.querySelector('img') ?? null;
    const linkEl   = cells[4]?.querySelector('a') ?? cells[3]?.querySelector('a') ?? null;
    const saleText = cells[3]?.textContent.trim();

    return {
      pictureEl: pictureEl,
      imgSrc:    !pictureEl ? (imgEl?.src ?? null) : null,
      imgAlt:    imgEl?.alt ?? pictureEl?.querySelector('img')?.alt ?? '',
      name:      cells[1]?.textContent.trim() ?? '',
      price:     cells[2]?.textContent.trim() ?? '',
      salePrice: (saleText && saleText !== cells[2]?.textContent.trim()) ? saleText : null,
      href:      linkEl?.href ?? '#',
    };
  }).filter((p) => p.name);
}

/**
 * Build a single product card element.
 *
 * @param {object} product
 * @param {number} index
 * @returns {HTMLElement}
 */
function buildProductCard(product, index) {
  const card     = document.createElement('div');
  card.className = 'product-card';

  /* Price HTML */
  const priceHTML = product.salePrice
    ? `<span class="was">${product.price}</span><span class="sale">${product.salePrice}</span>`
    : product.price;

  /* Image HTML */
  let imgHTML = '';
  if (product.pictureEl) {
    const pic = product.pictureEl.cloneNode(true);
    const img = pic.querySelector('img');
    if (img) {
      img.className    = 'product-card-image';
      img.loading      = index < 4 ? 'eager' : 'lazy';
      img.decoding     = 'async';
    }
    imgHTML = pic.outerHTML;
  } else if (product.imgSrc) {
    imgHTML = `<img
      class="product-card-image"
      src="${product.imgSrc}"
      alt="${product.imgAlt}"
      loading="${index < 4 ? 'eager' : 'lazy'}"
      decoding="async"
    />`;
  } else {
    imgHTML = `<div class="product-card-placeholder">${product.name}</div>`;
  }

  card.innerHTML = `
    <a href="${product.href}" class="product-card-link">
      <div class="product-card-image-wrapper">
        ${imgHTML}
        <button
          class="product-card-wishlist"
          aria-label="Add ${product.name} to wishlist"
          data-index="${index}"
        >
          ${HEART_ICON}
        </button>
      </div>
      <div class="product-card-info">
        <p class="product-card-name">${product.name}</p>
        <p class="product-card-price">${priceHTML}</p>
      </div>
    </a>
  `;

  /* Wishlist toggle — prevent link navigation */
  const wishBtn = card.querySelector('.product-card-wishlist');
  wishBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nowActive = wishBtn.classList.toggle('active');
    const action    = nowActive ? 'Remove' : 'Add';
    const prep      = nowActive ? 'from' : 'to';
    wishBtn.setAttribute('aria-label', `${action} ${product.name} ${prep} wishlist`);
  });

  return card;
}

/**
 * Initialize prev/next arrow button behavior.
 * Scrolls by ~3 card widths per click.
 *
 * @param {Element} wrapper — .product-carousel-track-wrapper
 */
function initArrows(wrapper) {
  const track   = wrapper.querySelector('.product-carousel-track');
  const prevBtn = wrapper.querySelector('.carousel-arrow.prev');
  const nextBtn = wrapper.querySelector('.carousel-arrow.next');

  if (!track || !prevBtn || !nextBtn) return;

  function updateArrowState() {
    const atStart = track.scrollLeft <= 4;
    const atEnd   = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    prevBtn.disabled = atStart;
    nextBtn.disabled = atEnd;
    prevBtn.setAttribute('aria-disabled', atStart ? 'true' : 'false');
    nextBtn.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
  }

  function scrollPages(direction) {
    const card        = track.querySelector('.product-card');
    const gap         = parseInt(window.getComputedStyle(track).gap, 10) || 16;
    const cardWidth   = card ? card.offsetWidth + gap : 270;
    // Scroll by ~3 cards
    const scrollAmt   = cardWidth * 3;
    track.scrollBy({ left: direction * scrollAmt, behavior: 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollPages(-1));
  nextBtn.addEventListener('click', () => scrollPages(1));

  track.addEventListener('scroll', updateArrowState, { passive: true });

  /* Respond to window resize (card widths change) */
  const ro = new ResizeObserver(updateArrowState);
  ro.observe(track);

  updateArrowState();
}

/* ── EDS block decorator ────────────────────────────────────────────────────── */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  /* Parse header row */
  let heading     = 'Trending Now';
  let viewAllHref = '/jewelry';
  let productRows = rows;

  if (rows.length > 0) {
    const headerCells   = [...rows[0].querySelectorAll(':scope > div')];
    const possibleTitle = headerCells[0]?.textContent.trim();
    const possibleLink  = headerCells[1]?.querySelector('a');
    /* Only treat as header row if it has no image */
    if (!rows[0].querySelector('img') && !rows[0].querySelector('picture') && possibleTitle) {
      heading     = possibleTitle;
      if (possibleLink) viewAllHref = possibleLink.href;
      productRows = rows.slice(1);
    }
  }

  const products = parseProducts(productRows);

  /* Build DOM */
  block.innerHTML = `
    <div class="product-carousel-header">
      <h2 class="product-carousel-title">${heading}</h2>
      <a href="${viewAllHref}" class="product-carousel-view-all">View All</a>
    </div>
    <div class="product-carousel-track-wrapper">
      <button class="carousel-arrow prev" aria-label="Previous products" disabled>
        ${ARROW_LEFT}
      </button>
      <div class="product-carousel-track" role="list" aria-label="${heading}"></div>
      <button class="carousel-arrow next" aria-label="Next products">
        ${ARROW_RIGHT}
      </button>
    </div>
  `;

  const track = block.querySelector('.product-carousel-track');
  products.forEach((product, i) => {
    const card = buildProductCard(product, i);
    card.setAttribute('role', 'listitem');
    track.appendChild(card);
  });

  initArrows(block.querySelector('.product-carousel-track-wrapper'));
}
