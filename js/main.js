/* App wiring: connects the page's elements to Effects and Personalize. */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var intro = $('intro'), card = $('card'), reveal = $('reveal');
  var panel = $('panel'), toInput = $('toInput'), fromInput = $('fromInput');

  function toast(message) {
    var el = $('toast');
    el.textContent = message;
    el.classList.add('on');
    setTimeout(function () { el.classList.remove('on'); }, 1800);
  }

  function renderNames() {
    var names = Personalize.readNames();
    $('toName').textContent = names.to ? 'Dear ' + names.to : 'Dear you';
    $('signOff').textContent = names.from ? 'With love, ' + names.from : 'With warmest wishes';
    document.title = 'Happy Diwali' + (names.to ? ', ' + names.to : '');
  }

  function updateLink() {
    $('linkText').textContent = Personalize.buildLink(toInput.value, fromInput.value);
  }

  /* Intro -> card */
  $('lightBtn').addEventListener('click', function () {
    $('bigDiya').classList.add('lit');
    this.disabled = true;
    setTimeout(function () {
      intro.classList.add('hidden');
      card.classList.remove('hidden');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { reveal.classList.add('show'); });
      });
      Effects.celebrate();
    }, 1500);
  });

  $('celebrateBtn').addEventListener('click', Effects.celebrate);

  /* Tap anywhere (except controls) for a firework */
  document.body.addEventListener('pointerdown', function (e) {
    if (e.target.closest('button, input')) return;
    Effects.burst(e.clientX, e.clientY);
  });

  /* Personalize & share panel */
  $('makeBtn').addEventListener('click', function () {
    panel.classList.toggle('hidden');
    updateLink();
    if (!panel.classList.contains('hidden')) toInput.focus();
  });
  toInput.addEventListener('input', updateLink);
  fromInput.addEventListener('input', updateLink);

  $('copyBtn').addEventListener('click', function () {
    var link = Personalize.buildLink(toInput.value, fromInput.value);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).then(
        function () { toast('Link copied'); },
        function () { toast('Press and hold the link to copy'); }
      );
    } else {
      toast('Press and hold the link to copy');
    }
  });

  $('shareBtn').addEventListener('click', function () {
    var link = Personalize.buildLink(toInput.value, fromInput.value);
    var name = toInput.value.trim();
    var text = 'Happy Diwali' + (name ? ', ' + name : '') + '! I made something for you.';
    if (navigator.share) {
      navigator.share({ title: 'Happy Diwali', text: text, url: link }).catch(function () {});
    } else {
      window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + link), '_blank');
    }
  });

  window.addEventListener('hashchange', renderNames);
  renderNames();
})();
