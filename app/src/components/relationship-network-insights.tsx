import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { elementPercent } from '../lib/connection-engine';
import type { ElementCounts } from '../lib/connection-engine';
import { filterMembersByRelation, relationGroupLabel, summarizeMemberImpact, summarizeNetwork } from '../lib/connection-network';
import type { MemberImpact, NetworkMember, RelationFilter } from '../lib/connection-network';

type Props={meElements:ElementCounts;members:NetworkMember[];activeGroup:RelationFilter};
type RankedImpact={member:NetworkMember;impact:MemberImpact};

function signed(value:number){return `${value>0?'+':''}${value}`;}

export default function RelationshipNetworkInsights({meElements,members,activeGroup}:Props){
 const {width}=useWindowDimensions();
 const compact=width<480;
 const tiny=width<350;
 const[compareIds,setCompareIds]=useState<string[]>([]);
 const[arrival,setArrival]=useState<NetworkMember|null>(null);
 const arrivalAnim=useRef(new Animated.Value(0)).current;
 const announcedIds=useRef(new Set<string>());
 const filteredMembers=useMemo(()=>filterMembersByRelation(members,activeGroup),[activeGroup,members]);
 const summary=useMemo(()=>summarizeNetwork(meElements,filteredMembers),[meElements,filteredMembers]);
 const ranking=useMemo(()=>filteredMembers.map(member=>({member,impact:summarizeMemberImpact(meElements,filteredMembers,member.id)})).filter((item):item is RankedImpact=>!!item.impact).sort((a,b)=>b.impact.coverageDelta-a.impact.coverageDelta||b.member.score-a.member.score).slice(0,3),[meElements,filteredMembers]);
 const maxContribution=useMemo(()=>Math.max(1,...ranking.map(item=>Math.abs(item.impact.coverageDelta))),[ranking]);
 const validCompareIds=compareIds.filter(id=>filteredMembers.some(member=>member.id===id));
 const selected=useMemo(()=>validCompareIds.map(id=>filteredMembers.find(member=>member.id===id)).filter((member):member is NetworkMember=>!!member),[validCompareIds,filteredMembers]);
 const activeLabel=relationGroupLabel(activeGroup);
 const weakest=summary.weakest[0];
 const toggleCompare=(id:string)=>setCompareIds(current=>current.includes(id)?current.filter(value=>value!==id):current.length<2?[...current,id]:[current[1],id]);
 const a=selected[0],b=selected[1];
 const aValue=a?elementPercent(a.elements,weakest):0;
 const bValue=b?elementPercent(b.elements,weakest):0;
 const winner=a&&b?(aValue===bValue?null:aValue>bValue?a:b):null;
 const compareCopy=a&&b?(winner?`현재 ${activeLabel} 인연망에서 상대적으로 부족한 ${weakest} 기운을 기준으로 ${winner.name}님이 더 높은 비중을 가지고 있습니다.`:`두 사람의 ${weakest} 기운 비중은 같습니다.`):selected.length===1?'비교할 인연을 한 명 더 선택해 주세요.':'두 사람을 선택하면 현재 부족한 오행을 누가 더 많이 가지고 있는지 비교합니다.';
 useEffect(()=>{
  const now=Date.now();
  const recent=[...members].filter(member=>{const time=Date.parse(member.addedAt||'');return Number.isFinite(time)&&now-time>=0&&now-time<20000&&!announcedIds.current.has(member.id)}).sort((x,y)=>Date.parse(y.addedAt)-Date.parse(x.addedAt))[0];
  if(!recent)return;
  announcedIds.current.add(recent.id);
  setArrival(recent);
  arrivalAnim.stopAnimation();
  arrivalAnim.setValue(0);
  Animated.sequence([
   Animated.spring(arrivalAnim,{toValue:1,useNativeDriver:true,damping:14,stiffness:150,mass:.8}),
   Animated.delay(2200),
   Animated.timing(arrivalAnim,{toValue:0,duration:260,useNativeDriver:true})
  ]).start(({finished})=>{if(finished)setArrival(null)});
 },[members,arrivalAnim]);
 if(!members.length)return null;
 return <View style={[styles.wrap,compact&&styles.wrapCompact]}>
  <Text style={styles.title}>{activeLabel} 인연 영향 분석</Text>
  <Text style={styles.lead}>현재 지도에 표시된 관계군만 따로 계산합니다. 관계 필터를 바꾸면 균형도·부족 오행·기여 순위·비교 결과가 함께 바뀝니다.</Text>
  {arrival?<Animated.View accessibilityRole="alert" style={[styles.arrival,{opacity:arrivalAnim,transform:[{translateY:arrivalAnim.interpolate({inputRange:[0,1],outputRange:[-10,0]})},{scale:arrivalAnim.interpolate({inputRange:[0,1],outputRange:[.97,1]})}]}]}><View style={styles.arrivalSpark}><Text style={styles.arrivalSparkText}>✦</Text></View><View style={styles.arrivalCopy}><Text style={styles.arrivalEyebrow}>새 인연 연결</Text><Text numberOfLines={1} ellipsizeMode="tail" style={styles.arrivalTitle}>{arrival.name}님이 인연지도에 들어왔습니다.</Text><Text numberOfLines={1} ellipsizeMode="tail" style={styles.arrivalMeta}>{arrival.relation} · 오행 보완도 {arrival.score}</Text></View></Animated.View>:null}
  {filteredMembers.length?<>
   <View style={styles.groupSummary}><View style={styles.groupMetric}><Text style={styles.groupLabel}>{activeLabel} 인연</Text><Text style={styles.groupValue}>{filteredMembers.length}명</Text></View><View style={styles.groupMetric}><Text style={styles.groupLabel}>관계망 균형도</Text><Text style={styles.groupValue}>{summary.coverage}</Text></View><View style={styles.groupMetric}><Text style={styles.groupLabel}>부족한 기운</Text><Text style={styles.groupValue}>{summary.weakest.join('·')}</Text></View></View>
   <Text style={styles.groupCopy}>{activeGroup==='all'?`전체 인연망에서는 ${summary.weakest.join('·')} 기운이 상대적으로 낮습니다.`:`${activeLabel} 관계만 따로 보면 ${summary.weakest.join('·')} 기운이 상대적으로 낮고, 개인 기준 대비 균형 변화는 ${signed(summary.balanceDelta)}점입니다.`}</Text>
   <Text style={styles.subTitle}>{activeLabel} · 균형 기여 TOP 3</Text>
   {ranking.map(({member,impact},index)=>{const widthPct=Math.max(8,Math.round((Math.abs(impact.coverageDelta)/maxContribution)*100));return <View key={member.id} style={styles.rankRow}><View style={styles.rankNo}><Text style={styles.rankNoText}>{index+1}</Text></View><View style={styles.flex}><Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>{member.name} · {member.relation}</Text><Text style={styles.meta}>보완도 {member.score} · 균형 변화 {signed(impact.coverageDelta)}</Text><View style={styles.rankTrack}><View style={[styles.rankFill,{width:`${widthPct}%`},impact.coverageDelta<0&&styles.rankFillDown]}/></View></View><View style={[styles.deltaBadge,impact.coverageDelta<0&&styles.deltaBadgeDown]}><Text style={[styles.deltaText,impact.coverageDelta<0&&styles.deltaTextDown]}>{signed(impact.coverageDelta)}</Text></View></View>})}
   <Text style={styles.note}>막대 길이는 현재 관계군 안에서의 상대적 균형 기여 크기를 보여줍니다. 음수도 관계의 좋고 나쁨을 뜻하지 않습니다.</Text>
   <View style={styles.divider}/>
   <Text style={styles.subTitle}>{activeLabel} · 인연 둘 비교하기</Text>
   <Text style={styles.compareGuide}>최대 두 명을 선택합니다 · 비교 기준: 현재 부족한 {weakest} 기운</Text>
   <View style={styles.pickerRow}>{filteredMembers.map(member=>{const active=validCompareIds.includes(member.id);return <Pressable key={member.id} onPress={()=>toggleCompare(member.id)} accessibilityRole="button" accessibilityState={{selected:active}} accessibilityLabel={`${member.name}, ${member.relation}, 비교 ${active?'선택됨':'선택 안 됨'}`} style={[styles.picker,active&&styles.pickerActive,tiny&&styles.pickerTiny]}><Text numberOfLines={1} ellipsizeMode="tail" style={[styles.pickerText,active&&styles.pickerTextActive]}>{member.name}</Text><Text numberOfLines={1} ellipsizeMode="tail" style={[styles.pickerMeta,active&&styles.pickerMetaActive]}>{member.relation}</Text></Pressable>})}</View>
   {selected.length?<View style={[styles.compareBox,tiny&&styles.compareBoxTiny]}>{selected.map((member,index)=>{const value=elementPercent(member.elements,weakest);return <View key={member.id} style={styles.compareSide}><Text numberOfLines={1} ellipsizeMode="tail" style={styles.compareName}>{member.name}</Text><Text style={styles.compareElement}>{weakest} {value}%</Text><Text style={styles.compareScore}>보완도 {member.score}</Text>{index===0&&selected.length===2?<Text style={styles.vs}>VS</Text>:null}</View>})}</View>:null}
   <Text style={styles.compareCopy}>{compareCopy}</Text>
   {a&&b?<Text style={styles.disclaimer}>※ 이 비교는 선택한 관계군에서 현재 부족한 오행의 상대적 보유 비중을 보는 참고 지표이며 사람의 가치나 관계의 미래를 평가하지 않습니다.</Text>:null}
  </>:<View style={styles.emptyBox}><Text style={styles.emptyTitle}>{activeLabel} 인연이 아직 없습니다.</Text><Text style={styles.emptyCopy}>다른 관계군을 선택하거나, 연결된 인연의 관계군을 직접 수정해 이 지도에 포함할 수 있습니다.</Text></View>}
 </View>;
}

