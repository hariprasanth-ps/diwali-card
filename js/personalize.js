/* Personalization: read names from the URL hash, build shareable links.
   Link format:  page.html#Priya   or   page.html#Priya-from-Arjun   */
(function () {
  'use strict';

  function titleCase(slug) {
    return slug.split('-').filter(Boolean)
      .map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); })
      .join(' ');
  }

  function readNames() {
    var raw = decodeURIComponent((window.location.hash || '').slice(1)).replace(/[^A-Za-z0-9\-]/g, '');
    var parts = raw.split('-from-');
    return { to: titleCase(parts[0] || ''), from: titleCase(parts[1] || '') };
  }

  function toSlug(text) {
    return text.trim().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s+/g, '-');
  }

  function buildLink(toName, fromName) {
    var base = window.location.href.split('#')[0];
    var a = toSlug(toName), b = toSlug(fromName);
    return a ? base + '#' + a + (b ? '-from-' + b : '') : base;
  }

  window.Personalize = { readNames: readNames, buildLink: buildLink };
})();
