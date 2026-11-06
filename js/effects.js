/* Visual effects: floating embers + firework bursts (canvas). */
(function () {
  'use strict';

  var canvas = document.getElementById('fx');
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var width, height, time = 0;
  var embers = [];
  var sparks = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createEmber() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.35 + 0.12,
      phase: Math.random() * 6,
      alpha: Math.random() * 0.6 + 0.2
    };
  }

  function burst(x, y) {
    var hues = [42, 35, 330, 48];
    var hue = hues[Math.floor(Math.random() * hues.length)];
    for (var i = 0; i < 70; i++) {
      var angle = (Math.PI * 2 * i) / 70;
      var speed = Math.random() * 3.6 + 1;
      sparks.push({ x: x, y: y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, hue: hue });
    }
  }

  function celebrate() {
    for (var i = 0; i < 5; i++) {
      setTimeout(function () {
        burst(width * (0.15 + Math.random() * 0.7), height * (0.12 + Math.random() * 0.4));
      }, i * 380);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    time += 0.01;

    embers.forEach(function (e) {
      e.y -= e.speed;
      e.x += Math.sin(time + e.phase) * 0.25;
      if (e.y < -5) { e.y = height + 5; e.x = Math.random() * width; }
      var a = e.alpha * (0.6 + 0.4 * Math.sin(time * 3 + e.phase));
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,205,110,' + a + ')';
      ctx.arc(e.x, e.y, e.radius, 0, 7);
      ctx.fill();
    });

    sparks = sparks.filter(function (p) { return p.life > 0; });
    sparks.forEach(function (p) {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.04; p.vx *= 0.985; p.life -= 0.013;
      ctx.beginPath();
      ctx.fillStyle = 'hsla(' + p.hue + ',90%,68%,' + Math.max(p.life, 0) + ')';
      ctx.arc(p.x, p.y, 1.9, 0, 7);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  for (var i = 0; i < 45; i++) embers.push(createEmber());
  draw();

  window.Effects = { burst: burst, celebrate: celebrate };
})();
