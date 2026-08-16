import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { ELEMENT_ORDER } from '../lib/connection-engine';
import type { MemberImpact } from '../lib/connection-network';

type Props={impact:MemberImpact|null;memberName:string};

function signed(value:number){return `${value>0?'+':''}${value}`;}

export default function RelationshipImpactCard({impact,memberName}:Props){
 const {width}=useWindowDimensions();
 const tiny=width<350;
 if(!impact)return null;
 const increased=impact.strongestIncrease.length?`${impact.strongestIncrease.join('·')} 기운이 가장 많이 보강되었습니다.`:'';
 const decreased=impact.strongestDecrease.length?`${impact.strongestDecrease.join('·')} 비중은 상대적으로 낮아졌습니다.`:'';
 const scoreMessage=impact.coverageDelta>0?`${memberName}님이 포함되며 인연망 균형도가 ${impact.coverageDelta}점 높아졌습니다.`:impact.coverageDelta<0?`${memberName}님이 포함된 현재 구성에서는 균형도가 ${Math.abs(impact.coverageDelta)}점 낮아졌습니다. 관계의 좋고 나쁨이 아니라 오행 비중의 변화를 뜻합니다.`:`${memberName}님이 포함되어도 전체 균형 점수는 같지만 오행 구성에는 변화가 있습니다.`;
 const highlights=[
  impact.coverageDelta>0?`균형 ${signed(impact.coverageDelta)}`:impact.coverageDelta<0?`균형 ${signed(impact.coverageDelta)}`:'균형 유지',
  ...impact.strongestIncrease.slice(0,2).map(element=>`${element} 기운 보완`),
 ].slice(0,3);
 return <View style={[styles.card,tiny&&styles.cardTiny]}>
  <Text style={styles.eyebrow}>이 인연이 만든 변화</Text>
  <View style={styles.highlightRow}>{highlights.map((text,index)=><View key={`${text}-${index}`} style={[styles.highlight,index===0&&impact.coverageDelta<0&&styles.highlightDown]}><Text style={[styles.highlightText,index===0&&impact.coverageDelta<0&&styles.highlightTextDown]}>{text}</Text></View>)}</View>
  <View style={[styles.scoreRow,tiny&&styles.scoreRowTiny]}>
   <View style={[styles.scoreSide,tiny&&styles.scoreSideTiny]}><Text style={styles.scoreLabel}>추가 전</Text><Text style={[styles.scoreValue,tiny&&styles.scoreValueTiny]}>{impact.beforeCoverage}</Text></View>
   <Text style={[styles.arrow,tiny&&styles.arrowTiny]}>→</Text>
   <View style={[styles.scoreSide,tiny&&styles.scoreSideTiny]}><Text style={styles.scoreLabel}>추가 후</Text><Text style={[styles.scoreValue,tiny&&styles.scoreValueTiny]}>{impact.afterCoverage}</Text></View>
   <View style={[styles.badge,tiny&&styles.badgeTiny,impact.coverageDelta<0&&styles.badgeDown]}><Text style={[styles.badgeText,impact.coverageDelta<0&&styles.badgeTextDown]}>{signed(impact.coverageDelta)}</Text></View>
  </View>
  <View style={styles.chipRow}>{ELEMENT_ORDER.map(element=>{const delta=impact.elementDelta[element];return <View key={element} style={[styles.chip,tiny&&styles.chipTiny,delta>0&&styles.chipUp,delta<0&&styles.chipDown]}><Text style={[styles.chipText,delta>0&&styles.chipTextUp,delta<0&&styles.chipTextDown]}>{element} {signed(delta)}</Text></View>})}</View>
  <Text style={styles.copy}>{scoreMessage}</Text>
  {increased||decreased?<Text style={styles.note}>{[increased,decreased].filter(Boolean).join(' ')}</Text>:null}
  <Text style={styles.disclaimer}>※ 사람의 가치를 평가하는 점수가 아니라, 현재 인연망에 이 사람이 추가되었을 때 나타난 오행 구성 변화입니다.</Text>
 </View>;
}

const styles=StyleSheet.create({
 card:{marginTop:12,padding:15,borderRadius:18,backgroundColor:'#fff',borderWidth:1,borderColor:'#e4e0ff',shadowColor:'#3f327a',shadowOpacity:.05,shadowRadius:12,shadowOffset:{width:0,height:7},elevation:1},
 cardTiny:{padding:11},
 eyebrow:{fontSize:12,fontWeight:'900',color:'#5146c8'},
 highlightRow:{marginTop:9,flexDirection:'row',flexWrap:'wrap',gap:6},
 highlight:{paddingHorizontal:9,paddingVertical:6,borderRadius:999,backgroundColor:'#f0edff'},
 highlightDown:{backgroundColor:'#f7eaea'},
 highlightText:{fontSize:10,fontWeight:'900',color:'#5e49c4'},
 highlightTextDown:{color:'#9a4747'},
 scoreRow:{marginTop:11,flexDirection:'row',alignItems:'center',gap:7},
 scoreRowTiny:{gap:4},
 scoreSide:{flex:1,minWidth:0,alignItems:'center',paddingVertical:8,borderRadius:11,backgroundColor:'#f8f8fb'},
 scoreSideTiny:{paddingVertical:7,paddingHorizontal:1},
 scoreLabel:{fontSize:10,fontWeight:'800',color:'#777d89'},
 scoreValue:{marginTop:2,fontSize:22,fontWeight:'900',color:'#242735'},
 scoreValueTiny:{fontSize:20},
 arrow:{fontSize:17,fontWeight:'900',color:'#aaa6ca'},
 arrowTiny:{fontSize:14},
 badge:{paddingHorizontal:8,paddingVertical:6,borderRadius:999,backgroundColor:'#e7f5ee'},
 badgeTiny:{paddingHorizontal:6,paddingVertical:5},
 badgeDown:{backgroundColor:'#f7eaea'},
 badgeText:{fontSize:11,fontWeight:'900',color:'#327457'},
 badgeTextDown:{color:'#9a4747'},
 chipRow:{marginTop:11,flexDirection:'row',flexWrap:'wrap',gap:6},
 chip:{minWidth:48,paddingHorizontal:9,paddingVertical:7,borderRadius:999,backgroundColor:'#f2f2f5',alignItems:'center'},
 chipTiny:{minWidth:42,paddingHorizontal:7,paddingVertical:6},
 chipUp:{backgroundColor:'#e7f5ee'},
 chipDown:{backgroundColor:'#f7eaea'},
 chipText:{fontSize:11,fontWeight:'900',color:'#666b77'},
 chipTextUp:{color:'#327457'},
 chipTextDown:{color:'#9a4747'},
 copy:{marginTop:11,fontSize:13,lineHeight:20,fontWeight:'800',color:'#474b59'},
 note:{marginTop:6,fontSize:12,lineHeight:19,color:'#626776'},
 disclaimer:{marginTop:9,fontSize:10,lineHeight:16,color:'#8a8e99'}
});
