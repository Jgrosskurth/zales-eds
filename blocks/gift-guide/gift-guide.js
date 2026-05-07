/*
 * ZALES EDS — blocks/gift-guide/gift-guide.js
 * Tabbed gift guide: hero banner + FOR HER | FOR HIM | FOR YOU | FOR EVERYONE
 * Each tab has a portrait thumbnail, label, and full editorial split panel.
 *
 * EDS block table:
 *   Row 0: hero image | section title | subtitle
 *   Row 1+: tab label | panel headline | panel body | CTA link | tab thumbnail image
 *
 * Falls back to DEFAULT_TABS if no content rows provided.
 */

const DEFAULT_TABS = [
  {
    label:    'For Her',
    headline: 'Find Something As Unforgettable As She Is.',
    body:     'From diamond tennis bracelets to stackable rings and beyond — discover pieces that speak to her style.',
    ctaLabel: 'Shop Gifts For Her',
    ctaHref:  '/gifts/for-her',
    imgSrc:   'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80&auto=format&fit=crop',
    imgAlt:   'Elegant jewelry gifts for her',
    thumbSrc: 'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=120&q=70&auto=format&fit=crop',
    thumbAlt: 'For Her tab',
  },
  {
    label:    'For Him',
    headline: "The Gift He'll Wear Every Day.",
    body:     'Sleek chains, refined cufflinks, and classic watches — the perfect finishing touch for the man in your life.',
    ctaLabel: 'Shop Gifts For Him',
    ctaHref:  '/gifts/for-him',
    imgSrc:   'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80&auto=format&fit=crop',
    imgAlt:   'Classic jewelry gifts for him',
    thumbSrc: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=120&q=70&auto=format&fit=crop',
    thumbAlt: 'For Him tab',
  },
  {
    label:    'For You',
    headline: 'Because You Deserve It.',
    body:     'Treat yourself to a timeless piece. Our self-purchase collection is designed for the woman who has her own back.',
    ctaLabel: 'Shop For Yourself',
    ctaHref:  '/gifts/for-you',
    imgSrc:   'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&auto=format&fit=crop',
    imgAlt:   'Self-gift jewelry collection',
    thumbSrc: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=120&q=70&auto=format&fit=crop',
    thumbAlt: 'For You tab',
  },
  {
    label:    'For Everyone',
    headline: 'Something Beautiful for Everyone on Your List.',
    body:     'Charm bracelets, birthstone jewelry, and gift sets that suit every taste and budget.',
    ctaLabel: 'Shop All Gifts',
    ctaHref:  '/gifts',
    imgSrc:   'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&auto=format&fit=crop',
    imgAlt:   'Gifts for everyone',
    thumbSrc: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=120&q=70&auto=format&fit=crop',
    thumbAlt: 'For Everyone tab',
  },
];

/**
 * Parse tab data from block rows.
 * Row cell order: label | headline | body | CTA link | panel image | thumbnail image
 *
 * @param {Element[]} rows
 * @returns {object[]}
 */
function parseTabs(rows) {
  if (!rows.length) return DEFAULT_TABS;

  return rows.map((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    // Panel image (cell 4 preferred, cell 3 fallback)
    const panelImgEl  = cells[4]?.querySelector('img') ?? cells[3]?.querySelector('img') ?? null;
    const panelPicEl  = cells[4]?.querySelector('picture') ?? cells[3]?.querySelector('picture') ?? null;

    // Thumbnail (cell 5, or reuse panel image)
    const thumbImgEl  = cells[5]?.querySelector('img') ?? panelImgEl;
    const thumbPicEl  = cells[5]?.querySelector('picture') ?? null;

    // CTA
    const ctaEl = cells[3]?.querySelector('a') ?? cells[4]?.querySelector('a') ?? null;

    const def = DEFAULT_TABS[i] ?? {};
    return {
      label:    cells[0]?.textContent.trim() || def.label || `Tab ${i + 1}`,
      headline: cells[1]?.textContent.trim() || def.headline || '',
      body:     cells[2]?.textContent.trim() || def.body || '',
      ctaLabel: ctaEl?.textContent.trim() || def.ctaLabel || 'Shop Now',
      ctaHref:  ctaEl?.href || def.ctaHref || '#',
      imgSrc:   !panelPicEl ? (panelImgEl?.src ?? def.imgSrc ?? null) : null,
      imgAlt:   panelImgEl?.alt ?? panelPicEl?.querySelector('img')?.alt ?? def.imgAlt ?? '',
      panelPicEl: panelPicEl ?? null,
      thumbSrc:  !thumbPicEl ? (thumbImgEl?.src ?? def.thumbSrc ?? null) : null,
      thumbAlt:  thumbImgEl?.alt ?? def.thumbAlt ?? '',
      thumbPicEl: thumbPicEl ?? null,
    };
  });
}

/**
 * Build a tab button with optional thumbnail image.
 *
 * @param {object} tab
 * @param {number} index
 * @returns {string} HTML
 */
function buildTabButton(tab, index) {
  let thumbHTML = '';

  if (tab.thumbPicEl) {
    // Clone picture element for the tab thumbnail
    const pic = tab.thumbPicEl.cloneNode(true);
    const img = pic.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = tab.thumbAlt;
      img.removeAttribute('width');
      img.removeAttribute('height');
    }
    thumbHTML = `<div class="gift-guide-tab-thumb">${pic.outerHTML}</div>`;
  } else if (tab.thumbSrc) {
    thumbHTML = `<div class="gift-guide-tab-thumb">
      <img src="${tab.thumbSrc}" alt="${tab.thumbAlt}" loading="lazy" decoding="async"/>
    </div>`;
  }

  return `
    <button
      class="gift-guide-tab${index === 0 ? ' active' : ''}"
      role="tab"
      id="tab-${index}"
      aria-selected="${index === 0 ? 'true' : 'false'}"
      aria-controls="panel-${index}"
    >
      ${thumbHTML}
      <span>${tab.label}</span>
    </button>`;
}

