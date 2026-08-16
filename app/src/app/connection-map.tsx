import { useEffect, useMemo, useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, Share, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import RelationshipImpactCard from '../components/relationship-impact-card';
import RelationshipNetworkInsights from '../components/relationship-network-insights';
import { calculateConnection, ConnectionResult, ELEMENT_ORDER, elementPercent } from '../lib/connection-engine';
import type { SajuInput } from '../lib/saju-session';
import {
 filterMembersByRelation,
 inferRelationGroup,
 memberRelationGroup,
 relationGroupLabel,
 RELATION_FILTER_OPTIONS,
 summarizeMemberImpact,
 summarizeNetwork,
 NetworkMember,
 RelationFilter,
 RelationGroup,
} from '../lib/connection-network';
import { addConnectionMember, loadConnectionNetwork, removeConnectionMember, updateConnectionMemberRelationGroup } from '../lib/connection-vault';
import { buildLumenLinkUrl, createLumenLinkInvite, getLumenLinkInviteStatus, LinkInvite } from '../lib/lumen-link-api';

type Person={name:string;birthDate:string;birthTime:string;calendar:'solar'|'lunar';relation:string};
type Elements=NetworkMember['elements'];
const empty=(relation='친구'):Person=>({name:'',birthDate:'',birthTime:'',calendar:'solar',relation});
const label:Record<string,string>={목:'성장 · 확장',화:'표현 · 추진',토:'안정 · 조율',금:'결단 · 질서',수:'유연 · 통찰'};
const slots=[
 {node:{left:'7%',top:74},line:{left:'29%',top:126,width:72,rotate:'18deg'}},
 {node:{right:'7%',top:74},line:{right:'29%',top:126,width:72,rotate:'-18deg'}},
 {node:{left:'2%',top:184},line:{left:'27%',top:178,width:86,rotate:'-18deg'}},
 {node:{right:'2%',top:184},line:{right:'27%',top:178,width:86,rotate:'18deg'}},
 {node:{left:'8%',top:266},line:{left:'30%',top:222,width:76,rotate:'-34deg'}},
 {node:{right:'8%',top:266},line:{right:'30%',top:222,width:76,rotate:'34deg'}},
] as const;
const compactSlots=[
 {node:{left:'5%',top:62},line:{left:'28%',top:107,width:54,rotate:'20deg'}},
 {node:{right:'5%',top:62},line:{right:'28%',top:107,width:54,rotate:'-20deg'}},
 {node:{left:'2%',top:164},line:{left:'27%',top:160,width:62,rotate:'-18deg'}},
 {node:{right:'2%',top:164},line:{right:'27%',top:160,width:62,rotate:'18deg'}},
 {node:{left:'6%',top:250},line:{left:'29%',top:211,width:56,rotate:'-34deg'}},
 {node:{right:'6%',top:250},line:{right:'29%',top:211,width:56,rotate:'34deg'}},
] as const;
const tinySlots=[
 {node:{left:'3%',top:58},line:{left:'28%',top:101,width:48,rotate:'20deg'}},
 {node:{right:'3%',top:58},line:{right:'28%',top:101,width:48,rotate:'-20deg'}},
 {node:{left:'1%',top:158},line:{left:'26%',top:154,width:54,rotate:'-18deg'}},
 {node:{right:'1%',top:158},line:{right:'26%',top:154,width:54,rotate:'18deg'}},
 {node:{left:'4%',top:247},line:{left:'28%',top:207,width:50,rotate:'-34deg'}},
 {node:{right:'4%',top:247},line:{right:'28%',top:207,width:50,rotate:'34deg'}},
] as const;

function bestSupport(source:Elements,target:Elements){return ELEMENT_ORDER.map(element=>({element,gap:(source[element]||0)-(target[element]||0)})).sort((a,b)=>b.gap-a.gap)[0]}
function rankSupporters(members:NetworkMember[],meElements:Elements|null){if(!meElements)return [];return members.map(member=>({member,support:bestSupport(member.elements,meElements)})).sort((a,b)=>b.member.score-a.member.score).slice(0,3)}
function bestMemberForElement(members:NetworkMember[],element:(typeof ELEMENT_ORDER)[number]){return [...members].sort((a,b)=>(b.elements[element]||0)-(a.elements[element]||0))[0]||null}

export default function ConnectionMapScreen(){
 const {width}=useWindowDimensions();
 const compact=width<480;
 const tiny=width<350;
 const[me,setMe]=useState<Person>(empty('나'));
 const[other,setOther]=useState<Person>(empty());
 const[result,setResult]=useState<ConnectionResult|null>(null);
 const[network,setNetwork]=useState<NetworkMember[]>([]);
 const[message,setMessage]=useState('');
 const[saveMessage,setSaveMessage]=useState('');
 const[invite,setInvite]=useState<LinkInvite|null>(null);
 const[inviteMessage,setInviteMessage]=useState('');
 const[inviteBusy,setInviteBusy]=useState(false);
 const[showElementDetails,setShowElementDetails]=useState(false);
 const[showPeopleList,setShowPeopleList]=useState(false);
 const[activeGroup,setActiveGroup]=useState<RelationFilter>('all');
 const[editingGroupId,setEditingGroupId]=useState<string|null>(null);
 useEffect(()=>{loadConnectionNetwork().then(setNetwork)},[]);
 const valid=(p:Person)=>!!p.name.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(p.birthDate.trim())&&(!p.birthTime.trim()||/^\d{2}:\d{2}$/.test(p.birthTime.trim()));
 const toInput=(p:Person):SajuInput=>({name:p.name.trim(),birthDate:p.birthDate.trim(),birthTime:p.birthTime.trim(),calendar:p.calendar,gender:'unspecified'});
 const filteredNetwork=useMemo(()=>filterMembersByRelation(network,activeGroup),[network,activeGroup]);
 const groupCounts=useMemo(()=>Object.fromEntries(RELATION_FILTER_OPTIONS.map(option=>[option.id,filterMembersByRelation(network,option.id).length])) as Record<RelationFilter,number>,[network]);
 const activeLabel=relationGroupLabel(activeGroup);
 const run=()=>{setMessage('');setSaveMessage('');setInvite(null);setInviteMessage('');setResult(null);setShowElementDetails(false);if(!valid(me)||!valid(other)){setMessage('두 사람의 이름과 생년월일(YYYY-MM-DD)을 확인해 주세요. 출생시간은 알면 HH:MM 형식으로 입력해 주세요.');return}try{setResult(calculateConnection(toInput(me),toInput(other)))}catch{setMessage('오행 연결 계산에 실패했습니다. 날짜와 시간을 다시 확인해 주세요.')}};
 const save=async()=>{if(!result)return;const relation=other.relation.trim()||'지인';const member:NetworkMember={id:`${result.b.name}-${Date.now()}`,name:result.b.name,relation,relationGroup:inferRelationGroup(relation),elements:result.b.elements,score:result.score,grade:result.grade,addedAt:new Date().toISOString()};setNetwork(await addConnectionMember(member));setSaveMessage(`${result.b.name}님을 인연지도에 추가했습니다. 출생정보 원본은 저장하지 않습니다.`)};
 const remove=async(id:string)=>{setEditingGroupId(null);setNetwork(await removeConnectionMember(id));};
 const changeGroup=async(id:string,group:RelationGroup)=>{setNetwork(await updateConnectionMemberRelationGroup(id,group));setEditingGroupId(null);};
 const networkSummary=useMemo(()=>result?summarizeNetwork(result.a.elements,network):null,[result,network]);
 const filteredSummary=useMemo(()=>result?summarizeNetwork(result.a.elements,filteredNetwork):null,[result,filteredNetwork]);
 const topSupporters=useMemo(()=>rankSupporters(network,result?.a.elements||null),[network,result]);
 const weakestElement=networkSummary?.weakest?.[0] as (typeof ELEMENT_ORDER)[number]|undefined;
 const weakestHelper=useMemo(()=>weakestElement?bestMemberForElement(network,weakestElement):null,[network,weakestElement]);
 const createInvite=async()=>{if(!result)return;setInviteBusy(true);setInviteMessage('');try{const next=await createLumenLinkInvite({inviterLabel:result.a.name,elements:result.a.elements,weakest:result.a.weakest});setInvite(next);setInviteMessage('7일 동안 한 번 사용할 수 있는 초대 링크를 만들었습니다.')}catch(e){setInviteMessage(e instanceof Error&&e.message==='link_not_enabled'?'서버의 인연지도 기능을 활성화한 뒤 실제 초대 링크를 사용할 수 있습니다.':'초대 링크 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.')}finally{setInviteBusy(false)}};
 const shareInvite=async()=>{if(!invite)return;const url=buildLumenLinkUrl(invite.token);await Share.share({title:'인연지도 초대',message:`${me.name||'지인'}님이 인연지도에 초대했습니다.\n${url}`,url})};
 const checkInvite=async()=>{if(!invite)return;setInviteBusy(true);setInviteMessage('');try{const status=await getLumenLinkInviteStatus(invite.token);if(!status.relationship){setInviteMessage(status.invite.status==='open'?'아직 상대방이 참여하지 않았습니다.':'초대 상태를 확인했습니다.');return}const r=status.relationship;const relation=r.relationLabel||'링크 참여';const member:NetworkMember={id:r.id,name:r.participantLabel,relation,relationGroup:inferRelationGroup(relation),elements:r.elements as NetworkMember['elements'],score:r.score,grade:r.grade as NetworkMember['grade'],addedAt:r.createdAt};setNetwork(await addConnectionMember(member));setInviteMessage(`${r.participantLabel}님의 참여 결과를 내 인연지도에 합쳤습니다.`)}catch{setInviteMessage('참여 상태를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.')}finally{setInviteBusy(false)}};
 return <ScrollView contentContainerStyle={[styles.page,compact&&styles.pageCompact]} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentInsetAdjustmentBehavior="automatic">
  <Text style={styles.eyebrow}>LUMEN DESTINY</Text><Text style={[styles.title,compact&&styles.titleCompact]}>인연지도</Text><Text style={[styles.lead,compact&&styles.leadCompact]}>나를 중심으로 가족·친구·동료의 이름을 지도에 연결하고, 서로 어떤 오행을 보완하는지 한눈에 살펴봅니다.</Text>
  <View style={[styles.notice,compact&&styles.noticeCompact]}><Text style={styles.noticeTitle}>개인정보 최소화</Text><Text style={styles.noticeCopy}>지도에는 상대가 선택한 표시 이름과 관계·오행 보완 결과만 보여줍니다. 생년월일·출생시간 원본은 상대방 이름 옆이나 지도에 표시하지 않습니다.</Text></View>
  <PersonCard title="나" value={me} onChange={setMe} showRelation={false} compact={compact}/><PersonCard title="연결할 사람" value={other} onChange={setOther} showRelation compact={compact}/><Pressable style={styles.primary} onPress={run}><Text style={styles.primaryText}>인연지도 계산하기</Text></Pressable>{message?<Text style={styles.message}>{message}</Text>:null}
  {result?<><View style={[styles.scoreBox,compact&&styles.scoreBoxCompact]}><Text style={[styles.score,compact&&styles.scoreCompact]}>{result.score}</Text><View style={styles.flexText}><Text style={styles.scoreLabel}>오행 보완도</Text><Text style={styles.grade}>{result.grade}</Text></View></View><View style={[styles.section,compact&&styles.sectionCompact]}><Text style={styles.sectionTitle}>서로 보완되는 흐름</Text><Text style={styles.body}>{result.summary}</Text>{result.strongestForA?<Text style={styles.insight}>{result.b.name} → {result.a.name} · {result.strongestForA.element} 보완</Text>:null}{result.strongestForB?<Text style={styles.insight}>{result.a.name} → {result.b.name} · {result.strongestForB.element} 보완</Text>:null}<Pressable style={styles.saveButton} onPress={save}><Text style={styles.saveButtonText}>{result.b.name}님을 내 인연지도에 추가</Text></Pressable>{saveMessage?<Text style={styles.success}>{saveMessage}</Text>:null}</View>{compact?<Pressable style={styles.disclosureButton} onPress={()=>setShowElementDetails(v=>!v)}><Text style={styles.disclosureText}>{showElementDetails?'두 사람의 오행 상세 접기':'두 사람의 오행 상세 보기'}</Text><Text style={styles.disclosureIcon}>{showElementDetails?'−':'+'}</Text></Pressable>:null}{(!compact||showElementDetails)?<><View style={[styles.section,compact&&styles.sectionCompact]}><Text style={styles.sectionTitle}>{result.a.name}님의 오행</Text>{ELEMENT_ORDER.map(k=><ElementRow key={k} name={k} value={elementPercent(result.a.elements,k)} compact={compact}/>)}</View><View style={[styles.section,compact&&styles.sectionCompact]}><Text style={styles.sectionTitle}>{result.b.name}님의 오행</Text>{ELEMENT_ORDER.map(k=><ElementRow key={k} name={k} value={elementPercent(result.b.elements,k)} compact={compact}/>)}</View></>:null}</>:null}
  <View style={[styles.section,compact&&styles.sectionCompact]}><Text style={styles.sectionTitle}>내 인연지도</Text><Text style={styles.mapGuide}>관계 필터를 누르면 중앙 지도와 아래 분석이 함께 바뀝니다. 자동 분류가 맞지 않으면 인연 목록에서 관계군을 직접 수정할 수 있습니다.</Text><View style={styles.filterRow}>{RELATION_FILTER_OPTIONS.map(option=>{const active=activeGroup===option.id;return <Pressable key={option.id} onPress={()=>{setActiveGroup(option.id);setEditingGroupId(null);}} style={[styles.filterChip,active&&styles.filterChipActive,tiny&&styles.filterChipTiny]}><Text style={[styles.filterText,active&&styles.filterTextActive]}>{option.label}</Text><Text style={[styles.filterCount,active&&styles.filterCountActive]}>{groupCounts[option.id]}</Text></Pressable>})}</View><Text style={styles.activeMapLabel}>{activeLabel} 인연지도 · {filteredNetwork.length}명</Text>{filteredNetwork.length?<NetworkMap meName={result?.a.name||me.name||'나'} meElements={result?.a.elements||null} members={filteredNetwork} compact={compact} tiny={tiny}/>:<View style={styles.emptyMap}><Text style={styles.emptyMapTitle}>{activeLabel} 인연이 아직 없습니다.</Text><Text style={styles.emptyMapCopy}>다른 관계군을 선택하거나 아래 목록에서 관계군을 수정해 주세요.</Text></View>}{network.length?<>{compact?<Pressable style={styles.listToggle} onPress={()=>setShowPeopleList(v=>!v)}><Text style={styles.listToggleText}>{showPeopleList?'인연 목록 접기':`${activeLabel} 인연 ${filteredNetwork.length}명 목록 보기`}</Text><Text style={styles.disclosureIcon}>{showPeopleList?'−':'+'}</Text></Pressable>:null}{(!compact||showPeopleList)?filteredNetwork.map(m=><View key={m.id} style={styles.personWrap}><View style={styles.personCard}><View style={styles.flexText}><Text numberOfLines={1} ellipsizeMode="tail" style={styles.personTitle}>{m.name} · {m.relation}</Text><Text style={styles.personCopy}>보완도 {m.score} · {m.grade} · 분류 {relationGroupLabel(memberRelationGroup(m))}</Text></View><View style={styles.personActions}><Pressable style={styles.groupEditButton} onPress={()=>setEditingGroupId(editingGroupId===m.id?null:m.id)}><Text style={styles.groupEditText}>분류 수정</Text></Pressable><Pressable style={styles.removeButton} onPress={()=>remove(m.id)}><Text style={styles.remove}>삭제</Text></Pressable></View></View>{editingGroupId===m.id?<View style={styles.groupEditor}><Text style={styles.groupEditorTitle}>이 인연의 관계군</Text><View style={styles.groupEditorRow}>{RELATION_FILTER_OPTIONS.filter(option=>option.id!=='all').map(option=>{const group=option.id as RelationGroup;const active=memberRelationGroup(m)===group;return <Pressable key={group} style={[styles.groupChoice,active&&styles.groupChoiceActive]} onPress={()=>changeGroup(m.id,group)}><Text style={[styles.groupChoiceText,active&&styles.groupChoiceTextActive]}>{option.label}</Text></Pressable>})}</View><Text style={styles.groupEditorCopy}>표시 관계명은 그대로 두고 지도에서 사용하는 관계군만 변경합니다.</Text></View>:null}</View>):null}</>:<Text style={styles.body}>아직 연결된 인연이 없습니다. 한 사람을 계산해 추가하거나 초대 링크를 보내면 이름이 지도에 표시됩니다.</Text>}{filteredSummary&&filteredNetwork.length?<><Text style={styles.networkHeadline}>{activeLabel} 균형도 {filteredSummary.coverage}</Text><Text style={styles.body}>{filteredSummary.message}</Text>{ELEMENT_ORDER.map(k=><ElementRow key={`net-${activeGroup}-${k}`} name={k} value={filteredSummary.aggregate[k]} compact={compact}/>)}</>:null}</View>
  {network.length&&result&&networkSummary?<View style={[styles.summaryBox,compact&&styles.summaryBoxCompact]}><Text style={styles.summaryTitle}>나의 인연 요약</Text><Text style={styles.summaryLead}>전체 인연망과 현재 선택한 관계군을 함께 보면서, 어떤 사람이 어떤 기운을 보완하는지 비교할 수 있습니다.</Text><View style={[styles.balanceCard,compact&&styles.balanceCardCompact]}><View style={styles.balanceSide}><Text style={styles.balanceLabel}>연결 전</Text><Text style={[styles.balanceValue,compact&&styles.balanceValueCompact]}>{networkSummary.personalCoverage}</Text><Text style={styles.balanceCaption}>나의 균형도</Text></View><Text style={styles.balanceArrow}>→</Text><View style={styles.balanceSide}><Text style={styles.balanceLabel}>전체 현재</Text><Text style={[styles.balanceValue,compact&&styles.balanceValueCompact]}>{networkSummary.coverage}</Text><Text style={styles.balanceCaption}>인연망 균형도</Text></View><View style={[styles.deltaBadge,compact&&styles.deltaBadgeCompact,networkSummary.balanceDelta<0&&styles.deltaBadgeDown]}><Text style={[styles.deltaText,networkSummary.balanceDelta<0&&styles.deltaTextDown]}>{networkSummary.balanceDelta>0?'+':''}{networkSummary.balanceDelta}</Text></View></View><Text style={styles.balanceExplain}>{networkSummary.balanceDelta>0?`전체 인연이 연결되며 오행 균형도가 ${networkSummary.balanceDelta}점 높아졌습니다.`:networkSummary.balanceDelta<0?`현재 전체 인연 구성은 개인 기준보다 ${Math.abs(networkSummary.balanceDelta)}점 낮습니다. 다양한 기운의 관계를 더 살펴볼 수 있습니다.`:'현재 전체 인연망의 균형도는 개인 기준과 같습니다.'}</Text><Text style={styles.summarySub}>귀인 TOP 3</Text>{topSupporters.map(({member,support},i)=><View key={member.id} style={styles.rankRow}><View style={styles.rankNo}><Text style={styles.rankNoText}>{i+1}</Text></View><View style={styles.flexText}><Text numberOfLines={1} ellipsizeMode="tail" style={styles.rankName}>{member.name} · {member.relation}</Text><Text style={styles.rankMeta}>보완도 {member.score} · {support.element} 기운 보완</Text></View></View>)}{weakestElement?<View style={styles.weakInsight}><Text style={styles.weakLabel}>전체 인연망에서 가장 부족한 기운</Text><Text style={styles.weakValue}>{weakestElement}</Text><Text style={styles.weakCopy}>{weakestHelper?`${weakestHelper.name}님이 현재 연결된 사람 중 ${weakestElement} 기운을 가장 많이 가지고 있습니다.`:`${weakestElement} 기운을 보완해 줄 새로운 인연을 연결해 보세요.`}</Text></View>:null}<View style={styles.nextBox}><Text style={styles.nextTitle}>다음에 살펴볼 인연</Text><Text style={styles.nextElements}>{networkSummary.recommendedElements.join(' · ')}</Text><Text style={styles.nextCopy}>{networkSummary.recommendedElements.map(k=>`${k}(${label[k]})`).join(', ')} 기운이 상대적으로 낮습니다. 이 기운을 가진 사람을 무조건 좋은 인연으로 판단하는 것이 아니라, 현재 인연망의 균형을 이해하기 위한 참고 지표로 활용합니다.</Text></View><RelationshipNetworkInsights meElements={result.a.elements} members={network} activeGroup={activeGroup}/></View>:null}
  <View style={[styles.section,compact&&styles.sectionCompact]}><Text style={styles.sectionTitle}>지인을 링크로 초대하기</Text><Text style={styles.body}>초대받은 사람은 자신의 정보를 직접 입력하고 참여합니다. 참여가 완료되면 그 사람이 선택한 이름이 인연지도에 추가됩니다.</Text>{result?<Pressable style={styles.inviteButton} disabled={inviteBusy} onPress={createInvite}><Text style={styles.inviteButtonText}>{inviteBusy?'처리 중…':'7일 · 1회용 초대 링크 만들기'}</Text></Pressable>:<Text style={styles.insight}>먼저 위에서 한 번 계산하면 초대 링크를 만들 수 있습니다.</Text>}{invite?<View style={[styles.qrBox,compact&&styles.qrBoxCompact]}><QRCode value={buildLumenLinkUrl(invite.token)} size={compact?152:168}/><Text selectable style={styles.url}>{buildLumenLinkUrl(invite.token)}</Text><Text style={styles.expiry}>만료: {new Date(invite.expiresAt).toLocaleString()}</Text><Pressable style={styles.shareButton} onPress={shareInvite}><Text style={styles.shareButtonText}>카카오톡 · 문자 · WhatsApp 등으로 공유</Text></Pressable><Pressable style={styles.statusButton} disabled={inviteBusy} onPress={checkInvite}><Text style={styles.statusButtonText}>상대방 참여 결과 확인</Text></Pressable></View>:null}{inviteMessage?<Text style={styles.success}>{inviteMessage}</Text>:null}</View>
  <View style={[styles.guardianBox,compact&&styles.guardianBoxCompact]}><Text style={styles.sectionTitle}>인연망에서도 부족한 기운</Text><Text style={styles.body}>{networkSummary?.weakest?.length?`현재 저장된 인연망에서는 ${networkSummary.weakest.join(' · ')} 기운이 상대적으로 가장 낮습니다. 의미를 먼저 확인한 뒤 필요한 경우 Guardian을 살펴볼 수 있습니다.`:'여러 지인이 연결되면 전체 인연망에서 반복해서 보완되지 않는 오행을 계산합니다.'}</Text><Link href="/guardian" asChild><Pressable style={styles.guardianButton}><Text style={styles.guardianButtonText}>Guardian 살펴보기 →</Text></Pressable></Link></View><Text style={styles.privacy}>※ 오행 보완도는 전통 명리 요소를 구조화한 참고 콘텐츠입니다. 인간관계의 가치나 미래를 확정하지 않습니다.</Text>
 </ScrollView>
}

function NetworkMap({meName,meElements,members,compact,tiny}:{meName:string;meElements:Elements|null;members:NetworkMember[];compact:boolean;tiny:boolean}){
 const[selectedId,setSelectedId]=useState<string|null>(null);
 const visible=[...members].sort((a,b)=>b.score-a.score).slice(0,6);
 const selected=members.find(m=>m.id===selectedId)||null;
 const strongest=(m:NetworkMember)=>ELEMENT_ORDER.slice().sort((a,b)=>(m.elements[b]||0)-(m.elements[a]||0))[0];
 const weakest=(m:NetworkMember)=>ELEMENT_ORDER.slice().sort((a,b)=>(m.elements[a]||0)-(m.elements[b]||0))[0];
 const toMe=selected&&meElements?bestSupport(selected.elements,meElements):null;
 const fromMe=selected&&meElements?bestSupport(meElements,selected.elements):null;
 const impact=selected&&meElements?summarizeMemberImpact(meElements,members,selected.id):null;
 const activeSlots=tiny?tinySlots:compact?compactSlots:slots;
 return <><View style={[styles.mapBoard,compact&&styles.mapBoardCompact,tiny&&styles.mapBoardTiny]}>{visible.map((m,i)=>{const s=activeSlots[i];return <View key={`line-${m.id}`} style={[styles.connector,{left:(s.line as any).left,right:(s.line as any).right,top:s.line.top,width:s.line.width,transform:[{rotate:s.line.rotate}]}]}/>})}<View style={[styles.meNode,compact&&styles.meNodeCompact,tiny&&styles.meNodeTiny]}><Text numberOfLines={1} ellipsizeMode="tail" style={[styles.meNodeName,compact&&styles.meNodeNameCompact,tiny&&styles.meNodeNameTiny]}>{meName}</Text><Text style={styles.meNodeSub}>나</Text></View>{visible.map((m,i)=>{const s=activeSlots[i],active=selectedId===m.id;return <Pressable key={m.id} onPress={()=>setSelectedId(active?null:m.id)} style={[styles.personNode,compact&&styles.personNodeCompact,tiny&&styles.personNodeTiny,{left:(s.node as any).left,right:(s.node as any).right,top:s.node.top},active&&styles.personNodeActive]}><Text numberOfLines={1} ellipsizeMode="tail" style={[styles.nodeName,compact&&styles.nodeNameCompact,tiny&&styles.nodeNameTiny]}>{m.name}</Text><Text numberOfLines={1} ellipsizeMode="tail" style={[styles.nodeRelation,compact&&styles.nodeRelationCompact,tiny&&styles.nodeRelationTiny]}>{m.relation}</Text><Text style={styles.nodeScore}>{m.score}</Text></Pressable>})}{members.length>6?<View style={styles.moreNode}><Text style={styles.moreNodeText}>+{members.length-6}명</Text></View>:null}</View>{selected?<View style={[styles.nodeDetail,compact&&styles.nodeDetailCompact]}><View style={styles.nodeDetailHead}><View style={styles.nodeDetailTitleWrap}><Text numberOfLines={2} ellipsizeMode="tail" style={styles.nodeDetailName}>{selected.name}</Text><Text numberOfLines={1} ellipsizeMode="tail" style={styles.nodeDetailRelation}>{selected.relation} · {relationGroupLabel(memberRelationGroup(selected))} · 보완도 {selected.score}</Text></View><Text style={styles.nodeDetailGrade}>{selected.grade}</Text></View><View style={styles.nodeDetailGrid}><View style={styles.nodeDetailStat}><Text style={styles.nodeDetailLabel}>강한 기운</Text><Text style={styles.nodeDetailValue}>{strongest(selected)}</Text></View><View style={styles.nodeDetailStat}><Text style={styles.nodeDetailLabel}>낮은 기운</Text><Text style={styles.nodeDetailValue}>{weakest(selected)}</Text></View></View>{toMe&&fromMe?<View style={styles.directionBox}><Text style={styles.directionTitle}>서로 보완하는 방향</Text><Text style={styles.directionText}>{selected.name} → {meName} · <Text style={styles.directionElement}>{toMe.element}</Text> 기운 보완</Text><Text style={styles.directionText}>{meName} → {selected.name} · <Text style={styles.directionElement}>{fromMe.element}</Text> 기운 보완</Text></View>:<Text style={styles.nodeDetailCopy}>내 명식을 한 번 계산하면 서로 어느 오행을 보완하는지 방향별로 표시됩니다.</Text>}<RelationshipImpactCard impact={impact} memberName={selected.name}/><Link href={{pathname:'/compatibility',params:{aName:meName,bName:selected.name}}} asChild><Pressable style={styles.compatButton}><Text style={styles.compatButtonText}>{selected.name}님과 궁합 상세 보기 →</Text></Pressable></Link><Text style={styles.nodeDetailCopy}>궁합 화면에는 이름만 전달합니다. 생년월일·출생시간은 저장하거나 자동 전달하지 않습니다.</Text></View>:null}</>
}

function PersonCard({title,value,onChange,showRelation,compact}:{title:string;value:Person;onChange:(v:Person)=>void;showRelation:boolean;compact:boolean}){return <View style={[styles.section,compact&&styles.sectionCompact]}><Text style={styles.sectionTitle}>{title}</Text>{showRelation?<TextInput style={styles.input} value={value.relation} onChangeText={x=>onChange({...value,relation:x})} placeholder="관계 · 예: 친구, 가족, 동료"/>:null}<TextInput style={styles.input} value={value.name} onChangeText={x=>onChange({...value,name:x})} placeholder="지도에 표시할 이름 또는 닉네임"/><TextInput style={styles.input} value={value.birthDate} onChangeText={x=>onChange({...value,birthDate:x})} placeholder="생년월일 YYYY-MM-DD" keyboardType="numbers-and-punctuation"/><TextInput style={styles.input} value={value.birthTime} onChangeText={x=>onChange({...value,birthTime:x})} placeholder="출생시간 HH:MM · 모르면 비워두기" keyboardType="numbers-and-punctuation"/><View style={styles.toggleRow}>{(['solar','lunar'] as const).map(v=><Pressable key={v} onPress={()=>onChange({...value,calendar:v})} style={[styles.toggle,value.calendar===v&&styles.toggleOn]}><Text style={[styles.toggleText,value.calendar===v&&styles.toggleTextOn]}>{v==='solar'?'양력':'음력'}</Text></Pressable>)}</View></View>}
function ElementRow({name,value,compact}:{name:(typeof ELEMENT_ORDER)[number];value:number;compact:boolean}){return <View style={styles.elementRow}><View style={[styles.elementName,compact&&styles.elementNameCompact]}><Text style={styles.elementHan}>{name}</Text><Text style={styles.elementLabel}>{label[name]}</Text></View><View style={styles.track}><View style={[styles.fill,{width:`${Math.max(4,value)}%`}]} /></View><Text style={styles.percent}>{value}%</Text></View>}

const styles=StyleSheet.create({
 page:{width:'100%',maxWidth:720,alignSelf:'center',padding:20,paddingBottom:50,backgroundColor:'#fff'},
 pageCompact:{paddingHorizontal:14,paddingTop:8,paddingBottom:40},
 eyebrow:{marginTop:18,fontSize:12,letterSpacing:2.4,fontWeight:'800',color:'#5146c8'},
 title:{marginTop:10,fontSize:34,lineHeight:42,fontWeight:'900',letterSpacing:-1.2},
 titleCompact:{fontSize:30,lineHeight:37,letterSpacing:-1},
 lead:{marginTop:12,fontSize:17,lineHeight:27,color:'#4d5260'},
 leadCompact:{fontSize:15,lineHeight:23},
 notice:{marginTop:24,padding:18,borderRadius:18,backgroundColor:'#f3f1ff'},
 noticeCompact:{marginTop:18,padding:14,borderRadius:16},
 noticeTitle:{fontSize:16,fontWeight:'800',color:'#5146c8'},
 noticeCopy:{marginTop:8,fontSize:14,lineHeight:22,color:'#555968'},
 section:{marginTop:18,padding:18,borderWidth:1,borderColor:'#e7e8ed',borderRadius:20},
 sectionCompact:{marginTop:14,padding:14,borderRadius:16},
 sectionTitle:{fontSize:20,fontWeight:'900'},
 input:{marginTop:10,minHeight:48,borderWidth:1,borderColor:'#dfe1e8',borderRadius:12,paddingHorizontal:12,paddingVertical:12,fontSize:16,backgroundColor:'#fff'},
 toggleRow:{flexDirection:'row',gap:8,marginTop:10},
 toggle:{flex:1,minHeight:44,borderWidth:1,borderColor:'#dadce5',borderRadius:10,alignItems:'center',justifyContent:'center'},
 toggleOn:{backgroundColor:'#5146c8',borderColor:'#5146c8'},
 toggleText:{fontSize:13,fontWeight:'800',color:'#5d6370'},
 toggleTextOn:{color:'#fff'},
 primary:{marginTop:18,minHeight:52,borderRadius:14,backgroundColor:'#1f2330',alignItems:'center',justifyContent:'center',paddingHorizontal:14},
 primaryText:{color:'#fff',fontWeight:'900',textAlign:'center'},
 message:{marginTop:10,fontSize:13,lineHeight:20,color:'#9a4747'},
 success:{marginTop:10,fontSize:12,lineHeight:19,color:'#327457'},
 scoreBox:{marginTop:22,padding:18,borderRadius:20,backgroundColor:'#f7f6ff',flexDirection:'row',alignItems:'center',gap:18},
 scoreBoxCompact:{marginTop:16,padding:14,borderRadius:16,gap:14},
 score:{fontSize:48,fontWeight:'900',color:'#5146c8'},
 scoreCompact:{fontSize:42},
 scoreLabel:{fontSize:13,fontWeight:'800',color:'#686d79'},
 grade:{marginTop:3,fontSize:20,fontWeight:'900'},
 flexText:{flex:1,minWidth:0},
 elementRow:{marginTop:16,flexDirection:'row',alignItems:'center',gap:10},
 elementName:{width:84},
 elementNameCompact:{width:72},
 elementHan:{fontSize:18,fontWeight:'900'},
 elementLabel:{marginTop:2,fontSize:11,color:'#727783'},
 track:{flex:1,minWidth:24,height:8,borderRadius:999,backgroundColor:'#ececf1',overflow:'hidden'},
 fill:{height:'100%',borderRadius:999,backgroundColor:'#5146c8'},
 percent:{width:36,textAlign:'right',fontWeight:'700'},
 disclosureButton:{marginTop:12,minHeight:46,paddingHorizontal:14,borderRadius:13,backgroundColor:'#f8f8fb',flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 disclosureText:{fontSize:13,fontWeight:'900',color:'#555a66'},
 disclosureIcon:{fontSize:20,lineHeight:24,fontWeight:'700',color:'#5146c8'},
 mapGuide:{marginTop:8,fontSize:13,lineHeight:20,color:'#727783'},
 filterRow:{marginTop:12,flexDirection:'row',flexWrap:'wrap',gap:7},
 filterChip:{minHeight:42,paddingHorizontal:11,paddingVertical:7,borderRadius:999,borderWidth:1,borderColor:'#e1e2e8',backgroundColor:'#fff',flexDirection:'row',alignItems:'center',gap:5},
 filterChipTiny:{paddingHorizontal:9},
 filterChipActive:{borderColor:'#5146c8',backgroundColor:'#5146c8'},
 filterText:{fontSize:11,fontWeight:'900',color:'#555a66'},
 filterTextActive:{color:'#fff'},
 filterCount:{minWidth:18,height:18,paddingHorizontal:4,borderRadius:9,textAlign:'center',textAlignVertical:'center',fontSize:9,fontWeight:'900',color:'#777d89',backgroundColor:'#f1f1f5'},
 filterCountActive:{color:'#5146c8',backgroundColor:'#fff'},
 activeMapLabel:{marginTop:14,fontSize:14,fontWeight:'900',color:'#5146c8'},
 emptyMap:{marginTop:14,minHeight:130,borderRadius:18,backgroundColor:'#f8f8fb',alignItems:'center',justifyContent:'center',padding:18},
 emptyMapTitle:{fontSize:15,fontWeight:'900',color:'#474b59'},
 emptyMapCopy:{marginTop:6,fontSize:12,lineHeight:19,color:'#777d89',textAlign:'center'},
 mapBoard:{height:370,marginTop:14,borderRadius:22,backgroundColor:'#f8f7ff',overflow:'hidden',position:'relative'},
 mapBoardCompact:{height:330,borderRadius:18},
 mapBoardTiny:{height:324},
 connector:{position:'absolute',height:2,backgroundColor:'#cdc8f7'},
 meNode:{position:'absolute',left:'50%',top:132,marginLeft:-45,width:90,height:90,borderRadius:45,backgroundColor:'#1f2330',alignItems:'center',justifyContent:'center',zIndex:3,padding:8},
 meNodeCompact:{top:124,marginLeft:-36,width:72,height:72,borderRadius:36,padding:6},
 meNodeTiny:{top:121,marginLeft:-32,width:64,height:64,borderRadius:32,padding:5},
 meNodeName:{maxWidth:74,color:'#fff',fontSize:15,fontWeight:'900'},
 meNodeNameCompact:{maxWidth:60,fontSize:13},
 meNodeNameTiny:{maxWidth:52,fontSize:12},
 meNodeSub:{marginTop:4,color:'#c9cbd4',fontSize:11,fontWeight:'700'},
 personNode:{position:'absolute',width:98,minHeight:72,borderRadius:18,backgroundColor:'#fff',borderWidth:1,borderColor:'#dedbef',alignItems:'center',justifyContent:'center',paddingHorizontal:8,paddingVertical:8,zIndex:2},
 personNodeCompact:{width:80,minHeight:66,borderRadius:16,paddingHorizontal:6,paddingVertical:6},
 personNodeTiny:{width:70,minHeight:62,borderRadius:15,paddingHorizontal:5,paddingVertical:5},
 personNodeActive:{borderColor:'#5146c8',borderWidth:2,backgroundColor:'#f1efff'},
 nodeName:{maxWidth:82,fontSize:14,fontWeight:'900',color:'#242735'},
 nodeNameCompact:{maxWidth:68,fontSize:13},
 nodeNameTiny:{maxWidth:58,fontSize:12},
 nodeRelation:{marginTop:2,maxWidth:82,fontSize:10,color:'#777d89'},
 nodeRelationCompact:{maxWidth:68},
 nodeRelationTiny:{maxWidth:58,fontSize:9},
 nodeScore:{marginTop:4,fontSize:12,fontWeight:'900',color:'#5146c8'},
 moreNode:{position:'absolute',left:'50%',bottom:8,marginLeft:-31,width:62,height:30,borderRadius:15,backgroundColor:'#ece9ff',alignItems:'center',justifyContent:'center'},
 moreNodeText:{fontSize:12,fontWeight:'900',color:'#5146c8'},
 nodeDetail:{marginTop:12,padding:16,borderRadius:16,backgroundColor:'#f6f4ff',borderWidth:1,borderColor:'#e0dcff'},
 nodeDetailCompact:{padding:14},
 nodeDetailHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 nodeDetailTitleWrap:{flex:1,minWidth:0,paddingRight:8},
 nodeDetailName:{fontSize:18,fontWeight:'900',color:'#242735'},
 nodeDetailRelation:{marginTop:3,fontSize:12,color:'#6b7080'},
 nodeDetailGrade:{fontSize:12,fontWeight:'900',color:'#5146c8',flexShrink:0},
 nodeDetailGrid:{flexDirection:'row',gap:10,marginTop:14},
 nodeDetailStat:{flex:1,padding:12,borderRadius:12,backgroundColor:'#fff'},
 nodeDetailLabel:{fontSize:11,color:'#777d89'},
 nodeDetailValue:{marginTop:4,fontSize:19,fontWeight:'900',color:'#242735'},
 directionBox:{marginTop:12,padding:13,borderRadius:13,backgroundColor:'#fff'},
 directionTitle:{fontSize:12,fontWeight:'900',color:'#474b59'},
 directionText:{marginTop:7,fontSize:13,lineHeight:20,color:'#5d6370'},
 directionElement:{fontWeight:'900',color:'#5146c8'},
 compatButton:{marginTop:13,minHeight:48,paddingHorizontal:12,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:'#5146c8'},
 compatButtonText:{fontSize:13,fontWeight:'900',color:'#fff',textAlign:'center'},
 nodeDetailCopy:{marginTop:10,fontSize:12,lineHeight:19,color:'#6b7080'},
 listToggle:{marginTop:12,minHeight:46,paddingHorizontal:13,borderRadius:13,backgroundColor:'#f8f8fb',borderWidth:1,borderColor:'#ececf1',flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 listToggleText:{fontSize:13,fontWeight:'900',color:'#555a66'},
 personWrap:{marginTop:12},
 personCard:{minHeight:62,padding:12,borderRadius:14,backgroundColor:'#f8f8fb',flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
 personTitle:{fontSize:15,fontWeight:'800'},
 personCopy:{marginTop:3,fontSize:12,color:'#666b77'},
 personActions:{marginLeft:8,alignItems:'flex-end'},
 groupEditButton:{minHeight:32,paddingHorizontal:8,borderRadius:9,backgroundColor:'#ece9ff',alignItems:'center',justifyContent:'center'},
 groupEditText:{fontSize:10,fontWeight:'900',color:'#5146c8'},
 removeButton:{minWidth:44,minHeight:32,marginTop:2,alignItems:'center',justifyContent:'center'},
 remove:{fontSize:11,fontWeight:'800',color:'#9a4747'},
 groupEditor:{marginTop:6,padding:12,borderRadius:13,backgroundColor:'#f7f6ff',borderWidth:1,borderColor:'#e5e1ff'},
 groupEditorTitle:{fontSize:12,fontWeight:'900',color:'#474b59'},
 groupEditorRow:{marginTop:8,flexDirection:'row',flexWrap:'wrap',gap:6},
 groupChoice:{minHeight:38,paddingHorizontal:10,borderRadius:999,borderWidth:1,borderColor:'#dedfea',backgroundColor:'#fff',alignItems:'center',justifyContent:'center'},
 groupChoiceActive:{borderColor:'#5146c8',backgroundColor:'#5146c8'},
 groupChoiceText:{fontSize:10,fontWeight:'900',color:'#555a66'},
 groupChoiceTextActive:{color:'#fff'},
 groupEditorCopy:{marginTop:7,fontSize:10,lineHeight:16,color:'#7a7f8b'},
 summaryBox:{marginTop:18,padding:18,borderRadius:20,backgroundColor:'#f7f6ff',borderWidth:1,borderColor:'#e5e1ff'},
 summaryBoxCompact:{marginTop:14,padding:14,borderRadius:16},
 summaryTitle:{fontSize:20,fontWeight:'900',color:'#242735'},
 summaryLead:{marginTop:7,fontSize:13,lineHeight:20,color:'#686d79'},
 summarySub:{marginTop:18,fontSize:14,fontWeight:'900',color:'#5146c8'},
 balanceCard:{marginTop:16,flexDirection:'row',alignItems:'center',gap:8,padding:14,borderRadius:16,backgroundColor:'#fff'},
 balanceCardCompact:{gap:6,paddingHorizontal:10,paddingVertical:12,borderRadius:14},
 balanceSide:{flex:1,minWidth:0,alignItems:'center'},
 balanceLabel:{fontSize:11,fontWeight:'800',color:'#777d89'},
 balanceValue:{marginTop:3,fontSize:28,fontWeight:'900',color:'#242735'},
 balanceValueCompact:{fontSize:24},
 balanceCaption:{marginTop:2,fontSize:10,color:'#8a8e99',textAlign:'center'},
 balanceArrow:{fontSize:20,fontWeight:'900',color:'#aaa6ca',flexShrink:0},
 deltaBadge:{paddingHorizontal:9,paddingVertical:6,borderRadius:999,backgroundColor:'#e7f5ee',flexShrink:0},
 deltaBadgeCompact:{paddingHorizontal:7,paddingVertical:5},
 deltaBadgeDown:{backgroundColor:'#f7eaea'},
 deltaText:{fontSize:12,fontWeight:'900',color:'#327457'},
 deltaTextDown:{color:'#9a4747'},
 balanceExplain:{marginTop:9,fontSize:12,lineHeight:19,color:'#626776'},
 rankRow:{marginTop:10,flexDirection:'row',alignItems:'center',gap:10,padding:12,borderRadius:14,backgroundColor:'#fff'},
 rankNo:{width:30,height:30,borderRadius:15,backgroundColor:'#ece9ff',alignItems:'center',justifyContent:'center'},
 rankNoText:{fontSize:13,fontWeight:'900',color:'#5146c8'},
 rankName:{fontSize:14,fontWeight:'900',color:'#2d3040'},
 rankMeta:{marginTop:3,fontSize:12,color:'#6d7280'},
 weakInsight:{marginTop:16,padding:15,borderRadius:15,backgroundColor:'#fff'},
 weakLabel:{fontSize:11,fontWeight:'800',color:'#777d89'},
 weakValue:{marginTop:5,fontSize:28,fontWeight:'900',color:'#5146c8'},
 weakCopy:{marginTop:6,fontSize:13,lineHeight:20,color:'#5d6370'},
 nextBox:{marginTop:14,padding:15,borderRadius:15,backgroundColor:'#fff'},
 nextTitle:{fontSize:12,fontWeight:'900',color:'#474b59'},
 nextElements:{marginTop:6,fontSize:24,fontWeight:'900',color:'#5146c8'},
 nextCopy:{marginTop:7,fontSize:12,lineHeight:19,color:'#626776'},
 body:{marginTop:10,fontSize:14,lineHeight:23,color:'#555a66'},
 insight:{marginTop:10,fontSize:13,lineHeight:21,color:'#686d79'},
 networkHeadline:{marginTop:18,fontSize:18,fontWeight:'900',color:'#5146c8'},
 saveButton:{marginTop:16,minHeight:48,paddingHorizontal:12,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:'#ece9ff'},
 saveButtonText:{fontWeight:'900',color:'#5146c8',textAlign:'center'},
 inviteButton:{marginTop:16,minHeight:48,paddingHorizontal:12,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:'#1f2330'},
 inviteButtonText:{fontWeight:'900',color:'#fff',textAlign:'center'},
 qrBox:{marginTop:18,alignItems:'center',padding:18,borderRadius:16,backgroundColor:'#f8f8fb'},
 qrBoxCompact:{padding:14},
 url:{marginTop:14,width:'100%',fontSize:12,lineHeight:18,textAlign:'center',color:'#555a66'},
 expiry:{marginTop:6,fontSize:11,color:'#777d89'},
 shareButton:{marginTop:16,width:'100%',minHeight:48,paddingHorizontal:10,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:'#5146c8'},
 shareButtonText:{fontWeight:'900',color:'#fff',textAlign:'center'},
 statusButton:{marginTop:9,width:'100%',minHeight:46,paddingHorizontal:10,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:'#ece9ff'},
 statusButtonText:{fontWeight:'900',color:'#5146c8',textAlign:'center'},
 guardianBox:{marginTop:18,padding:20,borderRadius:20,backgroundColor:'#f7f6ff'},
 guardianBoxCompact:{marginTop:14,padding:14,borderRadius:16},
 guardianButton:{marginTop:16,minHeight:48,paddingHorizontal:12,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:'#5146c8'},
 guardianButtonText:{color:'#fff',fontWeight:'900',textAlign:'center'},
 privacy:{fontSize:12,lineHeight:19,color:'#777d89',marginTop:18}
});
