/* =============================================================================
   ZALES EDS — gift-guide.js
   Tabbed gift guide section with hero image + editorial split panels.

   Block table structure:
     Row 0: hero image | section title | subtitle
     Row 1: Tab label | tab panel headline | tab panel body | CTA link | product image
     Row 2: (repeat for each tab)
     ...
   ============================================================================= */

const DEFAULT_TABS = [
  {
    label: 'For Her',
    headline: 'Find Something As Unforgettable As She Is.',
    body: 'From diamond tennis bracelets to stackable rings and beyond — discover pieces that speak to her style.',
    ctaLabel: 'Shop Gifts For Her',
    ctaHref: '/gifts/for-her',
    imgSrc: 'https://images.unsplash.com/photo-1573408301185-9519f94815ae?w=800&q=80&auto=format&fit=crop',
    imgAlt: 'Elegant jewelry gifts for her',
  },
  {
    label: 'For Him',
    headline: 'The Gift He\'ll Wear Every Day.',
    body: 'Sleek chains, refined cufflinks, and classic watches — the perfect finishing touch for the man in your life.',
    ctaLabel: 'Shop Gifts For Him',
    ctaHref: '/gifts/for-him',
    imgSrc: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80&auto=format&fit=crop',
    imgAlt: 'Classic jewelry gifts for him',
  },
  {
    label: 'For You',
    headline: 'Because You Deserve It.',
    body: 'Treat yourself to a timeless piece. Our self-purchase collection is designed for the woman who has her own back.',
    ctaLabel: 'Shop For Yourself',
    ctaHref: '/gifts/for-you',
    imgSrc: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&auto=format&fit=crop',
    imgAlt: 'Self-gift jewelry collection',
  },
  {
    label: 'For Everyone',
    headline: 'Something Beautiful for Everyone on Your List.',
    body: 'Charm bracelets, birthstone jewelry, and gift sets that suit every taste and budget.',
    ctaLabel: 'Shop All Gifts',
    ctaHref: '/gifts',
    imgSrc: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&auto=format&fit=crop',
    imgAlt: 'Gifts for everyone collection',
  },
];

/**
 * Parse tabs from block rows.
 */
function parseTabs(rows) {
  if (!rows.length) return DEFAULT_TABS;

  return rows.map((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const imgEl = cells[4]?.querySelector('img') || cells[3]?.querySelector('img');
    const ctaEl = cells[3]?.querySelector('a') || cells[4]?.querySelector('a');
    return {
      label: cells[0]?.textContent.trim() || 'Tab',
      headline: cells[1]?.textContent.trim() || '',
      body: cells[2]?.textContent.trim() || '',
      ctaLabel: ctaEl?.textContent.trim() || 'Shop Now',
      ctaHref: ctaEl?.href || '#',
      imgSrc: imgEl?.src || null,
      imgAlt: imgEl?.alt || '',
    };
  });
}

/**
 * Build tab panel HTML.
 */
function buildPanel(tab, index) {
  const imgHTML = tab.imgSrc
    ? `<img src="${tab.imgSrc}" alt="${tab.imgAlt}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async"/>`
    : `<div style="width:100%;height:100%;background:linear-gradient(135deg,#e8e0f0,#d4c8e8);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:24px;color:var(--color-primary);opacity:0.4;">${tab.label}</div>`;

  return `
    <div class="gift-guide-panel${index === 0 ? ' active' : ''}" role="tabpanel" id="panel-${index}" aria-labelledby="tab-${index}">
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
 * Initialize tab switching behavior.
 */
function initTabs(block) {
  const tabButtons = [...block.querySelectorAll('.gift-guide-tab')];
  const panels = [...block.querySelectorAll('.gift-guide-panel')];

  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // Update tabs
      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Update panels
      panels.forEach((p) => p.classList.remove('active'));
      panels[index]?.classList.add('active');
    });

    // Arrow key navigation
    btn.addEventListener('keydown', (e) => {
      let target = null;
      if (e.key === 'ArrowRight') target = tabButtons[index + 1] || tabButtons[0];
      if (e.key === 'ArrowLeft') target = tabButtons[index - 1] || tabButtons[tabButtons.length - 1];
      if (target) {
        e.preventDefault();
        target.click();
        target.focus();
      }
    });
  });
}

/**
 * EDS block decorator.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Row 0: hero image | title | subtitle
  let heroImgSrc = 'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=1600&q=80&auto=format&fit=crop';
  let heroTitle = 'Holiday Gift Guide';
  let heroSubtitle = 'The Perfect Gift for Every Name on Your List';

  let tabRows = rows;

  if (rows.length > 0) {
    const headerCells = [...rows[0].querySelectorAll(':scope > div')];
    const heroImg = headerCells[0]?.querySelector('img');
    if (heroImg) heroImgSrc = heroImg.src;
    if (headerCells[1]?.textContent.trim()) heroTitle = headerCells[1].textContent.trim();
    if (headerCells[2]?.textContent.trim()) heroSubtitle = headerCells[2].textContent.trim();
    tabRows = rows.slice(1);
  }

  const tabs = parseTabs(tabRows);

  // Build tab buttons
  const tabButtonsHTML = tabs.map((tab, i) => `
    <button
      class="gift-guide-tab${i === 0 ? ' active' : ''}"
      role="tab"
      id="tab-${i}"
      aria-selected="${i === 0 ? 'true' : 'false'}"
      aria-controls="panel-${i}"
    >${tab.label}</button>`).join('');

  // Build panels
  const panelsHTML = tabs.map((tab, i) => buildPanel(tab, i)).join('');

  // Assemble block
  block.innerHTML = `
    <div class="gift-guide-hero">
      <img class="gift-guide-hero-image" src="${heroImgSrc}" alt="Holiday Gift Guide" loading="lazy" decoding="async"/>
      <div class="gift-guide-hero-overlay">
        <span class="gift-guide-eyebrow">Zales Presents</span>
        <h2 class="gift-guide-title">${heroTitle}</h2>
        <p class="gift-guide-subtitle">${heroSubtitle}</p>
      </div>
    </div>

    <div class="gift-guide-tabs" role="tablist" aria-label="Gift categories">
      ${tabButtonsHTML}
    </div>

    <div class="gift-guide-panels">
      ${panelsHTML}
    </div>
  `;

  initTabs(block);
}
