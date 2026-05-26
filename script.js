// Preloader
window.addEventListener('load',()=>{
  const pl=document.getElementById('preloader');
  if(pl){setTimeout(()=>pl.classList.add('hide'),300)}
});

// Contact form
function handleForm(e){
  e.preventDefault();
  const ok=document.getElementById('formOk');
  const btn=e.target.querySelector('button[type=submit]');
  btn.textContent='Enviando…';btn.disabled=true;
  setTimeout(()=>{
    e.target.reset();
    btn.textContent='Enviar solicitud de presupuesto';btn.disabled=false;
    if(ok){ok.style.display='block';setTimeout(()=>ok.style.display='none',5000)}
  },1000);
}

// Mobile menu toggle
const mm=document.getElementById('mm');
const burger=document.querySelector('.nav-burger');
document.querySelectorAll('[data-burger]').forEach(b=>b.addEventListener('click',()=>{
  mm&&mm.classList.toggle('open');
  burger&&burger.classList.toggle('is-open');
}));
document.querySelectorAll('.mm-nav a').forEach(a=>a.addEventListener('click',()=>{
  mm&&mm.classList.remove('open');
  burger&&burger.classList.remove('is-open');
}));

// Reveal on scroll
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.1});
document.querySelectorAll('.reveal, .svc, .ba, .why-card, .rev, .faq-item, .zona').forEach(el=>{el.classList.add('reveal');io.observe(el)});

// Scroll progress bar
const bar=document.createElement('div');bar.className='scroll-bar';document.body.appendChild(bar);

// Rotador de palabra golpeada por martillo
(function(){
  const word=document.querySelector('.rword');
  if(!word)return;
  const ham=document.querySelector('.rhammer');
  const hit=document.querySelector('.rhit');
  const words=JSON.parse(word.dataset.words||'[]');
  if(!words.length)return;
  let i=0;
  const cycle=()=>{
    if(ham){ham.classList.remove('swing');void ham.offsetWidth;ham.classList.add('swing')}
    setTimeout(()=>{
      if(hit){hit.classList.remove('boom');void hit.offsetWidth;hit.classList.add('boom')}
      word.classList.add('swap');
      setTimeout(()=>{
        i=(i+1)%words.length;
        word.textContent=words[i];
        word.classList.remove('swap');
        word.classList.add('smash');
        setTimeout(()=>word.classList.remove('smash'),360);
      },180);
    },720);
  };
  setTimeout(()=>{cycle();setInterval(cycle,2800)},1200);
})();

// Tools spin in sections
const spinTargets=[
  {sel:'#servicios .container', pos:'t-right', icon:'wrench'},
  {sel:'.gallery .container', pos:'t-left', icon:'gear'},
  {sel:'#por-que .container', pos:'t-right', icon:'screw'},
  {sel:'#zonas .container', pos:'t-left', icon:'wrench'}
];
const icons={
  wrench:'<svg viewBox="0 0 64 64" fill="currentColor"><path d="M50 4a14 14 0 0 0-13 19L7 53a4 4 0 1 0 5.7 5.7L43 28a14 14 0 1 0 7-24Zm0 22a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/></svg>',
  gear:'<svg viewBox="0 0 64 64" fill="currentColor"><path d="M32 20a12 12 0 1 0 0 24 12 12 0 0 0 0-24Zm0 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12ZM58 32l-4-2 1-5-5-2-1-5-5 1-2-4-5 2-3-4-4 3-4-2-3 4-5-1-1 5-5 2 1 5-4 2 4 2-1 5 5 2 1 5 5-1 2 4 5-2 3 4 4-3 4 2 3-4 5 1 1-5 5-2-1-5 4-2Z"/></svg>',
  screw:'<svg viewBox="0 0 64 64" fill="currentColor"><path d="M30 4h4v16h-4zM24 22h16v6H24zM26 30h12v8l-6 22-6-22z"/></svg>'
};
spinTargets.forEach(t=>{
  const host=document.querySelector(t.sel);
  if(!host)return;
  const el=document.createElement('div');
  el.className='tool-spin '+t.pos;
  el.innerHTML=icons[t.icon];
  host.appendChild(el);
});

const navEl=document.querySelector('.nav');
const onScroll=()=>{
  const h=document.documentElement;
  const max=h.scrollHeight-h.clientHeight;
  const p=h.scrollTop/max;
  bar.style.width=(p*100)+'%';
  document.documentElement.style.setProperty('--sr', h.scrollTop*0.15);
  if(navEl)navEl.classList.toggle('scrolled', h.scrollTop>40);
};
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

