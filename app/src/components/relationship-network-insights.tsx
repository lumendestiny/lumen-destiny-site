import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { elementPercent } from '../lib/connection-engine';
import type { ElementCounts } from '../lib/connection-engine';
import { summarizeMemberImpact, summarizeNetwork } from '../lib/connection-network';
import type { MemberImpact, NetworkMember } from '../lib/connection-network';

type Props={meElements:ElementCounts;members:NetworkMember[]};
type RankedImpact={member:NetworkMember;impact:MemberImpact};
type RelationGroup='all'|'family'|'partner'|'friend'|'work'|'other';
type RelationOption={id:RelationGroup;label:string};

const RELATION_OPTIONS:RelationOption[]=[
 {id:'all',label:'전체'},
 {id:'family',label:'가족'},
 {id:'partner',label:'연인·배우자'},
 {id:'friend',label:'친구'},
 {id:'work',label:'직장·사업'},
 {id:'other',label:'기타'},
];

const PARTNER_WORDS=['아내','남편','배우자','연인','애인','여자친구','남자친구','약혼','와이프','허즈번드','wife','husband','partner','girlfriend','boyfriend'];
const FAMILY_WORDS=['가족','부모','엄마','아빠','어머니','아버지','할머니','할아버지','형','누나','언니','오빠','동생','아들','딸','자녀','아이','사촌','삼촌','이모','고모','조카','며느리','사위','장모','장인','시어머니','시아버지','family','mother','father','sister','brother','son','daughter'];
const FRIEND_WORDS=['친구','지인','동창','동문','선배','후배','친한','베프','friend'];
const WORK_WORDS=['직장','회사','동료','상사','부하','팀장','대표','사장','직원','거래처','고객','사업','비즈니스','파트너사','협력','투자자','업무','work','coworker','colleague','boss','client','business'];

function signed(value:number){return `${value>0?'+':''}${value}`;}
function includesAny(value:string,words:string[]){const normalized=value.trim().toLowerCase();return words.some(word=>normalized.includes(word.toLowerCase()));}
function relationGroup(relation:string):Exclude<RelationGroup,'all'>{
 if(includesAny(relation,PARTNER_WORDS))return 'partner';
 if(includesAny(relation,FAMILY_WORDS))return 'family';
 if(includesAny(relation,WORK_WORDS))return 'work';
 if(includesAny(relation,FRIEND_WORDS))return 'friend';
 return 'other';
}

