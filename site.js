(function () {
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // Homepage hero: words snap into place, grid fades, highlight draws in
  var hd = document.querySelector('.hd');
  if (hd) {
    var grid = document.querySelector('.hero .gridlayer');
    var mark = hd.querySelector('.mark');
    var finish = function () {
      hd.classList.remove('scatter');
      if (grid) grid.style.opacity = '0.25';
      if (mark) mark.classList.add('on');
    };
    if (reduce) { finish(); }
    else {
      setTimeout(function () { hd.classList.remove('scatter'); }, 450);
      setTimeout(function () { if (grid) grid.style.opacity = '0.25'; }, 1550);
      setTimeout(function () { if (mark) mark.classList.add('on'); }, 1900);
    }
  }

  // Mark horizontal step flows inside figures, so phones can scroll them sideways
  document.querySelectorAll('.case figure div').forEach(function (el) {
    var cs = getComputedStyle(el);
    if (cs.display.indexOf('flex') > -1 && cs.flexDirection.indexOf('row') === 0 && el.children.length >= 4 && cs.flexWrap === 'nowrap') el.classList.add('hflow');
  });

  // Videos play when at least half visible, and reset when scrolled away
  var videos = document.querySelectorAll('video[data-scrollplay]');
  if (videos.length && 'IntersectionObserver' in window) {
    var vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          v.muted = true;
          var p = v.play();
          if (p && p.catch) p.catch(function () {});
        } else if (!v.paused) {
          v.pause();
          v.currentTime = 0;
        }
      });
    }, { threshold: [0, 0.5] });
    videos.forEach(function (v) { vo.observe(v); });
  }

  // Case study side navigation: highlight the section in view
  var toc = document.querySelector('nav.toc');
  if (toc) {
    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    var items = links.map(function (a) {
      return { a: a, el: document.getElementById(a.getAttribute('href').slice(1)) };
    }).filter(function (x) { return x.el; });
    links.forEach(function (a) {
      if (!document.getElementById(a.getAttribute('href').slice(1))) a.style.display = 'none';
    });
    var setActive = function (cur) {
      items.forEach(function (x) {
        var on = x === cur;
        if (on) x.a.setAttribute('aria-current', 'true'); else x.a.removeAttribute('aria-current');
        x.a.style.color = on ? '#1B1D24' : '#5E6170';
        x.a.style.borderLeftColor = on ? '#2B4A9B' : '#E6E6E1';
      });
    };
    var onScroll = function () {
      var y = window.innerHeight * 0.3, cur = items[0];
      items.forEach(function (x) { if (x.el.getBoundingClientRect().top <= y) cur = x; });
      setActive(cur);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
