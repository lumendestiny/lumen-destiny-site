const W=1200,H=630,STRIDE=W*4+1;
const enc=new TextEncoder();
const table=(()=>{const out=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;out[n]=c>>>0}return out})();
function crc32(bytes){let c=0xffffffff;for(const b of bytes)c=table[(c^b)&255]^(c>>>8);return (c^0xffffffff)>>>0}
function be32(n){return new Uint8Array([(n>>>24)&255,(n>>>16)&255,(n>>>8)&255,n&255])}
function concat(...parts){const size=parts.reduce((n,p)=>n+p.length,0),out=new Uint8Array(size);let at=0;for(const p of parts){out.set(p,at);at+=p.length}return out}
function chunk(name,data){const type=enc.encode(name),body=concat(type,data);return concat(be32(data.length),body,be32(crc32(body)))}
function pixel(raw,x,y,r,g,b,a=255){if(x<0||x>=W||y<0||y>=H)return;const i=y*STRIDE+1+x*4;raw[i]=r;raw[i+1]=g;raw[i+2]=b;raw[i+3]=a}
function blend(raw,x,y,r,g,b,a=255){if(x<0||x>=W||y<0||y>=H)return;const i=y*STRIDE+1+x*4,t=a/255;raw[i]=Math.round(raw[i]*(1-t)+r*t);raw[i+1]=Math.round(raw[i+1]*(1-t)+g*t);raw[i+2]=Math.round(raw[i+2]*(1-t)+b*t);raw[i+3]=255}
function rect(raw,x0,y0,x1,y1,color){for(let y=Math.max(0,y0);y<Math.min(H,y1);y++)for(let x=Math.max(0,x0);x<Math.min(W,x1);x++)pixel(raw,x,y,...color)}
function roundish(raw,x0,y0,x1,y1,r,color){for(let y=Math.max(0,y0);y<Math.min(H,y1);y++)for(let x=Math.max(0,x0);x<Math.min(W,x1);x++){const dx=x<x0+r?x0+r-x:x>x1-r?x-(x1-r):0,dy=y<y0+r?y0+r-y:y>y1-r?y-(y1-r):0;if(dx*dx+dy*dy<=r*r)pixel(raw,x,y,...color)}}
function circle(raw,cx,cy,r,fill,border=null,bw=0){const rr=r*r,inner=(r-bw)*(r-bw);for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++){const d=(x-cx)*(x-cx)+(y-cy)*(y-cy);if(d<=rr){if(border&&bw>0&&d>=inner)pixel(raw,x,y,...border);else pixel(raw,x,y,...fill)}}}
function ring(raw,cx,cy,r,color,bw=2,alpha=90){const rr=r*r,inner=(r-bw)*(r-bw);for(let y=cy-r;y<=cy+r;y++)for(let x=cx-r;x<=cx+r;x++){const d=(x-cx)*(x-cx)+(y-cy)*(y-cy);if(d<=rr&&d>=inner)blend(raw,x,y,...color,alpha)}}
function line(raw,x0,y0,x1,y1,color,width=4){const dx=Math.abs(x1-x0),sx=x0<x1?1:-1,dy=-Math.abs(y1-y0),sy=y0<y1?1:-1;let err=dx+dy,x=x0,y=y0;while(true){circle(raw,x,y,width,[...color,255]);if(x===x1&&y===y1)break;const e2=2*err;if(e2>=dy){err+=dy;x+=sx}if(e2<=dx){err+=dx;y+=sy}}}
async function deflate(bytes){const stream=new CompressionStream('deflate'),writer=stream.writable.getWriter();await writer.write(bytes);await writer.close();return new Uint8Array(await new Response(stream.readable).arrayBuffer())}
async function png(){const raw=new Uint8Array(H*STRIDE);for(let y=0;y<H;y++){raw[y*STRIDE]=0;const t=y/(H-1),r=Math.round(250*(1-t)+239*t),g=Math.round(249*(1-t)+236*t),b=Math.round(255*(1-t)+255*t);for(let x=0;x<W;x++)pixel(raw,x,y,r,g,b,255)}
 roundish(raw,58,58,565,572,38,[255,255,255,255]);roundish(raw,82,88,238,116,14,[109,85,220,255]);roundish(raw,82,154,466,214,20,[45,40,64,255]);roundish(raw,82,236,492,260,12,[129,122,151,255]);roundish(raw,82,278,420,302,12,[154,147,174,255]);
 const chips=[[82,362,214],[230,362,342],[358,362,516]];for(const [x0,y0,x1] of chips){roundish(raw,x0,y0,x1,414,26,[244,241,255,255]);}
 const cx=846,cy=315;ring(raw,cx,cy,235,[109,85,220],2,42);ring(raw,cx,cy,174,[109,85,220],2,60);ring(raw,cx,cy,112,[109,85,220],2,82);line(raw,720,315,972,315,[172,159,235],4);circle(raw,710,315,82,[255,255,255,255],[109,85,220,255],5);circle(raw,982,315,82,[255,255,255,255],[231,93,154,255],5);circle(raw,846,315,38,[109,85,220,255]);circle(raw,846,315,12,[255,255,255,255]);
 for(const [x,y,c] of [[664,190,[95,143,217]],[1035,177,[82,170,168]],[1058,429,[217,154,64]],[655,454,[231,93,154]]]){circle(raw,x,y,10,[...c,255]);circle(raw,x,y,4,[255,255,255,255]);}
 const ihdr=concat(be32(W),be32(H),new Uint8Array([8,6,0,0,0])),idat=await deflate(raw);return concat(new Uint8Array([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',idat),chunk('IEND',new Uint8Array()))}
export async function onRequestGet(){const bytes=await png();return new Response(bytes,{headers:{'Content-Type':'image/png','Cache-Control':'public, max-age=86400, s-maxage=604800, immutable','X-Content-Type-Options':'nosniff','Content-Length':String(bytes.length)}})}
export async function onRequest(){return new Response('Method Not Allowed',{status:405,headers:{Allow:'GET'}})}
