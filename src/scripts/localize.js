javascript
/**
 * localize.js - Client-side localization script
 * Replaces English strings with Chinese on static pages.
 * Also handles dynamic text replacement via MutationObserver.
 *
 * @module localize
 * @version 1.0.0
 */

(() => {
  'use strict';

  /**
   * @typedef {Object<string, string>} TranslationMap
   */

  /**
   * Translation map from English to Chinese.
   * Keys must exactly match the text as it appears in the DOM.
   * @type {TranslationMap}
   */
  const translations = {
    "Website's Design": '网站设计',
    'bjutswift.cn color palette': 'bjutswift.cn 色彩方案',
    'Font Family: Inter': '字体家族：Inter',
    'White Background': '浅色背景',
    'Dark Background': '深色背景',
  };

  /**
   * @constant {string} LOG_PREFIX - Prefix for all log messages.
   */
  const LOG_PREFIX = '[Localize]';

  /**
   * @constant {boolean} VERBOSE - Enable detailed logging in development.
   * Should be set to `false` in production builds.
   */
  const VERBOSE = true;

  /**
   * A lightweight logger that respects verbosity and log levels.
   * @namespace
   */
  const logger = {
    /** @param {...*} args */
    info(...args) {
      if (VERBOSE) console.info(LOG_PREFIX, ...args);
    },
    /** @param {...*} args */
    warn(...args) {
      console.warn(LOG_PREFIX, ...args);
    },
    /** @param {...*} args */
    error(...args) {
      console.error(LOG_PREFIX, ...args);
    },
  };

  /**
   * Replace all occurrences of English strings with their Chinese translations
   * within the given text node. Performs replacement based on the translation map.
   *
   * @param {Node} node - DOM text node to process.
   * @returns {boolean} Whether a replacement occurred.
   * @throws {TypeError} If node is not a valid Node.
   */
  function replaceTextInNode(node) {
    if (!(node instanceof Node)) {
      throw new TypeError('node must be a valid DOM Node');
    }

    if (node.nodeType !== Node.TEXT_NODE || !node.textContent) {
      return false;
    }

    let original = node.textContent;
    let modified = false;

    for (const [en, zh] of Object.entries(translations)) {
      if (original.includes(en)) {
        original = original.split(en).join(zh);
        modified = true;
      }
    }

    if (modified) {
      node.textContent = original;
    }

    return modified;
  }

  /**
   * Walk through all child text nodes of a given element and apply text replacement.
   * Uses a TreeWalker for optimal performance.
   *
   * @param {Element} root - Root element to traverse. Must be an Element node.
   * @returns {number} Count of nodes that were replaced.
   * @throws {TypeError} If root is not an Element.
   */
  function replaceInElement(root) {
    if (!(root instanceof Element)) {
      throw new TypeError('root must be a DOM Element');
    }

    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let count = 0;
    let node;

    try {
      while ((node = /** @type {Text} */ (walker.nextNode())) !== null) {
        if (replaceTextInNode(node)) {
          count++;
        }
      }
    } catch (err) {
      logger.error('TreeWalker error while walking element:', root, err);
    }

    return count;
  }

  /**
   * Initialize localization on document load and set up a MutationObserver
   * for dynamically added content.
   *
   * - Replaces static text on first run.
   * - Watches for new nodes being inserted and translates them.
   *
   * @returns {void}
   */
  function initLocalization() {
    if (!document.body) {
      logger.warn('document.body not ready, deferring initialization.');
      return;
    }

    // Initial pass: translate existing content
    try {
      const initialCount = replaceInElement(document.body);
      if (initialCount > 0) {
        logger.info(`Replaced ${initialCount} nodes on initial load.`);
      }
    } catch (err) {
      logger.error('Initial replacement error:', err);
    }

    // Observe DOM changes for dynamically added content
    const observer = new MutationObserver((mutations) => {
      let replacedCount = 0;

      for (const mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === Node.ELEMENT_NODE) {
            replacedCount += replaceInElement(/** @type {Element} */ (addedNode));
          } else if (addedNode.nodeType === Node.TEXT_NODE) {
            if (replaceTextInNode(addedNode)) {
              replacedCount++;
            }
          }
        }
      }

      if (replacedCount > 0) {
        logger.info(`Replaced ${replacedCount} nodes from mutation.`);
      }
    });

    try {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } catch (err) {
      logger.error('MutationObserver setup failed:', err);
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLocalization);
  } else {
    initLocalization();
  }
})();