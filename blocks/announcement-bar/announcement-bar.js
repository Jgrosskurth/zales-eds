/*
 * ZALES EDS — blocks/announcement-bar/announcement-bar.js
 * Reads rows from the EDS block table (one row = one promo message).
 * Renders the 3-col announcement bar with rotating carousel center.
 *
 * EDS block table format expected:
 *   | promo message 1 |
 *   | promo message 2 |
 *   | ...             |
 *
 * If no rows, falls back to three default holiday promos.
 */

/* ── SVG Icons ──────────────────────────────────────────────────────────────── */
const ICONS = {
  pin: `<svg class="utility-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8 1a4.5 4.5 0 0 1 4.5 4.5c0 3.15-4.5 9.5-4.5 9.5S3.5 8.65 3.5 5.5A4.5 4.5 0 0 1 8 1zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
  </svg>`,

  help: `<svg class="utility-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <text x="8" y="12" text-anchor="middle" font-size="9" font-weight="bold" fill="currentColor">?</text>
  </svg>`,

  calendar: `<svg class="utility-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1.5" y="3" width="13" height="11" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M1.5 6.5h13M5 1v3.5M11 1v3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  diamond: `<svg class="utility-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="8,1 15,6 8,15 1,6" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <polygon points="8,1 15,6 8,7.5 1,6" stroke="currentColor" stroke-width="1" fill="none" opacity="0.45"/>
  </svg>`,

  prev: `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polyline points="5,1 2,4 5,7"/>
  </svg>`,

  next: `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polyline points="3,1 6,4 3,7"/>
  </svg>`,
};

/* ── Default fallback promo messages ────────────────────────────────────────── */
const DEFAULT_MESSAGES = [
  'Holiday Sale! <strong>30% Off</strong> Sitewide — Shop Now',
  'Free Shipping on All Orders Over $99',
  'New: Discover the <strong>Holiday Collection</strong> — Limited Time',
];

/**
 * Extract promo messages from EDS block table rows.
 * Each row's text content becomes one carousel slide.
 *
 * @param {Element} block
 * @returns {string[]}
 */
function extractMessages(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return DEFAULT_MESSAGES;

  const messages = rows
    .map((row) => {
      // Preserve any inline HTML (e.g. <strong> tags from the document)
      const cell = row.querySelector(':scope > div') || row;
      return cell.innerHTML.trim();
    })
    .filter(Boolean);

  return messages.length ? messages : DEFAULT_MESSAGES;
}

/**
 * Build the full announcement bar HTML string.
 *
 * @param {string[]} messages
 * @returns {string}
 */
function buildHTML(messages) {
  const messageDivs = messages
    .map((msg, i) => `
      <div
        class="carousel-message${i === 0 ? ' active' : ''}"
        role="status"
        aria-live="${i === 0 ? 'polite' : 'off'}"
        aria-atomic="true"
      >${msg}</div>`)
    .join('');

  const dots = messages
    .map((_, i) => `<span class="carousel-dot${i === 0 ? ' active' : ''}" aria-hidden="true"></span>`)
    .join('');

  return `
    <div class="announcement-bar-inner">

      <div class="announcement-bar-left">
        <a href="/stores">${ICONS.pin}Find a Store</a>
        <span class="utility-divider" aria-hidden="true"></span>
        <a href="/help">${ICONS.help}Help</a>
      </div>

      <div class="announcement-bar-center">
        <div class="announcement-carousel" role="region" aria-label="Promotional announcements">
          <button class="carousel-btn carousel-prev" aria-label="Previous announcement">
            ${ICONS.prev}
          </button>
          <div class="carousel-messages">
            ${messageDivs}
          </div>
          <div class="carousel-dots" aria-hidden="true">
            ${dots}
          </div>
          <button class="carousel-btn carousel-next" aria-label="Next announcement">
            ${ICONS.next}
          </button>
        </div>
      </div>

      <div class="announcement-bar-right">
        <a href="/book-appointment">${ICONS.calendar}Book an Appointment</a>
        <span class="utility-divider" aria-hidden="true"></span>
        <a href="/vault-rewards">${ICONS.diamond}Vault Rewards</a>
      </div>

    </div>
  `;
}

/**
 * Initialize the promo carousel auto-advance + manual navigation.
 * - Auto-advances every 5 seconds
 * - Pauses on hover
 * - Pauses when document is hidden (tab switch)
 * - Crossfade + slide animation via CSS classes
 *
 * @param {Element} bar — the .announcement-bar element
 */
function initCarousel(bar) {
  const messages = [...bar.querySelectorAll('.carousel-message')];
  const dots     = [...bar.querySelectorAll('.carousel-dot')];
  const prevBtn  = bar.querySelector('.carousel-prev');
  const nextBtn  = bar.querySelector('.carousel-next');

  if (messages.length <= 1) return; // nothing to cycle

  let current       = 0;
  let timer         = null;
  let isTransition  = false;

  /**
   * Transition to a target index.
   * Adds CSS classes for the crossfade animation.
   */
  function goTo(index) {
    if (isTransition || index === current) return;
    isTransition = true;

    const outgoing = messages[current];
    const incoming = messages[index];

    // Fade out current
    outgoing.classList.add('exiting');
    outgoing.classList.remove('active');
    outgoing.setAttribute('aria-live', 'off');

    // Fade in next (next frame so browser paints the exit first)
    window.requestAnimationFrame(() => {
      incoming.classList.add('active');
      incoming.setAttribute('aria-live', 'polite');
    });

    // Update dots
    if (dots[current]) dots[current].classList.remove('active');
    if (dots[index])   dots[index].classList.add('active');

    current = index;

    // Clean up exiting class after transition completes
    window.setTimeout(() => {
      outgoing.classList.remove('exiting');
      isTransition = false;
    }, 400);
  }

  function advance()  { goTo((current + 1) % messages.length); }
  function retreat()  { goTo((current - 1 + messages.length) % messages.length); }

  function startTimer() {
    clearInterval(timer);
    timer = window.setInterval(advance, 5000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  /* Manual navigation — restart timer after manual click */
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      retreat();
      startTimer();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      advance();
      startTimer();
    });
  }

  /* Pause on hover */
  bar.addEventListener('mouseenter', stopTimer);
  bar.addEventListener('mouseleave', startTimer);

  /* Pause when tab is hidden */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
    else startTimer();
  });

  startTimer();
}

/**
 * EDS block decorator.
 *
 * @param {Element} block — the .announcement-bar div
 */
export default function decorate(block) {
  const messages = extractMessages(block);

  /* Replace block content with rendered markup */
  block.innerHTML = buildHTML(messages);

  /* Semantics */
  block.setAttribute('role', 'complementary');
  block.setAttribute('aria-label', 'Site announcements');

  /* Remove any padding the section wrapper might add */
  const section = block.closest('.section');
  if (section) {
    section.style.cssText = 'padding:0;margin:0;';
  }

  /* Start the carousel */
  initCarousel(block);
}
