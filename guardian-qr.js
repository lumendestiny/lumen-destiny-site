import QRCode from 'https://cdn.jsdelivr.net/npm/qrcode@1.5.4/+esm';

const panel=document.getElementById('guardianQrPanel');
const image=document.getElementById('guardianQrImage');
const link=document.getElementById('guardianQrLink');

async function renderQr(detail={}){
  if(!panel||!image||!link||!detail.id)return;
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
    panel.hidden=false;
    image.removeAttribute('src');
  }
}
window.addEventListener('lumen-guardian-verified',e=>renderQr(e.detail||{}));
const requested=new URLSearchParams(location.search).get('id');
if(requested)setTimeout(()=>renderQr({id:requested.trim().toUpperCase()}),120);
