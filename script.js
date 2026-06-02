// Preloader
window.addEventListener('load',()=>{
  const pl=document.getElementById('preloader');
  if(pl){setTimeout(()=>pl.classList.add('hide'),300)}
});

// Contact form
function handleForm(e){
  e.preventDefault();
  const form=e.target;
  const ok=document.getElementById('formOk');
  const err=document.getElementById('formErr');
  const btn=form.querySelector('button[type=submit]');
  const originalText=btn.innerHTML;
  btn.innerHTML='Enviando…';btn.disabled=true;
  if(ok)ok.style.display='none';
  if(err)err.style.display='none';
  fetch(form.action,{
    method:'POST',
    body:new FormData(form),
    headers:{Accept:'application/json'}
  }).then(r=>{
    btn.innerHTML=originalText;btn.disabled=false;
    if(r.ok){
      form.reset();
      if(ok){ok.style.display='block';setTimeout(()=>ok.style.display='none',6000)}
    } else {
      if(err)err.style.display='block';
    }
  }).catch(()=>{
    btn.innerHTML=originalText;btn.disabled=false;
    if(err)err.style.display='block';
  });
  return false;
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
  const sy=window.scrollY||window.pageYOffset||0;
  const h=document.documentElement;
  const max=h.scrollHeight-h.clientHeight||1;
  const p=sy/max;
  bar.style.width=(p*100)+'%';
  h.style.setProperty('--sr', sy*0.15);
  if(navEl)navEl.classList.toggle('scrolled', sy>40);
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

// Service popup
(function(){
  const svcData={
    'Vivienda completa':{
      desc:'Reformamos tu piso o casa al completo en Gran Canaria: redistribuimos espacios, renovamos instalaciones eléctricas y de fontanería, cambiamos suelos, alicatados, pinturas y carpintería. Un solo equipo, un solo presupuesto cerrado y sin sorpresas al final de la obra.',
      precio:'Desde 12.000 €',plazo:'4 – 10 semanas',
      items:['Distribución y tabiquería nueva','Instalación eléctrica completa','Fontanería y sanitarios','Suelos y alicatados','Pinturas y acabados','Carpintería interior','Coordinación de todos los gremios'],
      faq:[
        {q:'¿Puedo vivir en casa durante la obra?',a:'Depende del alcance. En reformas integrales lo habitual es desalojar la vivienda; te lo indicamos antes de empezar.'},
        {q:'¿El precio es definitivo?',a:'Sí. Te entregamos presupuesto cerrado por escrito antes de firmar. Sin "imprevistos" que inflen la factura.'}
      ]
    },
    'Baños':{
      desc:'Reformamos baños en Gran Canaria de principio a fin: demolición, obra, alicatado completo, instalación de ducha o bañera, grifería, sanitarios y electricidad. Precio cerrado antes de empezar y obra lista en pocos días.',
      precio:'Desde 2.500 €',plazo:'5 – 10 días',
      items:['Demolición y obra civil','Plato de ducha o sustitución de bañera','Alicatado completo desde cero','Grifería y sanitarios nuevos','Electricidad y ventilación','Mamparas si se solicitan'],
      faq:[
        {q:'¿Cuánto tarda una reforma de baño?',a:'Un baño estándar lo terminamos en 5-10 días laborables, según el estado de partida y los materiales elegidos.'},
        {q:'¿Sustituís solo la bañera por ducha?',a:'Sí, es uno de los trabajos más frecuentes. Lo hacemos en 2-3 días con presupuesto cerrado.'}
      ]
    },
    'Cocinas':{
      desc:'Hacemos reformas integrales de cocinas en Gran Canaria: diseñamos el aprovechamiento del espacio, instalamos muebles y encimera, alicatamos, cambiamos suelo y resolvemos fontanería y electricidad. Todo en un solo presupuesto.',
      precio:'Desde 3.500 €',plazo:'1 – 2 semanas',
      items:['Diseño y distribución del espacio','Instalación de muebles y encimera','Alicatado y suelo nuevos','Fontanería y electricidad','Campana y fregadero','Electrodomésticos si se solicitan'],
      faq:[
        {q:'¿Puedo usar la cocina mientras dura la reforma?',a:'No. La obra requiere cortar instalaciones. Normalmente entre 1 y 2 semanas sin cocina.'},
        {q:'¿Incluís los muebles?',a:'Podemos gestionar el suministro de muebles o trabajar con los que ya hayas comprado, como prefieras.'}
      ]
    },
    'Albañilería':{
      desc:'Realizamos todo tipo de trabajos de albañilería en Gran Canaria: demoliciones, apertura de huecos, tabiquería de pladur o ladrillo, solados, alicatados, enfoscados y revocos. Mano de obra propia y materiales de primera calidad.',
      precio:'Presupuesto a medida',plazo:'Según alcance',
      items:['Demoliciones y apertura de huecos','Tabiquería de ladrillo o pladur','Solados y alicatados','Enfoscados y revocos','Cielos rasos y escayola','Impermeabilizaciones'],
      faq:[
        {q:'¿Hacéis solo albañilería o también otros gremios?',a:'Podemos encargarnos solo de albañilería o coordinar también electricidad, fontanería y pintura si lo necesitas.'},
        {q:'¿Retiráis los escombros?',a:'Sí. La retirada y gestión de escombros está incluida en el presupuesto.'}
      ]
    },
    'Fontanería':{
      desc:'Servicio de fontanería en Gran Canaria: instalación, reforma y reparación de tuberías, grifería y sanitarios. Detectamos y solucionamos averías, renovamos instalaciones completas y emitimos certificados de instalación.',
      precio:'Desde 80 € / hora',plazo:'1 día – 1 semana',
      items:['Detección y reparación de averías','Cambio o renovación de tuberías','Instalación de grifería y sanitarios','Calentadores, termos y acumuladores','Certificados de instalación','Urgencias disponibles'],
      faq:[
        {q:'¿Atendéis averías urgentes?',a:'Sí. Cubrimos urgencias de fontanería en Gran Canaria. Contáctanos y te decimos la disponibilidad.'},
        {q:'¿Emitís certificado de instalación?',a:'Sí. Toda instalación nueva incluye certificado de instalación eléctrica o de fontanería según corresponda.'}
      ]
    },
    'Electricidad':{
      desc:'Instalaciones eléctricas en Gran Canaria: instalación completa en obra nueva o reforma, cuadros eléctricos, puntos de luz, enchufes y automatismos. Trabajo con factura, seguro y certificado de instalación.',
      precio:'Presupuesto a medida',plazo:'1 – 5 días',
      items:['Instalación eléctrica completa','Cuadros eléctricos y automatismos','Puntos de luz y enchufes','Domótica básica si se solicita','Certificado de instalación eléctrica','Adecuación a normativa vigente'],
      faq:[
        {q:'¿Sois electricistas autorizados?',a:'Sí. Trabajamos con instaladores autorizados y emitimos boletín eléctrico homologado.'},
        {q:'¿Hacéis instalaciones para comunidades?',a:'Sí, hacemos instalaciones tanto en viviendas particulares como en comunidades de propietarios.'}
      ]
    }
  };
  const popup=document.getElementById('svc-popup');
  if(!popup)return;
  const pImg=document.getElementById('svc-popup-img');
  const pTitle=document.getElementById('svc-popup-title');
  const pDesc=document.getElementById('svc-popup-desc');
  const pMeta=document.getElementById('svc-popup-meta');
  const pItems=document.getElementById('svc-popup-items');
  const pFaq=document.getElementById('svc-popup-faq');
  const pClose=popup.querySelector('.svc-popup-close');
  const pBackdrop=popup.querySelector('.svc-popup-backdrop');
  const pPanel=popup.querySelector('.svc-popup-panel');
  let prevFocus;
  function openPopup(card){
    const img=card.querySelector('.svc-photo img');
    const h3=card.querySelector('h3');
    const title=h3?h3.textContent:'';
    const d=svcData[title]||{};
    pImg.src=img?img.src:'';
    pImg.alt=img?img.alt:'';
    pTitle.textContent=title;
    pDesc.textContent=d.desc||(card.querySelector('p')||{}).textContent||'';
    pMeta.innerHTML=d.precio?`<span class="svc-popup-pill">💰 ${d.precio}</span><span class="svc-popup-pill">⏱ ${d.plazo}</span>`:'';
    pItems.innerHTML=(d.items||[]).map(i=>`<li>${i}</li>`).join('');
    pFaq.innerHTML=(d.faq||[]).map(f=>`<details class="svc-popup-faq-item"><summary>${f.q}</summary><p>${f.a}</p></details>`).join('');
    popup.setAttribute('aria-label',title);
    prevFocus=document.activeElement;
    popup.style.display='flex';
    popup.offsetHeight; // force reflow — ensures transition fires from opacity:0
    popup.classList.add('is-open');
    document.body.style.overflow='hidden';
    pClose.focus();
  }
  function closePopup(){
    popup.classList.remove('is-open');
    pPanel.addEventListener('transitionend',function(){
      popup.style.display='none';
      document.body.style.overflow='';
      if(prevFocus)prevFocus.focus();
    },{once:true});
  }
  document.querySelectorAll('.svc:not(a)').forEach(card=>{
    card.addEventListener('click',()=>openPopup(card));
  });

  // Nav links con data-open-svc abren el popup del servicio correspondiente
  document.querySelectorAll('[data-open-svc]').forEach(link=>{
    link.addEventListener('click',function(e){
      const title=this.dataset.openSvc;
      const card=Array.from(document.querySelectorAll('.svc:not(a)')).find(c=>{
        const h3=c.querySelector('h3');
        return h3&&h3.textContent.trim()===title;
      });
      if(card){e.preventDefault();openPopup(card);}
    });
  });

  // Botón "Pedir presupuesto" dentro del popup cierra y navega a #contacto
  const pCta=document.getElementById('svc-popup-cta-btn');
  if(pCta)pCta.addEventListener('click',closePopup);

  pClose.addEventListener('click',closePopup);
  pBackdrop.addEventListener('click',closePopup);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&popup.style.display==='flex')closePopup();});
})();

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
