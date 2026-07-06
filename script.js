
// ── CURSOR
const cursor = document.getElementById('cursor');
const dot = document.getElementById('cursor-dot');
let mx=0,my=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px'});
(function animCursor(){cx+=(mx-cx)*.18;cy+=(my-cy)*.18;cursor.style.left=cx+'px';cursor.style.top=cy+'px';requestAnimationFrame(animCursor)})();

// ── ENVELOPE OPEN
function openEnvelope(){
  const wrap = document.getElementById('env-wrap');
  const img = document.getElementById('env-img');
  wrap.style.animation='none';
  wrap.style.transition='transform .3s ease, filter .5s ease, opacity .6s ease';
  wrap.style.transform='scale(1.12) translateY(-20px)';
  wrap.style.filter='drop-shadow(0 30px 100px rgba(184,113,122,.7)) brightness(1.08)';
  const music = document.getElementById("bg-music");
   music.loop = true;
  music.play();
  setTimeout(()=>{
    const screen = document.getElementById('envelope-screen');
    screen.style.transition='opacity 1.4s ease';
    screen.style.opacity='0';
    setTimeout(()=>{
      screen.classList.add('hidden');
      const site = document.getElementById('main-site');
      site.classList.add('visible');
      startHearts();
      document.body.style.overflowY='auto';
    },700);
  },200);
}

// ── COUNTDOWN
function updateCountdown(){
const target = new Date('2026-12-04T00:00:00');
  const now = new Date();
  const diff = target - now;
  if(diff <= 0){
    ['cd-days','cd-hrs','cd-min','cd-sec'].forEach(id=>document.getElementById(id).textContent='0');
    return;
  }
  const d = Math.floor(diff/86400000);
  const h = Math.floor((diff%86400000)/3600000);
  const m = Math.floor((diff%3600000)/60000);
  const s = Math.floor((diff%60000)/1000);
  document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
  document.getElementById('cd-hrs').textContent  = String(h).padStart(2,'0');
  document.getElementById('cd-min').textContent  = String(m).padStart(2,'0');
  document.getElementById('cd-sec').textContent  = String(s).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown,1000);

// ── SCROLL REVEAL
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible')}});
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// ── HEARTS
function startHearts(){
  const layer = document.getElementById('hearts-layer');
  const symbols = ['♡','♥','💕','🌸','✿'];
  setInterval(()=>{
    const h = document.createElement('span');
    h.className='heart-particle';
    h.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    h.style.left = Math.random()*100+'vw';
    h.style.animationDuration = (6+Math.random()*8)+'s';
    h.style.animationDelay = '0s';
    h.style.fontSize = (.7+Math.random()*.9)+'rem';
    h.style.opacity = .5+Math.random()*.5;
    layer.appendChild(h);
    setTimeout(()=>h.remove(),16000);
  },600);
}

// ── BG PARTICLES on envelope screen
(function spawnParticles(){
  const screen = document.getElementById('envelope-screen');
  for(let i=0;i<12;i++){
    const p = document.createElement('div');
    p.className='bg-particle';
    const size = 60+Math.random()*180;
    p.style.cssText=`width:${size}px;height:${size}px;left:${Math.random()*100}%;bottom:${-size}px;animation-duration:${8+Math.random()*14}s;animation-delay:${Math.random()*10}s`;
    screen.appendChild(p);
  }
})();

// ── WISHES SYSTEM
const WISHES_KEY = 'abnoub_larine_wishes_v1';

function loadWishes(){
  try{
    return JSON.parse(localStorage.getItem(WISHES_KEY))||[];
  }catch(e){return[];}
}
function saveWishes(wishes){
  try{localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));}catch(e){}
}

function formatDate(ts){
  const d = new Date(ts);
  return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
}

function renderWishCard(w, prepend){
  const list = document.getElementById('wishes-list');
  const empty = list.querySelector('.wishes-empty');
  if(empty) empty.remove();

  const icons = ['💕','🌸','✨','🌹','💖','🥂','💫','🌺'];
  const sparkles = ['✦','✧','✵','✶'];
  const icon = icons[Math.floor(Math.random()*icons.length)];
  const sparkle = sparkles[Math.floor(Math.random()*sparkles.length)];

  const card = document.createElement('div');
  card.className = 'wish-card';
  card.innerHTML = `
    <div class="wish-card-glow"></div>
    <div class="wish-card-header">
      <span class="wish-heart">${icon}</span>
      <span class="wish-name">${escapeHtml(w.name)}</span>
      <span class="wish-date">${formatDate(w.ts)}</span>
    </div>
    <p class="wish-text">"${escapeHtml(w.msg)}"</p>
    <span class="wish-sparkle">${sparkle}</span>
  `;
  card.style.animationDelay = prepend ? '0s' : (Math.random()*.15)+'s';

  if(prepend){
    list.insertBefore(card, list.firstChild);
    card.scrollIntoView({behavior:'smooth', block:'center'});
  } else {
    list.appendChild(card);
  }
}

function escapeHtml(str){
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function initWishes(){
  const wishes = loadWishes();
  const list = document.getElementById('wishes-list');
  if(wishes.length===0){
    list.innerHTML='<p class="wishes-empty">Be the first to send your wishes to Abnoub & Larine 💕</p>';
    return;
  }
  // Newest first
  [...wishes].reverse().forEach(w => renderWishCard(w, false));
}

function sendWish(event){
  const btn  = document.getElementById('send-btn');
  const name = document.getElementById('wish-name').value.trim();
  const msg  = document.getElementById('wish-msg').value.trim();

  // Validate
  if(!name){
    document.getElementById('wish-name').focus();
    document.getElementById('wish-name').style.borderColor='var(--deep-rose)';
    setTimeout(()=>document.getElementById('wish-name').style.borderColor='',1200);
    return;
  }
  if(!msg){
    document.getElementById('wish-msg').focus();
    document.getElementById('wish-msg').style.borderColor='var(--deep-rose)';
    setTimeout(()=>document.getElementById('wish-msg').style.borderColor='',1200);
    return;
  }

  // Ripple effect
  if(event){
    const r = document.createElement('span');
    r.className='send-btn-ripple';
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.width = r.style.height = size+'px';
    r.style.left = (event.clientX - rect.left - size/2)+'px';
    r.style.top  = (event.clientY - rect.top  - size/2)+'px';
    btn.appendChild(r);
    setTimeout(()=>r.remove(), 700);
  }

  // Disable btn
  btn.classList.add('sending');
  btn.textContent = 'Sending… ♡';

  const wish = {name, msg, ts: Date.now()};
  const wishes = loadWishes();
  wishes.push(wish);
  saveWishes(wishes);

  setTimeout(()=>{
    // Clear form
    document.getElementById('wish-name').value='';
    document.getElementById('wish-msg').value='';

    // Re-enable
    btn.classList.remove('sending');
    btn.textContent = 'Send With Love ♡';

    // Success msg
    const ok = document.getElementById('wish-ok');
    ok.style.display='block';
    setTimeout(()=>ok.style.display='none',4000);

    // Render card
    renderWishCard(wish, true);
  }, 600);
}

// Init on load
document.addEventListener('DOMContentLoaded', ()=>{
  initWishes();
});
