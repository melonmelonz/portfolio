// Mobile nav toggle
const toggle = document.querySelector('.nav-toggle');
const links = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  links.classList.toggle('open');
});

// Close mobile nav on link click
links.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    links.classList.remove('open');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => {
  if (section.id && section.id !== 'top') {
    observer.observe(section);
  }
});

// Easter egg: berry ASMR animation → page flip
const berryImg = document.querySelector('.nav-brand img');
const front = document.getElementById('page-front');
const back  = document.getElementById('page-back');

berryImg.addEventListener('click', e => {
  e.preventDefault();
  if (document.body.dataset.side === 'back') return;
  berryImg.classList.add('berry-popping');
  berryImg.addEventListener('animationend', () => {
    berryImg.classList.remove('berry-popping');
    flipTo('back');
  }, { once: true });
});

document.getElementById('btn-flip-back').addEventListener('click', () => {
  flipTo('front');
});

// ── Rainbow Heading ──────────────────────────────────────────

(function initRainbowHeading() {
  const el = document.querySelector('.rainbow-heading');
  if (!el) return;
  const chars = [...el.textContent];
  el.textContent = '';
  chars.forEach((ch, i) => {
    const s = document.createElement('span');
    s.textContent = ch === ' ' ? '\u00a0' : ch;
    s.style.animationDelay = `-${(i * 0.18).toFixed(2)}s`;
    el.appendChild(s);
  });
})();

// ── Star trail ──────────────────────────────────────────────

const trailColors = ['#ff69b4','#00ffff','#ffff00','#ff4500','#7fff00','#ff00ff','#00ff7f','#ffa500'];
let trailListener = null;

function startStarTrail() {
  trailListener = (e) => {
    const star = document.createElement('span');
    star.className = 'star-trail';
    star.textContent = '★';
    star.style.left = e.clientX + 'px';
    star.style.top  = e.clientY + 'px';
    star.style.color = trailColors[Math.floor(Math.random() * trailColors.length)];
    document.body.appendChild(star);
    star.addEventListener('animationend', () => star.remove());
  };
  document.addEventListener('mousemove', trailListener);
}

function stopStarTrail() {
  if (trailListener) {
    document.removeEventListener('mousemove', trailListener);
    trailListener = null;
  }
  document.querySelectorAll('.star-trail').forEach(el => el.remove());
}

// ── Retro Clock ──────────────────────────────────────────────

let clockInterval = null;

function updateClock() {
  const now = new Date();
  let h = now.getHours();
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  document.getElementById('clock-time').textContent = `${h}:${m}:${s} ${ampm}`;
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  const d  = String(now.getDate()).padStart(2, '0');
  const yr = String(now.getFullYear()).slice(-2);
  document.getElementById('clock-date').textContent = `${days[now.getDay()]} ${mo}/${d}/${yr}`;
}

function startClock() {
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}

function stopClock() {
  clearInterval(clockInterval);
  clockInterval = null;
}

// ── AIM Widget ────────────────────────────────────────────────

const aimWidget = document.getElementById('aim-widget');

document.getElementById('aim-close').addEventListener('click', () => {
  aimWidget.classList.add('aim-hidden');
});

document.getElementById('aim-im-btn').addEventListener('click', () => {
  alert('x0x_webmaster_x0x is away:\n\n"brb gettin pizza lol"\n\n(Last online: 04/20/1999)');
});

document.getElementById('aim-setup-btn').addEventListener('click', () => {
  alert('AOL Instant Messenger requires a valid AOL account.\n\nDial-up connection required.');
});

// ── Web Ring ──────────────────────────────────────────────────

document.querySelectorAll('.webring-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('Error 404: This web ring is offline.\n\nGeocities shut down on October 26, 2009. :(\n\nRIP geocities.com 1994-2009');
  });
});

// ── Page flip ────────────────────────────────────────────────

function flipTo(side) {
  document.body.classList.add('flipping-out');
  setTimeout(() => {
    if (side === 'back') {
      front.style.display = 'none';
      back.style.display  = 'block';
      document.body.dataset.side = 'back';
      startStarTrail();
      startClock();
      aimWidget.classList.remove('aim-hidden');
    } else {
      back.style.display  = 'none';
      front.style.display = 'block';
      document.body.dataset.side = 'front';
      stopStarTrail();
      stopClock();
    }
    document.body.classList.remove('flipping-out');
    document.body.classList.add('flipping-in');
    window.scrollTo(0, 0);
    document.body.addEventListener('animationend', () => {
      document.body.classList.remove('flipping-in');
    }, { once: true });
  }, 450);
}