const styles=StyleSheet.create({
 wrap:{marginTop:16,padding:16,borderRadius:18,backgroundColor:'#fff',borderWidth:1,borderColor:'#e4e0ff'},
 wrapCompact:{padding:13,borderRadius:14},
 title:{fontSize:17,fontWeight:'900',color:'#242735'},
 lead:{marginTop:5,fontSize:12,lineHeight:19,color:'#686d79'},
 arrival:{marginTop:12,minHeight:66,padding:11,borderRadius:15,backgroundColor:'#f4f1ff',borderWidth:1,borderColor:'#dcd3ff',flexDirection:'row',alignItems:'center',gap:10},
 arrivalSpark:{width:38,height:38,borderRadius:19,backgroundColor:'#6d55dc',alignItems:'center',justifyContent:'center',shadowColor:'#5146c8',shadowOpacity:.18,shadowRadius:8,shadowOffset:{width:0,height:4},elevation:3},
 arrivalSparkText:{fontSize:16,fontWeight:'900',color:'#fff'},
 arrivalCopy:{flex:1,minWidth:0},
 arrivalEyebrow:{fontSize:9,fontWeight:'900',letterSpacing:.7,color:'#6d55dc'},
 arrivalTitle:{marginTop:2,fontSize:13,fontWeight:'900',color:'#29263a'},
 arrivalMeta:{marginTop:2,fontSize:10,color:'#77738a'},
 groupSummary:{marginTop:13,flexDirection:'row',gap:7,padding:10,borderRadius:13,backgroundColor:'#f7f6ff'},
 groupMetric:{flex:1,minWidth:0,alignItems:'center'},
 groupLabel:{fontSize:9,lineHeight:13,fontWeight:'800',color:'#777d89',textAlign:'center'},
 groupValue:{marginTop:3,fontSize:17,fontWeight:'900',color:'#5146c8',textAlign:'center'},
 groupCopy:{marginTop:8,fontSize:11,lineHeight:18,color:'#626776'},
 subTitle:{marginTop:16,fontSize:13,fontWeight:'900',color:'#5146c8'},
 rankRow:{marginTop:9,minHeight:64,flexDirection:'row',alignItems:'center',gap:9,padding:10,borderRadius:13,backgroundColor:'#fff',borderWidth:1,borderColor:'#ece8fa'},
 rankNo:{width:28,height:28,borderRadius:14,alignItems:'center',justifyContent:'center',backgroundColor:'#ece9ff'},
 rankNoText:{fontSize:12,fontWeight:'900',color:'#5146c8'},
 flex:{flex:1,minWidth:0},
 name:{fontSize:13,fontWeight:'900',color:'#2d3040'},
 meta:{marginTop:3,fontSize:11,color:'#6d7280'},
 rankTrack:{height:4,marginTop:7,borderRadius:999,backgroundColor:'#ece9f8',overflow:'hidden'},
 rankFill:{height:'100%',borderRadius:999,backgroundColor:'#7b61df'},
 rankFillDown:{backgroundColor:'#d88b9c'},
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