export default function RelationshipNetworkInsights({meElements,members}:Props){
 const {width}=useWindowDimensions();
 const compact=width<480;
 const tiny=width<350;
 const[activeGroup,setActiveGroup]=useState<RelationGroup>('all');
 const[compareIds,setCompareIds]=useState<string[]>([]);
 const counts=useMemo(()=>Object.fromEntries(RELATION_OPTIONS.map(option=>[option.id,option.id==='all'?members.length:members.filter(member=>relationGroup(member.relation)===option.id).length])) as Record<RelationGroup,number>,[members]);
 const filteredMembers=useMemo(()=>activeGroup==='all'?members:members.filter(member=>relationGroup(member.relation)===activeGroup),[activeGroup,members]);
 const summary=useMemo(()=>summarizeNetwork(meElements,filteredMembers),[meElements,filteredMembers]);
 const ranking=useMemo(()=>filteredMembers.map(member=>({member,impact:summarizeMemberImpact(meElements,filteredMembers,member.id)})).filter((item):item is RankedImpact=>!!item.impact).sort((a,b)=>b.impact.coverageDelta-a.impact.coverageDelta||b.member.score-a.member.score).slice(0,3),[meElements,filteredMembers]);
 const selected=useMemo(()=>compareIds.map(id=>filteredMembers.find(member=>member.id===id)).filter((member):member is NetworkMember=>!!member),[compareIds,filteredMembers]);
 const activeLabel=RELATION_OPTIONS.find(option=>option.id===activeGroup)?.label||'전체';
 const weakest=summary.weakest[0];
 useEffect(()=>{setCompareIds([])},[activeGroup]);
 const toggleCompare=(id:string)=>setCompareIds(current=>current.includes(id)?current.filter(value=>value!==id):current.length<2?[...current,id]:[current[1],id]);
 const a=selected[0],b=selected[1];
 const aValue=a?elementPercent(a.elements,weakest):0;
 const bValue=b?elementPercent(b.elements,weakest):0;
 const winner=a&&b?(aValue===bValue?null:aValue>bValue?a:b):null;
 const compareCopy=a&&b?(winner?`현재 ${activeLabel} 인연망에서 상대적으로 부족한 ${weakest} 기운을 기준으로 ${winner.name}님이 더 높은 비중을 가지고 있습니다.`:`두 사람의 ${weakest} 기운 비중은 같습니다.`):selected.length===1?'비교할 인연을 한 명 더 선택해 주세요.':'두 사람을 선택하면 현재 부족한 오행을 누가 더 많이 가지고 있는지 비교합니다.';
 if(!members.length)return null;
 return <View style={[styles.wrap,compact&&styles.wrapCompact]}>
  <Text style={styles.title}>관계별 인연 영향 분석</Text>
  <Text style={styles.lead}>가족·연인·친구·직장처럼 관계군을 나눠 보면 같은 사람도 어떤 인연망 안에 있는지에 따라 의미가 달라집니다.</Text>
  <Text style={styles.filterTitle}>관계별 인연망 보기</Text>
  <View style={styles.filterRow}>{RELATION_OPTIONS.map(option=>{const active=activeGroup===option.id;return <Pressable key={option.id} onPress={()=>setActiveGroup(option.id)} style={[styles.filterChip,active&&styles.filterChipActive,tiny&&styles.filterChipTiny]}><Text style={[styles.filterText,active&&styles.filterTextActive]}>{option.label}</Text><Text style={[styles.filterCount,active&&styles.filterCountActive]}>{counts[option.id]}</Text></Pressable>})}</View>
  {filteredMembers.length?<>
   <View style={styles.groupSummary}><View style={styles.groupMetric}><Text style={styles.groupLabel}>{activeLabel} 인연</Text><Text style={styles.groupValue}>{filteredMembers.length}명</Text></View><View style={styles.groupMetric}><Text style={styles.groupLabel}>관계망 균형도</Text><Text style={styles.groupValue}>{summary.coverage}</Text></View><View style={styles.groupMetric}><Text style={styles.groupLabel}>부족한 기운</Text><Text style={styles.groupValue}>{summary.weakest.join('·')}</Text></View></View>
   <Text style={styles.groupCopy}>{activeGroup==='all'?`전체 인연망에서는 ${summary.weakest.join('·')} 기운이 상대적으로 낮습니다.`:`${activeLabel} 관계만 따로 보면 ${summary.weakest.join('·')} 기운이 상대적으로 낮고, 개인 기준 대비 균형 변화는 ${signed(summary.balanceDelta)}점입니다.`}</Text>
   <Text style={styles.subTitle}>{activeLabel} · 균형 기여 TOP 3</Text>
   {ranking.map(({member,impact},index)=><View key={member.id} style={styles.rankRow}><View style={styles.rankNo}><Text style={styles.rankNoText}>{index+1}</Text></View><View style={styles.flex}><Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>{member.name} · {member.relation}</Text><Text style={styles.meta}>보완도 {member.score} · 균형 변화 {signed(impact.coverageDelta)}</Text></View><View style={[styles.deltaBadge,impact.coverageDelta<0&&styles.deltaBadgeDown]}><Text style={[styles.deltaText,impact.coverageDelta<0&&styles.deltaTextDown]}>{signed(impact.coverageDelta)}</Text></View></View>)}
   <Text style={styles.note}>균형 점수 변화 기준입니다. 음수도 관계의 좋고 나쁨을 뜻하지 않습니다.</Text>
   <View style={styles.divider}/>
   <Text style={styles.subTitle}>{activeLabel} · 인연 둘 비교하기</Text>
   <Text style={styles.compareGuide}>최대 두 명을 선택합니다 · 비교 기준: 현재 부족한 {weakest} 기운</Text>
   <View style={styles.pickerRow}>{filteredMembers.map(member=>{const active=compareIds.includes(member.id);return <Pressable key={member.id} onPress={()=>toggleCompare(member.id)} style={[styles.picker,active&&styles.pickerActive,tiny&&styles.pickerTiny]}><Text numberOfLines={1} ellipsizeMode="tail" style={[styles.pickerText,active&&styles.pickerTextActive]}>{member.name}</Text><Text numberOfLines={1} ellipsizeMode="tail" style={[styles.pickerMeta,active&&styles.pickerMetaActive]}>{member.relation}</Text></Pressable>})}</View>
   {selected.length?<View style={[styles.compareBox,tiny&&styles.compareBoxTiny]}>{selected.map((member,index)=>{const value=elementPercent(member.elements,weakest);return <View key={member.id} style={styles.compareSide}><Text numberOfLines={1} ellipsizeMode="tail" style={styles.compareName}>{member.name}</Text><Text style={styles.compareElement}>{weakest} {value}%</Text><Text style={styles.compareScore}>보완도 {member.score}</Text>{index===0&&selected.length===2?<Text style={styles.vs}>VS</Text>:null}</View>})}</View>:null}
   <Text style={styles.compareCopy}>{compareCopy}</Text>
   {a&&b?<Text style={styles.disclaimer}>※ 이 비교는 선택한 관계군에서 현재 부족한 오행의 상대적 보유 비중을 보는 참고 지표이며 사람의 가치나 관계의 미래를 평가하지 않습니다.</Text>:null}
  </>:<View style={styles.emptyBox}><Text style={styles.emptyTitle}>{activeLabel} 인연이 아직 없습니다.</Text><Text style={styles.emptyCopy}>인연을 추가할 때 관계를 입력하면 자동으로 이 관계군에 분류됩니다. 다른 관계군을 선택하거나 새로운 인연을 연결해 보세요.</Text></View>}
 </View>;
}

