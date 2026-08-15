import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { fetchGuardianAvailability, GuardianAvailability } from '../lib/guardian-api';
import { GUARDIAN_PRODUCTS, GuardianProduct, TIER_LABEL } from '../lib/guardian-products';

const elementLabel:Record<string,string>={목:'목(木) · 성장과 시작',화:'화(火) · 활력과 실행',토:'토(土) · 안정과 균형',금:'금(金) · 판단과 정리',수:'수(水) · 통찰과 유연성'};
const tierCopy:Record<string,string>={basic:'부담 없이 시작하는 입문형 · 디자인별 100개',custom:'소망 분야를 더 선명하게 담는 개인화형 · 디자인별 100개',rare:'희소성을 높인 Rare · 디자인별 5개',legendary:'각 디자인 단 1개만 발행하는 1/1 컬렉션'};

export default function GuardianScreen(){
 const params=useLocalSearchParams<{element?:string}>(),recommended=typeof params.element==='string'?params.element:'';
 const [availability,setAvailability]=useState<Record<string,GuardianAvailability>>({}),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const load=async()=>{setLoading(true);setError('');try{const items=await fetchGuardianAvailability();setAvailability(Object.fromEntries(items.map(x=>[x.key,x])))}catch{setError('실시간 발행수량을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.')}finally{setLoading(false)}};
 useEffect(()=>{load()},[]);
 const ordered=useMemo(()=>[...GUARDIAN_PRODUCTS].sort((a,b)=>{if(recommended){const ar=a.element===recommended?0:1,br=b.element===recommended?0:1;if(ar!==br)return ar-br}return a.price-b.price}),[recommended]);
 const groups=useMemo(()=>['basic','custom','rare','legendary'].map(t=>({tier:t,items:ordered.filter(x=>x.tier===t)})),[ordered]);
 const open=(p:GuardianProduct)=>{const a=availability[p.key];if(a?.soldOut)return;router.push({pathname:'/guardian-order',params:{guardian:p.key,element:recommended||p.element}})};
 return <ScrollView contentContainerStyle={s.page} refreshControl={<RefreshControl refreshing={loading} onRefresh={load}/>}> 
  <Text style={s.label}>LUMEN GUARDIAN · APP V1</Text><Text style={s.title}>Guardian 아카이브</Text>
  <Text style={s.lead}>{recommended&&elementLabel[recommended]?`사주 결과에서 ${elementLabel[recommended]}이 보완 참고 기운으로 안내되었습니다. 같은 오행 Guardian을 먼저 보여드립니다.`:'20종 Guardian을 가격대와 오행, 희소성으로 비교할 수 있습니다.'}</Text>
  <View style={s.notice}><Text style={s.noticeTitle}>Guardian은 상징적 디지털 콘텐츠입니다.</Text><Text style={s.noticeText}>특정 결과나 운세 변화를 보장하지 않습니다. 사주 해설에서 확인한 목표와 태도를 기억하는 용도로 선택할 수 있습니다.</Text></View>
  {error?<View style={s.error}><Text style={s.errorText}>{error}</Text></View>:null}
  {groups.map(g=><View key={g.tier} style={s.section}><Text style={s.tier}>{TIER_LABEL[g.tier as keyof typeof TIER_LABEL]}</Text><Text style={s.tierCopy}>{tierCopy[g.tier]}</Text><View style={s.grid}>{g.items.map(p=>{const a=availability[p.key],sold=!!a?.soldOut,remaining=a?.remaining;return <View key={p.key} style={[s.card,recommended===p.element&&s.recommended,sold&&s.sold]}>
    <Image source={{uri:p.image}} style={s.image} resizeMode="cover" />
    <View style={s.info}><View style={s.row}><Text style={s.price}>${p.price}</Text><Text style={s.limit}>{p.limit===1?'1/1':`${p.limit}개 한정`}</Text></View><Text style={s.name}>{p.name}</Text><Text style={s.meta}>{p.element}({({목:'木',화:'火',토:'土',금:'金',수:'水'} as any)[p.element]}) · {p.wish}</Text>{typeof remaining==='number'?<Text style={[s.stock,sold&&s.stockSold]}>{sold?'SOLD OUT':`남은 수량 ${remaining} · 발행 ${a?.issued||0}/${a?.limit||p.limit}`}</Text>:<Text style={s.stock}>{loading?'수량 확인 중…':'수량 정보 미확인'}</Text>}
    <Pressable disabled={sold||loading} onPress={()=>open(p)} style={[s.button,(sold||loading)&&s.disabled]}><Text style={s.buttonText}>{sold?'SOLD OUT':recommended===p.element?`${p.element} 기운 Guardian 선택`:'이 Guardian 선택'}</Text></Pressable></View></View>})}</View></View>)}
  <Text style={s.foot}>발행수량은 웹과 동일한 서버 기준으로 확인합니다. 선택 후에도 앱 주문 화면에서 다시 품절 여부를 검증합니다.</Text>
 </ScrollView>
}
const s=StyleSheet.create({page:{padding:18,paddingBottom:50,backgroundColor:'#fff'},label:{fontSize:12,fontWeight:'900',letterSpacing:1.6,color:'#6b5bd2'},title:{fontSize:30,fontWeight:'900',color:'#222438',marginTop:7},lead:{fontSize:15,lineHeight:24,color:'#626876',marginTop:10},notice:{marginTop:16,padding:16,borderRadius:16,backgroundColor:'#f7f5ff'},noticeTitle:{fontSize:14,fontWeight:'900',color:'#4031a8'},noticeText:{fontSize:13,lineHeight:21,color:'#626876',marginTop:5},error:{marginTop:14,padding:14,borderRadius:14,backgroundColor:'#fff3f3'},errorText:{fontSize:13,lineHeight:20,color:'#9c3a3a'},section:{marginTop:24},tier:{fontSize:20,fontWeight:'900',color:'#27293b'},tierCopy:{fontSize:13,lineHeight:20,color:'#717786',marginTop:3,marginBottom:10},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},card:{width:'48%',borderWidth:1,borderColor:'#e3e5ec',borderRadius:16,overflow:'hidden',backgroundColor:'#fff'},recommended:{borderWidth:2,borderColor:'#a87924'},sold:{opacity:.72},image:{width:'100%',aspectRatio:941/1672,backgroundColor:'#111'},info:{padding:10},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6},price:{fontSize:17,fontWeight:'900',color:'#9b6e19'},limit:{fontSize:10,fontWeight:'700',color:'#777d89'},name:{fontSize:15,fontWeight:'900',color:'#303342',marginTop:6},meta:{fontSize:11,lineHeight:17,color:'#626876',marginTop:4,minHeight:34},stock:{fontSize:10,fontWeight:'800',color:'#48634c',marginTop:7},stockSold:{color:'#a23e3e'},button:{marginTop:9,minHeight:38,borderRadius:10,backgroundColor:'#4f3ad6',alignItems:'center',justifyContent:'center',paddingHorizontal:7},disabled:{backgroundColor:'#aaaeb9'},buttonText:{color:'#fff',fontSize:11,fontWeight:'900',textAlign:'center'},foot:{fontSize:12,lineHeight:20,color:'#747a88',marginTop:22}});
