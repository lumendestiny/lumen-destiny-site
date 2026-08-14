import QRCode from 'https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm';

const panel=document.getElementById('guardianQrPanel');
const image=document.getElementById('guardianQrImage');
const link=document.getElementById('guardianQrLink');

function hideQr(){
  if(!panel)return;
  panel.hidden=true;
  if(image) image.removeAttribute('src');
  if(link){link.removeAttribute('href');link.textContent='';}
}

async function renderQr(detail={}){
  // Security rule: a QR is proof-facing UI and must only appear after
  // guardian-verify.js has confirmed a paid + issued server record.
  if(!panel||!image||!link||!detail.id||detail.state!=='verified'){
    hideQr();
    return;
  }
  const url=new URL('/guardian-verify/',location.origin);
  url.searchParams.set('id',detail.id);
  const lang=new URLSearchParams(location.search).get('lang')||localStorage.getItem('lumen-lang')||'ko';
  url.searchParams.set('lang',lang);
  link.href=url.toString();
  link.textContent=url.toString();
  try{
    image.src=await QRCode.toDataURL(url.toString(),{width:220,margin:2,errorCorrectionLevel:'M'});
    image.alt=`Guardian ${detail.id} verification QR`;
    panel.hidden=false;
  }catch{
    hideQr();
  }
}

hideQr();
window.addEventListener('lumen-guardian-verified',e=>renderQr(e.detail||{}));