// Proceso — sidebar sticky con IntersectionObserver
(function(){
  const zones=document.querySelectorAll('.proc-step-zone');
  if(!zones.length)return;
  const numEl=document.getElementById('procBigNum');
  const nameEl=document.getElementById('procBigName');
  const dots=document.querySelectorAll('.proc-nav-dot');
  const steps=[
    {num:'01',name:'Contacto'},
    {num:'02',name:'Visita'},
    {num:'03',name:'Presupuesto'},
    {num:'04',name:'Obra y entrega'}
  ];
  const setStep=i=>{
    if(numEl){
      numEl.classList.add('swap');
      setTimeout(()=>{
        numEl.textContent=steps[i].num;
        if(nameEl)nameEl.textContent=steps[i].name;
        numEl.classList.remove('swap');
      },200);
    }
    dots.forEach((el,k)=>el.classList.toggle('active',k===i));
  };
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting)setStep(+e.target.dataset.step);
    });
  },{threshold:0.5,rootMargin:'-20% 0px -20% 0px'});
  zones.forEach(z=>io.observe(z));
})();

// Count-up trust numbers
const countUp=(el,target,suffix)=>{
  const dur=1400,start=performance.now();
  const tick=t=>{
    const p=Math.min(1,(t-start)/dur);
    const eased=1-Math.pow(1-p,3);
    el.firstChild.textContent=Math.round(target*eased)+(suffix||'');
    if(p<1)requestAnimationFrame(tick);
    else el.firstChild.textContent=target+(suffix||'');
  };
  requestAnimationFrame(tick);
};
const trustIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting||e.target.dataset.counted)return;
  e.target.dataset.counted=1;
  e.target.querySelectorAll('b').forEach(b=>{
    const txt=b.firstChild.textContent.trim();
    const m=txt.match(/^(\+?)([\d.]+)(.*)$/);
    if(!m)return;
    const pre=m[1],num=parseFloat(m[2]),suf=m[3];
    b.firstChild.textContent=pre+'0'+suf;
    const dur=1400,start=performance.now();
    const tick=t=>{
      const p=Math.min(1,(t-start)/dur);
      const eased=1-Math.pow(1-p,3);
      const v=num%1?(num*eased).toFixed(1):Math.round(num*eased);
      b.firstChild.textContent=pre+v+suf;
      if(p<1)requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}),{threshold:.4});
document.querySelectorAll('.trust-bar').forEach(t=>trustIO.observe(t));

// Marquee: duplicate content for seamless loop
document.querySelectorAll('.marquee-track').forEach(t=>{t.innerHTML+=t.innerHTML});

// Before/After slider
document.querySelectorAll('.ba-slider').forEach(s=>{
  const set=p=>{p=Math.max(0,Math.min(100,p));s.style.setProperty('--pos',p+'%')};
  set(50);
  let drag=false;
  const move=e=>{
    if(!drag)return;
    const r=s.getBoundingClientRect();
    const x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
    set((x/r.width)*100);
    e.preventDefault();
  };
  const start=e=>{drag=true;e.stopPropagation();move(e)};
  const end=()=>drag=false;
  s.addEventListener('mousedown',start);
  s.addEventListener('touchstart',start,{passive:false});
  window.addEventListener('mousemove',move);
  window.addEventListener('touchmove',move,{passive:false});
  window.addEventListener('mouseup',end);
  window.addEventListener('touchend',end);
});

// Carousel
(function(){
  const track=document.querySelector('.ba-track');
  if(!track)return;
  const slides=Array.from(track.children);
  const dotsBox=document.querySelector('.ba-dots');
  let i=0;
  function pp(){return window.innerWidth>720?2:1;}
  function maxI(){return Math.max(0,slides.length-pp());}
  function buildDots(){
    dotsBox.innerHTML='';
    for(let k=0;k<=maxI();k++){
      const d=document.createElement('button');
      d.className='ba-dot'+(k===0?' active':'');
      d.setAttribute('aria-label','Ir a '+(k+1));
      d.onclick=()=>go(k);
      dotsBox.appendChild(d);
    }
  }
  function go(n){
    i=Math.max(0,Math.min(n,maxI()));
    const gap=parseFloat(getComputedStyle(track).gap)||0;
    const sw=slides[0].offsetWidth;
    track.style.transform='translateX(-'+(i*(sw+gap))+'px)';
    dotsBox.querySelectorAll('.ba-dot').forEach((d,k)=>d.classList.toggle('active',k===i));
  }
  buildDots();
  window.addEventListener('resize',()=>{buildDots();go(0);});
  const prev=document.querySelector('.ba-nav.prev');
  const next=document.querySelector('.ba-nav.next');
  if(prev)prev.onclick=()=>go(i-1);
  if(next)next.onclick=()=>go(i+1);
  let sx=0,dx=0,dragging=false;
  track.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;dragging=true},{passive:true});
  track.addEventListener('touchmove',e=>{if(dragging)dx=e.touches[0].clientX-sx},{passive:true});
  track.addEventListener('touchend',()=>{
    if(Math.abs(dx)>50)go(i+(dx<0?1:-1));
    dx=0;dragging=false;
  });
})();
