// ── Rainbow Heading ──────────────────────────────────────────

(function initRainbowHeading() {
  const el = document.querySelector('.rainbow-heading');
  if (!el) return;
  const chars = [...el.textContent];
  el.textContent = '';
  chars.forEach((ch, i) => {
    const s = document.createElement('span');
    s.textContent = ch === ' ' ? ' ' : ch;
    s.style.animationDelay = `-${(i * 0.18).toFixed(2)}s`;
    el.appendChild(s);
  });
})();

// ── Star trail ──────────────────────────────────────────────

const trailColors = ['#ff69b4','#00ffff','#ffff00','#ff4500','#7fff00','#ff00ff','#00ff7f','#ffa500'];

document.addEventListener('mousemove', (e) => {
  const star = document.createElement('span');
  star.className = 'star-trail';
  star.textContent = '★';
  star.style.left = e.clientX + 'px';
  star.style.top  = e.clientY + 'px';
  star.style.color = trailColors[Math.floor(Math.random() * trailColors.length)];
  document.body.appendChild(star);
  star.addEventListener('animationend', () => star.remove());
});

// ── Retro Clock ──────────────────────────────────────────────

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

updateClock();
setInterval(updateClock, 1000);

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
