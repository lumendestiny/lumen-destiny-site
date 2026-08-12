(()=>{
const q=new URLSearchParams(location.search);if((q.get('lang')||'').toLowerCase()!=='zh')return;
document.documentElement.lang='zh-CN';window.__LUMEN_LANG__='zh';localStorage.setItem('lumen-lang','zh');
const M=new Map([
['루멘 명운','鲁门命运'],['무료사주','免费四柱'],['금전운','财运'],['신년운세','新年运势'],['월간운세','月运'],['오늘의 운세','今日运势'],['궁합','合婚'],['가디언','Guardian'],
['만세력 결과를 계산하고 있습니다.','正在计算四柱结果。'],['입력한 출생정보를 바탕으로 사주 네 기둥과 주요 관계를 계산합니다.','根据输入的出生信息计算四柱及主要关系。'],['계산 엔진을 불러오는 중입니다…','正在加载计算引擎…'],['사주 네 기둥','四柱'],['절기 · 60갑자 기준','节气 · 六十甲子'],['십신 구조','十神结构'],['일간을 기준으로 다른 천간과 지장간이 어떤 관계를 맺는지 보여줍니다.','以日干为基准显示其他天干与藏干的关系。'],['지장간','藏干'],['각 지지 안에 전통적으로 배속되는 천간을 표시합니다.','显示传统上归属于各地支的天干。'],['합 · 충 · 형 · 파 · 해','合 · 冲 · 刑 · 破 · 害'],['네 지지 사이에서 확인되는 대표적인 관계를 정리합니다.','整理四个地支之间的主要关系。'],['표면 오행 분포','五行分布'],['천간과 지지의 대표 오행을 기준으로 여덟 글자의 분포를 보여줍니다.','按天干地支的代表五行显示八字分布。'],['기초 해설','基础解读'],['주제별 운세 해설','主题运势解读'],['무료 해설','免费解读'],['재물의 흐름','财富流向'],['올해의 방향','今年方向'],['이번 달의 흐름','本月趋势'],['오늘의 한 걸음','今日一步'],['두 사람 비교','两人比较'],['두 사람 궁합 보기','查看两人合婚'],['다른 정보로 다시 보기','使用其他信息重新查看'],['Lumen Guardian 보기','查看 Lumen Guardian'],['개인정보처리방침','隐私政策'],['이용약관','使用条款'],['고객지원','客户支持'],['운명을 보는 것이 아니라, 삶의 방향을 찾습니다.','不是预测命运，而是寻找人生方向。'],
['년주','年柱'],['월주','月柱'],['일주','日柱'],['시주','时柱'],['미입력','未输入'],['일간(본인)','日干（本人）'],['천간','天干'],['지지','地支'],['본기','本气'],['가장 많이 보이는 오행','最显著的五行'],['일간 · 나를 나타내는 천간','日干 · 代表自己的天干'],['계산 기준','计算基准'],['양력','公历'],['음력','农历'],['음력 윤달','农历闰月'],['절기 기준','节气基准'],['입력 화면으로 돌아가기','返回输入页面'],['입력 정보가 없습니다.','没有出生信息。'],['계산 엔진 연결을 확인해주세요.','请检查计算引擎连接。'],['결과를 계산하지 못했습니다.','无法计算结果。'],
['목(木)','木'],['화(火)','火'],['토(土)','土'],['금(金)','金'],['수(水)','水'],['비견','比肩'],['겁재','劫财'],['식신','食神'],['상관','伤官'],['편재','偏财'],['정재','正财'],['편관','七杀'],['정관','正官'],['편인','偏印'],['정인','正印'],['합','合'],['충','冲'],['형','刑'],['파','破'],['해','害'],['자형','自刑']
]);
const rx=[[/^(.*)님의 만세력 결과$/,'$1 的四柱结果'],[/^기준 양력 (\d+)년 (\d+)월 (\d+)일(.*)$/,'公历基准 $1年$2月$3日$4'],[/^(\d+)자 · ([\d.]+)%$/,'$1字 · $2%']];
function trText(t){const s=t.trim();if(!s)return t;let v=M.get(s);if(!v){for(const [r,repl] of rx){if(r.test(s)){v=s.replace(r,repl);break}}}return v?t.replace(s,v):t}
function apply(root=document.body){if(!root)return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())n.nodeValue=trText(n.nodeValue);document.title='四柱结果 | Lumen Destiny';document.documentElement.lang='zh-CN';window.__LUMEN_LANG__='zh';}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>apply());else apply();
let busy=false;const obs=new MutationObserver(ms=>{if(busy)return;busy=true;queueMicrotask(()=>{for(const m of ms)for(const n of m.addedNodes){if(n.nodeType===3)n.nodeValue=trText(n.nodeValue);else if(n.nodeType===1)apply(n)}busy=false})});obs.observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('load',()=>{apply();setTimeout(()=>apply(),250);setTimeout(()=>apply(),1000)});
})();