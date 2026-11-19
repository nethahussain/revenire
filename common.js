/* Revenire: shared helpers (avatars, name matching, ECG strip, lightbox). */
(function(){
  const R = window.Rev = {};

  /* Pages rebuilt from the autograph form join the slam book in alphabetical order. */
  if (window.SLAMBOOK && window.AUTOGRAPH) {
    window.AUTOGRAPH.forEach(a => window.SLAMBOOK.push(Object.assign({ text: [], photos: [], kid: null }, a)));
    window.SLAMBOOK.sort((a, b) => a.name.localeCompare(b.name));
    window.AUTOGRAPH = null;
  }
  R.esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  R.slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const norm = s => String(s).toLowerCase().replace(/[^a-z]/g,'');

  /* Cartoons: cartoons/manifest.js lists the files that exist, keyed by slam book slug. */
  R.cartoon = slug => (window.CARTOONS && window.CARTOONS[slug]) ? 'cartoons/' + window.CARTOONS[slug] : null;

  const HUES = ['#F2C6CC','#C9E4DC','#F3DDB3','#CFD8F0','#E2CFEA','#D5E8C4','#F4CFB8','#C8E1EA'];
  R.initials = name => String(name).replace(/[^A-Za-z ]/g,' ').trim().split(/\s+/).filter(w => w.length > 1 || /[A-Z]/.test(w)).slice(0,2).map(w => w[0].toUpperCase()).join('');
  /* Cartoon if one has been added; otherwise the face from the slam book portrait (pass the person as p); otherwise initials. */
  R.avatar = (name, slug, size, p) => {
    const src = slug && R.cartoon(slug);
    let h = 0; for (const c of String(name)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const style = `--hue:${HUES[h % HUES.length]};--fs:${Math.round((size||72) * .34)}px`;
    const inner = src ? `<img src="${R.esc(src)}" alt="Cartoon of ${R.esc(name)}" loading="lazy">`
      : (p && p.face && p.sprite) ? R.crop(p, p.face, 'crop', name)
      : `<b aria-hidden="true">${R.esc(R.initials(name))}</b>`;
    return `<div class="av" style="${style}">${inner}</div>`;
  };

  /* Match an RSVP-sheet name to a slam book profile (exact or unambiguous prefix). */
  R.matchProfile = (name, people) => {
    if (!people) return null;
    const alias = window.REVENIRE && window.REVENIRE.aliases && window.REVENIRE.aliases[name];
    if (alias) name = alias;
    const n = norm(name);
    let hit = people.filter(p => norm(p.name) === n);
    if (!hit.length && n.length >= 5) hit = people.filter(p => { const m = norm(p.name); return m.length >= 5 && (m.startsWith(n) || n.startsWith(m)); });
    return hit.length === 1 ? hit[0] : null;
  };

  /* ECG strip: lead II, 25 mm/s, 10 mm/mV, heart rate 53. */
  R.ecg = cv => {
    const ctx = cv.getContext('2d');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const period = 60 / 53;
    const g = (x, mu, s, a) => a * Math.exp(-((x - mu) ** 2) / (2 * s * s));
    const mv = t => { const x = (t % period) / period;
      return g(x,.12,.022,.15) - g(x,.215,.007,.12) + g(x,.235,.009,1.45) - g(x,.255,.008,.32) + g(x,.48,.045,.3); };
    let W=0,H=0,pxmm=4,buf=[],head=0,last=null,tAbs=0;
    const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
    function size(){ const dpr = devicePixelRatio || 1; W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W*dpr; cv.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); pxmm = W < 500 ? 3 : 3.5;
      buf = Array.from({length: Math.ceil(W)}, (_, x) => mv(x / (25 * pxmm))); head = 0; }
    function draw(){
      ctx.clearRect(0,0,W,H);
      const mi = css('--grid-minor'), ma = css('--grid-major');
      for (let x=0,i=0; x<=W; x+=pxmm,i++){ ctx.fillStyle = i%5 ? mi : ma; ctx.fillRect(Math.round(x),0,1,H); }
      for (let y=H,i=0; y>=0; y-=pxmm,i++){ ctx.fillStyle = i%5 ? mi : ma; ctx.fillRect(0,Math.round(y),W,1); }
      const base = H * .68, gain = 10 * pxmm * .8;
      ctx.strokeStyle = css('--trace'); ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.beginPath();
      let pen = false;
      for (let x=0; x<buf.length; x++){
        if (!reduce && x >= head && x < head + 16){ pen = false; continue; }
        const y = base - buf[x] * gain; pen ? ctx.lineTo(x,y) : ctx.moveTo(x,y); pen = true; }
      ctx.stroke();
    }
    function frame(ts){
      if (last !== null){ const adv = Math.min(.05,(ts-last)/1000) * 25 * pxmm;
        for (let k=0; k<adv; k++){ tAbs += 1/(25*pxmm); buf[head] = mv(tAbs); head = (head+1) % buf.length; } }
      last = ts; draw(); requestAnimationFrame(frame);
    }
    size(); draw();
    addEventListener('resize', () => { size(); draw(); });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
    new MutationObserver(draw).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
    if (!reduce) requestAnimationFrame(frame);
  };

  /* Slam book photos live in one image per person (slambook/sprites/<slug>.webp);
     each photo is a box [x, y, w, h] inside it. */
  R.spriteURL = p => 'slambook/sprites/' + p.sprite;
  R.crop = (p, b, cls, label) => {
    const [SW, SH] = p.size, [x, y, w, h] = b;
    const px = SW === w ? 0 : x / (SW - w) * 100, py = SH === h ? 0 : y / (SH - h) * 100;
    return `<div class="${cls || 'crop'}" role="img" aria-label="${R.esc(label || 'Photo')}" style="aspect-ratio:${w}/${h};background-image:url('${R.spriteURL(p)}');background-size:${SW / w * 100}% auto;background-position:${px}% ${py}%"></div>`;
  };
  const sheets = {};
  R.cropURL = (p, b) => {
    const load = sheets[p.sprite] ||= new Promise((ok, bad) => { const im = new Image(); im.onload = () => ok(im); im.onerror = bad; im.src = R.spriteURL(p); });
    return load.then(im => { const c = document.createElement('canvas'); c.width = b[2]; c.height = b[3];
      c.getContext('2d').drawImage(im, b[0], b[1], b[2], b[3], 0, 0, b[2], b[3]); return c.toDataURL('image/jpeg', .9); });
  };

  /* Lightbox over a list of image URLs, or functions returning a promise of one. */
  R.lightbox = (list, start) => {
    let i = start;
    const box = document.createElement('div'); box.className = 'lb'; box.setAttribute('role','dialog'); box.setAttribute('aria-modal','true');
    box.innerHTML = `<img alt=""><button type="button" class="x">Close</button>${list.length > 1 ? '<button type="button" class="nav-l" aria-label="Previous">‹</button><button type="button" class="nav-r" aria-label="Next">›</button>' : ''}`;
    const img = box.querySelector('img');
    const show = () => { const it = list[i], at = i;
      if (typeof it === 'function') { img.removeAttribute('src'); it().then(u => { if (at === i) img.src = u; }); }
      else img.src = it; };
    const close = () => { box.remove(); removeEventListener('keydown', key); };
    const step = d => { i = (i + d + list.length) % list.length; show(); };
    const key = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); };
    box.addEventListener('click', e => {
      if (e.target.classList.contains('nav-l')) return step(-1);
      if (e.target.classList.contains('nav-r')) return step(1);
      if (e.target === box || e.target.classList.contains('x')) close();
    });
    addEventListener('keydown', key);
    document.body.appendChild(box); show(); box.querySelector('.x').focus();
  };
})();
