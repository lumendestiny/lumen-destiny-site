const SHARE_IMAGE='https://lumendestiny.com/api/lumen-link/share-image';
export async function onRequest(context){
 const response=await context.next();
 const type=response.headers.get('content-type')||'';
 if(!type.includes('text/html'))return response;
 let html=await response.text();
 html=html.replace('님이 당신과의 인연을<br>연결하고 싶어 합니다','님이 당신을 루멘 인연지도에<br>초대했습니다');
 html=html.replace('내 정보를 직접 입력하면 두 사람의 오행 보완 흐름을 계산해 인연지도에 연결합니다.','내 정보를 직접 입력하면 두 사람의 오행 흐름을 비교해 인연지도를 연결합니다. 출생정보 원본은 상대방에게 공개되지 않습니다.');
 html=html.replace('<meta name="twitter:card" content="summary">',`<meta property="og:image" content="${SHARE_IMAGE}"><meta property="og:image:secure_url" content="${SHARE_IMAGE}"><meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Lumen Destiny 인연지도 초대"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="${SHARE_IMAGE}">`);
 const headers=new Headers(response.headers);headers.delete('content-length');headers.set('cache-control','no-store');
 return new Response(html,{status:response.status,statusText:response.statusText,headers});
}
