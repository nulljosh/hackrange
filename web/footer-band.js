// Footer band: Hackrange's own things in a row (the target, a prompt, a lock, a key, a chip, a juice cup), engraved in plain 2D canvas.
// Faint rules run across the band and thicken inside the glyphs, so they look cut into the page.
// ponytail: was a WebGL shader with a drifting light; it rendered as a black box on iPhone, so it is static now.
(function () {
  var band = document.querySelector('.word-band'), canvas = band && band.querySelector('canvas');
  if (!canvas) return;

  var mark = new Image(), tints = {};
  mark.src = 'mark.svg';

  // Each glyph is drawn white on a 100 unit square.
  var GLYPHS = [
    function (c) { // the target with a keyhole, the mark
      c.lineWidth = 8; c.beginPath(); c.arc(50, 50, 30, 0, 7); c.stroke();
      c.beginPath(); c.arc(50, 45, 8, 0, 7); c.fill(); c.beginPath(); c.moveTo(46, 48); c.lineTo(54, 48); c.lineTo(57, 64); c.lineTo(43, 64); c.fill();
      c.lineCap = 'round'; [[50, 10, 50, 18], [50, 82, 50, 90], [10, 50, 18, 50], [82, 50, 90, 50]].forEach(function (l) { c.beginPath(); c.moveTo(l[0], l[1]); c.lineTo(l[2], l[3]); c.stroke(); });
    },
    function (c) { // a shell prompt
      c.lineWidth = 9; c.lineCap = 'round'; c.lineJoin = 'round';
      c.beginPath(); c.moveTo(20, 28); c.lineTo(46, 50); c.lineTo(20, 72); c.stroke();
      c.beginPath(); c.moveTo(54, 74); c.lineTo(82, 74); c.stroke();
    },
    function (c) { // an open padlock
      c.fillRect(24, 46, 52, 38);
      c.lineWidth = 9; c.beginPath(); c.moveTo(36, 46); c.lineTo(36, 30); c.arc(50, 30, 14, Math.PI, 2 * Math.PI); c.stroke();
    },
    function (c) { // a key
      c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.arc(32, 50, 15, 0, 7); c.stroke();
      c.beginPath(); c.moveTo(47, 50); c.lineTo(86, 50); c.moveTo(74, 50); c.lineTo(74, 64); c.moveTo(86, 50); c.lineTo(86, 62); c.stroke();
    },
    function (c) { // a chip, the registers
      c.fillRect(30, 30, 40, 40); c.lineWidth = 6;
      for (var i = 0; i < 3; i++) { var p = 38 + i * 12; [[p, 14, p, 30], [p, 70, p, 86], [14, p, 30, p], [70, p, 86, p]].forEach(function (l) { c.beginPath(); c.moveTo(l[0], l[1]); c.lineTo(l[2], l[3]); c.stroke(); }); }
    },
    function (c) { // a cup of juice
      c.beginPath(); c.moveTo(28, 34); c.lineTo(72, 34); c.lineTo(65, 86); c.lineTo(35, 86); c.fill();
      c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(54, 34); c.lineTo(62, 12); c.lineTo(74, 12); c.stroke();
    }
  ];
  // Lays the glyphs out evenly across a w by h 2D context, in the given colour: one row, or two on a narrow band.
  function grid(w, h) {
    var n = GLYPHS.length, rows = w < h * 3 ? 2 : 1, per = Math.ceil(n / rows);
    return { rows: rows, per: per, cell: Math.min(h / rows * 0.86, w / per) };
  }
  function paint(c, w, h, colour) {
    var g = grid(w, h), gap = (w - g.cell * g.per) / g.per, rowH = h / g.rows;
    GLYPHS.forEach(function (draw, i) {
      var col = i % g.per, row = Math.floor(i / g.per);
      c.save(); c.translate(gap / 2 + col * (g.cell + gap), row * rowH + (rowH - g.cell) / 2 + rowH * 0.04); c.scale(g.cell / 100, g.cell / 100);
      c.fillStyle = c.strokeStyle = colour; draw(c); c.restore();
    });
  }

  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  function layer(w, h) { var c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  // Horizontal rules `t` px thick, one every `pitch` px, kept only where `mask` is drawn (everywhere when null).
  function rules(w, h, pitch, t, colour, mask) {
    var c = layer(w, h), x = c.getContext('2d');
    x.fillStyle = colour;
    for (var y = 0; y < h; y += pitch) x.fillRect(0, Math.round(y + (pitch - t) / 2), w, Math.max(1, Math.round(t)));
    if (mask) { x.globalCompositeOperation = 'destination-in'; x.drawImage(mask, 0, 0); }
    return c;
  }
  var drawnW = 0;
  function draw() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2), w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (!w || !h) return;
    drawnW = w; canvas.width = w; canvas.height = h;
    var colour = getComputedStyle(band).color, pitch = Math.min(5 * dpr, Math.max(3 * dpr, grid(w, h).cell / 22)), s = Math.max(2, h * 0.014);
    var glyphs = layer(w, h); paint(glyphs.getContext('2d'), w, h, '#fff');
    // the shadow side: glyph pixels whose neighbour down and right is outside the glyph (light from the top left)
    var shade = layer(w, h), sc = shade.getContext('2d');
    sc.drawImage(glyphs, 0, 0); sc.globalCompositeOperation = 'destination-out'; sc.drawImage(glyphs, -s, -s);
    ctx.globalAlpha = 0.28; ctx.drawImage(rules(w, h, pitch, dpr * 0.75, colour, null), 0, 0);
    ctx.globalAlpha = 1; ctx.drawImage(rules(w, h, pitch, pitch * 0.32, colour, glyphs), 0, 0);
    ctx.drawImage(rules(w, h, pitch, pitch * 0.6, colour, shade), 0, 0);
    // fade out toward the legal line
    var g = ctx.createLinearGradient(0, h * 0.88, 0, h);
    g.addColorStop(0, '#000'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalCompositeOperation = 'destination-in'; ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  }
  band.classList.add('live');
  draw();
  mark.addEventListener('load', draw);
  // iOS fires resize as the toolbar slides; only a width change needs a redraw
  window.addEventListener('resize', function () { if (Math.round(canvas.clientWidth * Math.min(window.devicePixelRatio || 1, 2)) !== drawnW) draw(); });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
})();