const styles=StyleSheet.create({
 wrap:{marginTop:16,padding:16,borderRadius:16,backgroundColor:'#fff',borderWidth:1,borderColor:'#e4e0ff'},
 wrapCompact:{padding:13,borderRadius:14},
 title:{fontSize:17,fontWeight:'900',color:'#242735'},
 lead:{marginTop:5,fontSize:12,lineHeight:19,color:'#686d79'},
 filterTitle:{marginTop:16,fontSize:12,fontWeight:'900',color:'#474b59'},
 filterRow:{marginTop:9,flexDirection:'row',flexWrap:'wrap',gap:7},
 filterChip:{minHeight:42,paddingHorizontal:11,paddingVertical:7,borderRadius:999,borderWidth:1,borderColor:'#e1e2e8',backgroundColor:'#fff',flexDirection:'row',alignItems:'center',gap:5},
 filterChipTiny:{paddingHorizontal:9},
 filterChipActive:{borderColor:'#5146c8',backgroundColor:'#5146c8'},
 filterText:{fontSize:11,fontWeight:'900',color:'#555a66'},
 filterTextActive:{color:'#fff'},
 filterCount:{minWidth:18,height:18,paddingHorizontal:4,borderRadius:9,textAlign:'center',textAlignVertical:'center',fontSize:9,fontWeight:'900',color:'#777d89',backgroundColor:'#f1f1f5'},
 filterCountActive:{color:'#5146c8',backgroundColor:'#fff'},
 groupSummary:{marginTop:13,flexDirection:'row',gap:7,padding:10,borderRadius:13,backgroundColor:'#f7f6ff'},
 groupMetric:{flex:1,minWidth:0,alignItems:'center'},
 groupLabel:{fontSize:9,lineHeight:13,fontWeight:'800',color:'#777d89',textAlign:'center'},
 groupValue:{marginTop:3,fontSize:17,fontWeight:'900',color:'#5146c8',textAlign:'center'},
 groupCopy:{marginTop:8,fontSize:11,lineHeight:18,color:'#626776'},
 subTitle:{marginTop:16,fontSize:13,fontWeight:'900',color:'#5146c8'},
 rankRow:{marginTop:9,minHeight:58,flexDirection:'row',alignItems:'center',gap:9,padding:10,borderRadius:12,backgroundColor:'#f8f8fb'},
 rankNo:{width:28,height:28,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:'#ece9ff'},
 rankNoText:{fontSize:12,fontWeight:'900',color:'#5146c8'},
 flex:{flex:1,minWidth:0},
 name:{fontSize:13,fontWeight:'900',color:'#2d3040'},
 meta:{marginTop:3,fontSize:11,color:'#6d7280'},
 deltaBadge:{flexShrink:0,paddingHorizontal:7,paddingVertical:5,borderRadius:999,backgroundColor:'#e7f5ee'},
 deltaBadgeDown:{backgroundColor:'#f7eaea'},
 deltaText:{fontSize:11,fontWeight:'900',color:'#327457'},
 deltaTextDown:{color:'#9a4747'},
 note:{marginTop:8,fontSize:10,lineHeight:16,color:'#8a8e99'},
 divider:{height:1,marginTop:16,backgroundColor:'#ececf1'},
 compareGuide:{marginTop:5,fontSize:11,lineHeight:17,color:'#777d89'},
 pickerRow:{marginTop:10,flexDirection:'row',flexWrap:'wrap',gap:7},
 picker:{minWidth:76,maxWidth:128,minHeight:48,paddingHorizontal:10,paddingVertical:7,borderRadius:12,borderWidth:1,borderColor:'#e1e2e8',backgroundColor:'#fff',justifyContent:'center'},
 pickerTiny:{minWidth:68,maxWidth:104,paddingHorizontal:8},
 pickerActive:{borderColor:'#5146c8',backgroundColor:'#f1efff'},
 pickerText:{fontSize:12,fontWeight:'900',color:'#474b59'},
 pickerTextActive:{color:'#5146c8'},
 pickerMeta:{marginTop:2,fontSize:10,color:'#8a8e99'},
 pickerMetaActive:{color:'#6b62c6'},
 compareBox:{marginTop:12,flexDirection:'row',gap:8,padding:10,borderRadius:13,backgroundColor:'#f7f6ff'},
 compareBoxTiny:{gap:5,paddingHorizontal:7},
 compareSide:{flex:1,minWidth:0,alignItems:'center',position:'relative',paddingVertical:7},
 compareName:{maxWidth:'100%',fontSize:13,fontWeight:'900',color:'#2d3040'},
 compareElement:{marginTop:4,fontSize:20,fontWeight:'900',color:'#5146c8'},
 compareScore:{marginTop:3,fontSize:10,color:'#777d89'},
 vs:{position:'absolute',right:-14,top:19,fontSize:10,fontWeight:'900',color:'#aaa6ca'},
 compareCopy:{marginTop:10,fontSize:12,lineHeight:19,fontWeight:'800',color:'#555a66'},
 disclaimer:{marginTop:7,fontSize:10,lineHeight:16,color:'#8a8e99'},
 emptyBox:{marginTop:13,padding:14,borderRadius:13,backgroundColor:'#f8f8fb'},
 emptyTitle:{fontSize:13,fontWeight:'900',color:'#474b59'},
 emptyCopy:{marginTop:5,fontSize:11,lineHeight:18,color:'#777d89'}
});