/**
 * Build a tab panel with split layout: text left, image right.
 *
 * @param {object} tab
 * @param {number} index
 * @returns {string} HTML
 */
function buildPanel(tab, index) {
  let imgHTML = '';

  if (tab.panelPicEl) {
    const pic = tab.panelPicEl.cloneNode(true);
    const img = pic.querySelector('img');
    if (img) {
      img.loading = index === 0 ? 'eager' : 'lazy';
      img.decoding = 'async';
    }
    imgHTML = pic.outerHTML;
  } else if (tab.imgSrc) {
    imgHTML = `<img
      src="${tab.imgSrc}"
      alt="${tab.imgAlt}"
      loading="${index === 0 ? 'eager' : 'lazy'}"
      decoding="async"
    />`;
  } else {
    imgHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#e8e0f0,#d4c8e8);display:flex;align-items:center;justify-content:center;font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;color:#2B1650;opacity:0.4;">${tab.label}</div>`;
  }

  return `
    <div
      class="gift-guide-panel${index === 0 ? ' active' : ''}"
      role="tabpanel"
      id="panel-${index}"
      aria-labelledby="tab-${index}"
      ${index !== 0 ? 'hidden' : ''}
    >
      <div class="gift-guide-panel-text">
        <span class="gift-guide-panel-label">Gift Guide</span>
        <h3 class="gift-guide-panel-headline">${tab.headline}</h3>
        <p class="gift-guide-panel-body">${tab.body}</p>
        <a href="${tab.ctaHref}" class="gift-guide-panel-cta">${tab.ctaLabel}</a>
      </div>
      <div class="gift-guide-panel-image">
        ${imgHTML}
      </div>
    </div>`;
}

/**
 * Initialize tab switching with keyboard support.
 *
 * @param {Element} block
 */
function initTabs(block) {
  const tabButtons = [...block.querySelectorAll('.gift-guide-tab')];
  const panels     = [...block.querySelectorAll('.gift-guide-panel')];

  function activateTab(index) {
    tabButtons.forEach((btn, i) => {
      const isActive = i === index;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel, i) => {
      const isActive = i === index;
      panel.classList.toggle('active', isActive);
      if (isActive) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', '');
      }
    });
  }

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => activateTab(index));

    /* Arrow key navigation (ARIA tabs pattern) */
    btn.addEventListener('keydown', (e) => {
      let target = null;
      if (e.key === 'ArrowRight') {
        target = tabButtons[(index + 1) % tabButtons.length];
      } else if (e.key === 'ArrowLeft') {
        target = tabButtons[(index - 1 + tabButtons.length) % tabButtons.length];
      } else if (e.key === 'Home') {
        target = tabButtons[0];
      } else if (e.key === 'End') {
        target = tabButtons[tabButtons.length - 1];
      }
      if (target) {
        e.preventDefault();
        target.click();
        target.focus();
      }
    });
  });
}

/* ── EDS block decorator ────────────────────────────────────────────────────── */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  /* Parse hero row */
  let heroImgSrc   = 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1600&q=80&auto=format&fit=crop';
  let heroImgEl    = null;
  let heroPicEl    = null;
  let heroTitle    = 'Holiday Gift Guide';
  let heroSubtitle = 'The Perfect Gift for Every Name on Your List';
  let tabRows      = rows;

  if (rows.length > 0) {
    const headerCells = [...rows[0].querySelectorAll(':scope > div')];
    heroPicEl         = headerCells[0]?.querySelector('picture') ?? null;
    heroImgEl         = headerCells[0]?.querySelector('img') ?? null;
    if (heroImgEl && !heroPicEl) heroImgSrc = heroImgEl.src;
    if (headerCells[1]?.textContent.trim()) heroTitle    = headerCells[1].textContent.trim();
    if (headerCells[2]?.textContent.trim()) heroSubtitle = headerCells[2].textContent.trim();
    tabRows = rows.slice(1);
  }

  const tabs = parseTabs(tabRows);

  /* Hero image HTML */
  let heroImgHTML = '';
  if (heroPicEl) {
    const pic = heroPicEl.cloneNode(true);
    const img = pic.querySelector('img');
    if (img) { img.loading = 'lazy'; img.decoding = 'async'; }
    heroImgHTML = pic.outerHTML;
  } else {
    heroImgHTML = `<img class="gift-guide-hero-image" src="${heroImgSrc}" alt="Holiday Gift Guide" loading="lazy" decoding="async"/>`;
  }

  /* Tab buttons + panels */
  const tabButtonsHTML = tabs.map((tab, i) => buildTabButton(tab, i)).join('');
  const panelsHTML     = tabs.map((tab, i) => buildPanel(tab, i)).join('');

  /* Assemble */
  block.innerHTML = `
    <div class="gift-guide-hero">
      ${heroImgHTML}
      <div class="gift-guide-hero-overlay">
        <span class="gift-guide-eyebrow">Zales Presents</span>
        <h2 class="gift-guide-title">${heroTitle}</h2>
        <p class="gift-guide-subtitle">${heroSubtitle}</p>
      </div>
    </div>

    <div class="gift-guide-tabs" role="tablist" aria-label="Gift guide categories">
      ${tabButtonsHTML}
    </div>

    <div class="gift-guide-panels">
      ${panelsHTML}
    </div>
  `;

  initTabs(block);
}
