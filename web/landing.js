// Landing behaviour: fade-up on scroll. Nothing here is needed to read the page.
(function () {
  document.documentElement.classList.add('js');
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(function () {
    // Hero parallax: the captures drift slower than the copy, which fades over 0.7 of the viewport.
    var root = document.documentElement;
    if (!still) window.addEventListener('scroll', function () {
      var y = window.scrollY;
      root.style.setProperty('--py', y * .45 + 'px');
      root.style.setProperty('--cy', y * .2 + 'px');
      root.style.setProperty('--co', Math.max(0, 1 - y / (innerHeight * .7)));
    }, { passive: true });
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (still || !('IntersectionObserver' in window)) { items.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (e) { io.observe(e); });
  });
})();
