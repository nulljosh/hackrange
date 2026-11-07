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

/* Hero terminal types itself out and loops: a real session, recon to 19/19. Honours reduced motion. */
(function () {
  var pre = document.getElementById('sesh');
  if (!pre) return;
  var S = [
    { t: 'c', s: '$ nmap -sV -p 3000 127.0.0.1' },
    { t: 'o', s: '3000/tcp open  ppp?' },
    { t: 'c', s: '$ curl localhost:3000/rest/user/login -d "\' OR 1=1--"' },
    { t: 'o', s: '{"umail":"admin@juice-sh.op","token":"eyJ0eXAi..."}', hi: 'admin@juice-sh.op' },
    { t: 'c', s: '$ curl localhost:3000/ftp/acquisitions.md' },
    { t: 'o', s: '# confidential, world-readable' },
    { t: 'c', s: "$ lldb re/bin/crackme1 -o 'b strcmp' -o run" },
    { t: 'o', s: 'x1 = 0x10000059d  "hunter2"', hi: '"hunter2"' },
    { t: 'c', s: '$ python3 -I bench/bench.py' },
    { t: 'o', s: 'Total: 19/19 solved', hi: '19/19 solved' }
  ];
  function esc(x) { return x.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function outHTML(l) {
    var s = esc(l.s);
    if (l.hi) s = s.split(esc(l.hi)).join('<span class="g">' + esc(l.hi) + '</span>');
    return s;
  }
  var divs = S.map(function () { var d = document.createElement('div'); d.className = 'ln'; pre.appendChild(d); return d; });
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) {
    S.forEach(function (l, k) { divs[k].innerHTML = l.t === 'c' ? '<span class="c">' + esc(l.s) + '</span>' : outHTML(l); });
    return;
  }
  var caret = document.createElement('span'); caret.className = 'caret'; caret.textContent = '▋';
  var i = 0;
  function next() {
    if (i >= S.length) { setTimeout(function () { divs.forEach(function (d) { d.textContent = ''; }); i = 0; setTimeout(next, 600); }, 2800); return; }
    var l = S[i], d = divs[i];
    if (l.t === 'o') { d.innerHTML = outHTML(l); i++; setTimeout(next, 300); return; }
    var span = document.createElement('span'); span.className = 'c'; d.innerHTML = ''; d.appendChild(span); d.appendChild(caret);
    var ch = 0;
    (function type() {
      if (ch < l.s.length) { span.textContent += l.s.charAt(ch++); setTimeout(type, 16 + Math.random() * 30); }
      else { i++; setTimeout(next, 260); }
    })();
  }
  setTimeout(next, 500);
})();
