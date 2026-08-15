import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const L:Record<string,string>={목:'목(木) · 성장과 시작',화:'화(火) · 활력과 실행',토:'토(土) · 안정과 균형',금:'금(金) · 판단과 정리',수:'수(水) · 통찰과 유연성'};
const M:Record<string,string>={목:'계획·배움·새로운 시작을 꾸준히 키우는 태도',화:'표현·실행·따뜻한 소통을 행동으로 옮기는 태도',토:'생활 리듬·관리·신뢰를 안정적으로 유지하는 태도',금:'기준·정리·결단으로 우선순위를 분명히 하는 태도',수:'정보·통찰·유연함으로 변화에 대응하는 태도'};

export default function GuardianScreen(){
 const p=useLocalSearchParams<{element?:string;source?:string}>(),element=String(p.element||''); const matched=!!L[element];
 return <ScrollView contentContainerStyle={s.page}><Text style={s.title}>LUMEN GUARDIAN</Text>{matched?<View style={s.recommend}><Text style={s.tag}>SAJU MATCH</Text><Text style={s.h}>사주 결과와 연결된 {L[element]} Guardian</Text><Text style={s.p}>이번 결과에서는 {L[element]}을 균형을 위해 우선 참고할 기운으로 안내했습니다.</Text><Text style={s.p}>생활에서 먼저 실천할 방향 · {M[element]}</Text><Text style={s.note}>Guardian은 이 방향을 기억하기 위한 상징적 디지털 콘텐츠이며 실제 운세 변화나 특정 결과를 보장하지 않습니다.</Text></View>:null}<View style={s.card}><Text style={s.h}>맞춤 Guardian 아카이브</Text><Text style={s.p}>다음 단계에서 웹과 같은 20종 Guardian, $5·$10·$50·$100 희소성, 실시간 남은 수량과 SOLD OUT 상태를 네이티브 카드로 연결합니다.</Text></View></ScrollView>}
const s=StyleSheet.create({page:{padding:20,backgroundColor:'#fff',flexGrow:1},title:{fontSize:30,fontWeight:'800',marginBottom:16,color:'#252738'},card:{padding:20,borderRadius:18,borderWidth:1,borderColor:'#e6e7ec'},recommend:{padding:20,borderRadius:18,borderWidth:1,borderColor:'#c6a65a',backgroundColor:'#fffdf7',marginBottom:14},tag:{fontSize:12,fontWeight:'900',letterSpacing:1.5,color:'#9a721f'},h:{fontSize:18,fontWeight:'800',color:'#303342'},p:{fontSize:15,lineHeight:24,marginTop:12,color:'#565c69'},note:{fontSize:13,lineHeight:21,marginTop:14,color:'#777d88'}});
