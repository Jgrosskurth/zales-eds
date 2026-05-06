/* =============================================================================
   ZALES EDS — announcement-bar.js
   Reads rows from the block table (one row = one message).
   Renders a carousel with auto-advance and prev/next buttons.
   ============================================================================= */

const ICONS = {
  pin: `<svg class="utility-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M8 1a4.5 4.5 0 0 1 4.5 4.5c0 3.15-4.5 9.5-4.5 9.5S3.5 8.65 3.5 5.5A4.5 4.5 0 0 1 8 1zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
  </svg>`,
  help: `<svg class="utility-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <text x="8" y="12" text-anchor="middle" font-size="9" font-weight="bold" fill="currentColor">?</text>
  </svg>`,
  calendar: `<svg class="utility-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1.5" y="3" width="13" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <path d="M1.5 7h13M5 1v4M11 1v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,
  diamond: `<svg class="utility-icon" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="8,1 15,6 8,15 1,6" stroke="currentColor" stroke-width="1.5" fill="none"/>
    <polygon points="8,1 15,6 8,8 1,6" stroke="currentColor" stroke-width="1" fill="none" opacity="0.5"/>
  </svg>`,
  prev: `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polyline points="5,1 2,4 5,7"/>
  </svg>`,
  next: `<svg viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polyline points="3,1 6,4 3,7"/>
  </svg>`,
};

/**
 * Builds the announcement bar structure.
 * @param {string[]} messages - array of HTML message strings
 * @returns {string} HTML string
 */
function buildHTML(messages) {
  const messageDivs = messages
    .map((msg, i) => `<div class="carousel-message${i === 0 ? ' active' : ''}" role="status" aria-live="${i === 0 ? 'polite' : 'off'}">${msg}</div>`)
    .join('');

  const dots = messages
    .map((_, i) => `<span class="carousel-dot${i === 0 ? ' active' : ''}" aria-hidden="true"></span>`)
    .join('');

  return `
    <div class="announcement-bar-inner">
      <div class="announcement-bar-left">
        <a href="/stores">${ICONS.pin} Find a Store</a>
        <span class="utility-divider" aria-hidden="true"></span>
        <a href="/help">${ICONS.help} Help</a>
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
        <a href="/book-appointment">${ICONS.calendar} Book an Appointment</a>
        <span class="utility-divider" aria-hidden="true"></span>
        <a href="/vault-rewards">${ICONS.diamond} Vault Rewards</a>
      </div>
    </div>
  `;
}

/**
 * Extracts messages from the EDS block table rows.
 * Falls back to default messages if none provided.
 * @param {Element} block
 * @returns {string[]}
 */
function extractMessages(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (rows.length === 0) {
    return [
      'Holiday Sale! <strong>30% Off</strong> Sitewide — Shop Now',
      'Free Shipping on Orders Over $99',
      'New Arrivals: Discover the <strong>Holiday Collection</strong>',
    ];
  }
  return rows.map((row) => row.textContent.trim()).filter(Boolean);
}

/**
 * Carousel controller.
 */
function initCarousel(bar) {
  const messages = [...bar.querySelectorAll('.carousel-message')];
  const dots = [...bar.querySelectorAll('.carousel-dot')];
  const prevBtn = bar.querySelector('.carousel-prev');
  const nextBtn = bar.querySelector('.carousel-next');
  let current = 0;
  let timer = null;
  let isTransitioning = false;

  function goTo(index, direction = 'next') {
    if (isTransitioning || messages.length <= 1) return;
    isTransitioning = true;

    const outgoing = messages[current];
    const incoming = messages[index];

    // Mark outgoing
    outgoing.classList.add('exiting');
    outgoing.classList.remove('active');
    outgoing.setAttribute('aria-live', 'off');

    // Schedule incoming
    window.requestAnimationFrame(() => {
      incoming.classList.add('active');
      incoming.setAttribute('aria-live', 'polite');
    });

    // Update dots
    if (dots[current]) dots[current].classList.remove('active');
    if (dots[index]) dots[index].classList.add('active');

    current = index;

    // Clean up after transition
    window.setTimeout(() => {
      outgoing.classList.remove('exiting');
      isTransitioning = false;
    }, 420);
  }

  function next() {
    const idx = (current + 1) % messages.length;
    goTo(idx, 'next');
  }

  function prev() {
    const idx = (current - 1 + messages.length) % messages.length;
    goTo(idx, 'prev');
  }

  function startTimer() {
    clearInterval(timer);
    timer = window.setInterval(next, 5000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startTimer(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startTimer(); });

  // Pause on hover
  bar.addEventListener('mouseenter', stopTimer);
  bar.addEventListener('mouseleave', startTimer);

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTimer();
    else startTimer();
  });

  startTimer();
}

/**
 * EDS block decorator.
 * @param {Element} block
 */
export default function decorate(block) {
  const messages = extractMessages(block);

  // Replace block content with rendered HTML
  block.innerHTML = buildHTML(messages);

  // Add the bar to the top of the document
  block.setAttribute('role', 'complementary');
  block.setAttribute('aria-label', 'Site announcements');

  // Make it occupy the full bar slot
  const section = block.closest('.section') || block.parentElement;
  if (section) {
    section.style.padding = '0';
    section.style.margin = '0';
  }

  // Init carousel only if multiple messages
  if (messages.length > 1) {
    initCarousel(block);
  }
}
