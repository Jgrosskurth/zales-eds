/* =============================================================================
   ZALES EDS — scripts.js
   Main entry point. Runs on DOM ready. Orchestrates block loading and reveals.
   ============================================================================= */

import {
  loadBlocks,
  loadCSS,
  decorateLinks,
  decorateIcons,
} from './aem.js';

/**
 * Decorates the main element: wraps blocks, adds section classes.
 * @param {Element} main
 */
function decorateMain(main) {
  // Decorate all links
  decorateLinks(main);

  // Decorate icon shortcodes
  decorateIcons(main);

  // Add block data attributes from class names
  main.querySelectorAll('[class]').forEach((el) => {
    const first = el.classList[0];
    const knownBlocks = [
      'announcement-bar', 'header', 'hero', 'curated-looks', 'gift-guide',
      'editorial-text', 'product-carousel', 'split-banner', 'category-nav', 'footer',
    ];
    if (knownBlocks.includes(first)) {
      el.classList.add('block');
      el.dataset.blockName = first;
    }
  });
}

/**
 * Intersection Observer for scroll-reveal animations.
 */
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  document.querySelectorAll('.reveal, .stagger-reveal').forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Loads the header block.
 */
async function loadHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const block = document.createElement('div');
  block.classList.add('header', 'block');
  block.dataset.blockName = 'header';
  header.append(block);

  await loadBlockByName('header', block);
}

/**
 * Loads the footer block.
 */
async function loadFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;

  const block = document.createElement('div');
  block.classList.add('footer', 'block');
  block.dataset.blockName = 'footer';
  footer.append(block);

  await loadBlockByName('footer', block);
}

/**
 * Dynamically loads a block's CSS and JS.
 * @param {string} blockName
 * @param {Element} block
 */
async function loadBlockByName(blockName, block) {
  const cssPath = `/blocks/${blockName}/${blockName}.css`;
  const jsPath = `/blocks/${blockName}/${blockName}.js`;

  await loadCSS(cssPath).catch(() => {});

  try {
    const mod = await import(jsPath);
    if (mod.default) {
      await mod.default(block);
    }
  } catch (e) {
    console.warn(`[Zales EDS] Block load failed: ${blockName}`, e);
  }
}

/**
 * Loads non-critical CSS after LCP.
 */
async function loadLazy() {
  await loadCSS('/styles/lazy-styles.css');
  await import('./delayed.js');
}

/**
 * Main initialization.
 */
async function init() {
  const main = document.querySelector('main');
  if (main) {
    decorateMain(main);
    await loadBlocks(main);
  }

  await loadHeader();
  await loadFooter();

  // Reveal the page (prevents FOUC)
  document.body.classList.add('appear');

  // Kick off lazy loading after first paint
  window.requestAnimationFrame(() => {
    window.setTimeout(loadLazy, 100);
  });

  // Initialize scroll reveals after everything loads
  window.addEventListener('load', initScrollReveal);
}

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
