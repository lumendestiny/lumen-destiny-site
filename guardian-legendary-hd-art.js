/* Approved Lumen Legendary HD vector master. Pure SVG, no raster dependency. */
(()=>{
  function legendary(){
    const scales=[]; const sparks=[]; const backSpines=[];
    for(let i=0;i<34;i++){
      const a=i/33, x=355+118*Math.sin(a*2.75*Math.PI), y=340+a*330+36*Math.sin(a*5*Math.PI);
      scales.push(`<path d="M${(x-13).toFixed(1)} ${y.toFixed(1)} q13 -13 26 0 q-13 18 -26 0Z" fill="#8a5207" stroke="#ffe390" stroke-width="2" opacity=".9"/>`);
      if(i%2===0) backSpines.push(`<path d="M${x.toFixed(1)} ${(y-35).toFixed(1)} l${(i%4===0?-24:24)} -32 l8 42Z" fill="#f0b83d" stroke="#ffe89b" stroke-width="2"/>`);
    }
    for(let i=0;i<58;i++){
      const ang=2*Math.PI*i/58, r=225+(i%8)*11, x=360+Math.cos(ang)*r, y=470+Math.sin(ang)*r*.82;
      sparks.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${2+(i%3)}" fill="#ffd85f" opacity="${(.38+.09*(i%5)).toFixed(2)}" filter="url(#lgGlow)"/>`);
    }
    const body='M365 330 C470 338 500 414 455 477 C420 526 337 507 302 561 C263 622 318 691 404 682 C495 672 548 582 512 507 C484 448 413 426 365 466 C325 500 323 553 368 580 C409 604 462 580 475 541';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 1080" role="img" aria-label="Lumen Guardian Legendary East Asian golden dragon">
      <defs>
        <linearGradient id="lgBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#020204"/><stop offset=".5" stop-color="#100a02"/><stop offset="1" stop-color="#020202"/></linearGradient>
        <linearGradient id="lgGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#744600"/><stop offset=".24" stop-color="#ffe7a3"/><stop offset=".48" stop-color="#c5810b"/><stop offset=".74" stop-color="#fff2b7"/><stop offset="1" stop-color="#7e4b00"/></linearGradient>
        <radialGradient id="lgHalo"><stop stop-color="#ffd65a" stop-opacity=".28"/><stop offset="1" stop-color="#ffd65a" stop-opacity="0"/></radialGradient>
        <filter id="lgGlow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="720" height="1080" rx="36" fill="url(#lgBg)"/>
      <rect x="13" y="13" width="694" height="1054" rx="30" fill="none" stroke="#7f540e" stroke-width="10"/>
      <rect x="25" y="25" width="670" height="1030" rx="24" fill="none" stroke="url(#lgGold)" stroke-width="3"/>
      <rect x="38" y="38" width="644" height="1004" rx="20" fill="none" stroke="#d4a72f" stroke-opacity=".55"/>
      <circle cx="360" cy="475" r="282" fill="url(#lgHalo)"/>
      <g fill="none" stroke="#d7a73e" stroke-opacity=".28"><circle cx="360" cy="475" r="242"/><circle cx="360" cy="475" r="205"/><path d="M120 475h480M360 235v480M190 305l340 340M530 305L190 645"/></g>
      <g fill="#d4a23a" text-anchor="middle"><text x="360" y="95" font-family="Georgia,serif" font-size="46" font-weight="700">LUMEN GUARDIAN</text><text x="360" y="132" font-family="Arial,sans-serif" font-size="17" letter-spacing="5">LEGENDARY MOTION · ONE &amp; ONLY</text></g>
      <g opacity=".28" fill="#cfbea0"><circle cx="118" cy="345" r="42"/><circle cx="160" cy="360" r="34"/><circle cx="604" cy="365" r="40"/><circle cx="566" cy="382" r="31"/><circle cx="112" cy="610" r="38"/><circle cx="604" cy="620" r="42"/></g>
      <g class="legendary-dragon-motion">
        ${backSpines.join('')}
        <path d="${body}" fill="none" stroke="#3b2203" stroke-width="88" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="${body}" fill="none" stroke="url(#lgGold)" stroke-width="72" stroke-linecap="round" stroke-linejoin="round" filter="url(#lgGlow)"/>
        <path d="${body}" fill="none" stroke="#fff0a9" stroke-opacity=".34" stroke-width="12" stroke-linecap="round"/>
        ${scales.join('')}

        <!-- unmistakable dragon head: long snout, antler horns, whiskers, ears, fangs -->
        <g transform="translate(350 300)" filter="url(#lgGlow)">
          <path d="M-92 28 Q-74-50 -22-72 Q42-96 96-49 Q128-20 110 18 Q91 47 55 52 Q13 63 -24 84 Q-65 101 -98 72 Q-117 54 -92 28Z" fill="url(#lgGold)" stroke="#ffe08a" stroke-width="4"/>
          <path d="M-52-62 C-78-98-92-124-70-144 C-52-120-38-102-28-72 M25-72 C46-108 66-136 89-146 C88-111 68-86 48-60" fill="none" stroke="#f3c65d" stroke-width="13" stroke-linecap="round"/>
          <path d="M-66-70 C-102-82-122-64-129-38 C-101-42-84-30-74-12 M75-58 C111-74 132-52 134-24 C105-31 88-17 75 1" fill="none" stroke="#d99a25" stroke-width="10"/>
          <path d="M-78 21 Q-28-1 8 17 Q45-3 86 16" fill="none" stroke="#2b1801" stroke-width="8" stroke-linecap="round"/>
          <ellipse cx="-33" cy="17" rx="9" ry="11" fill="#fff4ae"/><ellipse cx="46" cy="14" rx="9" ry="11" fill="#fff4ae"/>
          <circle cx="-31" cy="18" r="4" fill="#120b01"/><circle cx="44" cy="15" r="4" fill="#120b01"/>
          <path d="M-94 48 Q-60 84 -11 78 Q32 82 86 49 Q70 105 6 118 Q-55 118-105 78Z" fill="#311b02" stroke="#e9b64d" stroke-width="3"/>
          <path d="M-61 78 l13 26 l12-23 M-20 88 l10 24 l12-26 M24 87 l11 23 l13-28 M60 74 l10 22 l12-29" fill="#f6e2aa"/>
          <path d="M-110 40 C-165 20-192 34-220 66 M-104 57 C-162 58-195 80-226 112 M103 35 C158 8 194 22 224 50 M98 54 C153 54 191 74 226 102" fill="none" stroke="#e9be58" stroke-width="5" stroke-linecap="round"/>
          <path d="M-70-25 l-38 -18 l18 35 M76-30 l40-17 l-21 37" fill="#e4ad39" stroke="#ffe08a" stroke-width="3"/>
        </g>

        <!-- four dragon legs with clawed feet -->
        <g stroke="url(#lgGold)" stroke-width="17" stroke-linecap="round" fill="none">
          <path d="M325 430 Q250 420 225 475 Q214 505 230 530"/><path d="M445 447 Q520 430 548 485 Q558 513 541 540"/>
          <path d="M328 585 Q252 598 232 648 Q224 678 243 698"/><path d="M455 594 Q531 599 548 650 Q556 678 536 700"/>
        </g>
        <g stroke="#ffe895" stroke-width="7" stroke-linecap="round" fill="none">
          <path d="M230 530 l-28 22 M230 530 l-6 34 M230 530 l22 26"/><path d="M541 540 l29 18 M541 540 l9 34 M541 540 l-22 27"/>
          <path d="M243 698 l-28 20 M243 698 l-5 35 M243 698 l24 24"/><path d="M536 700 l29 20 M536 700 l8 34 M536 700 l-24 25"/>
        </g>
      </g>
      ${sparks.join('')}
      <g><line x1="95" y1="770" x2="625" y2="770" stroke="#b78b2c"/><circle cx="135" cy="828" r="38" fill="#090704" stroke="#e7ba50" stroke-width="3"/><text x="135" y="843" text-anchor="middle" fill="#ffe187" font-family="serif" font-size="38">金</text><text x="205" y="816" fill="#f6d56f" font-size="25" font-weight="700">재운 · 권위 · 완성</text><text x="205" y="848" fill="#c9ae72" font-size="13" letter-spacing="1.5">WEALTH · AUTHORITY · COMPLETION</text><line x1="95" y1="885" x2="625" y2="885" stroke="#8c6822"/><text x="360" y="938" text-anchor="middle" fill="#f6d56f" font-size="26" font-weight="700">LUMEN LEGENDARY GUARDIAN</text><text x="360" y="994" text-anchor="middle" fill="#d7b75e" font-family="Georgia,serif" font-size="22">1 / 1 · UNIQUE ISSUE</text></g>
    </svg>`;
  }
  window.__LUMEN_LEGENDARY_HD_ART__=Object.freeze({legendary});
})();