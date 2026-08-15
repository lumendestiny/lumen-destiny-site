import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import GuardianCertificateCard, { guardianVerifyUrl } from '../components/GuardianCertificateCard';
import { verifyGuardian, GuardianVerifyResponse } from '../lib/guardian-api';
import { GUARDIAN_PRODUCTS, TIER_LABEL } from '../lib/guardian-products';

const statusText:Record<string,string>={pending:'발급 대기',verified:'정상 발급 · 인증 완료',refund_pending:'품절 환불 처리 대기',refunded:'환불 완료',format_only:'서버 발급 점검 중',not_found:'인증 기록 없음'};

export default function GuardianVerifyScreen(){
 const params=useLocalSearchParams<{id?:string}>(),initial=typeof params.id==='string'?params.id:'';
 const [id,setId]=useState(initial),[result,setResult]=useState<GuardianVerifyResponse|null>(null),[loading,setLoading]=useState(false),[message,setMessage]=useState('');
 const g=result?.guardian;
 const product=useMemo(()=>g?.guardianDesignKey?GUARDIAN_PRODUCTS.find(x=>x.key===g.guardianDesignKey)||null:null,[g?.guardianDesignKey]);
 const run=async(raw=id)=>{const clean=raw.trim().toUpperCase();if(!/^LG-\d{8}-[A-Z0-9]{5,12}$/.test(clean)){setMessage('발급번호 형식을 확인해 주세요.');setResult(null);return}setLoading(true);setMessage('');try{const r=await verifyGuardian(clean);setResult(r);if(!r.ok)setMessage(r.error==='guardian_not_enabled'?'현재 서버 발급 기능은 안전 점검 중입니다.':'인증 기록을 확인하지 못했습니다.')}catch{setResult(null);setMessage('인증 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.')}finally{setLoading(false)}};
 useEffect(()=>{if(initial)run(initial)},[]);
 return <ScrollView contentContainerStyle={s.page} keyboardShouldPersistTaps="handled">
  <Text style={s.label}>LUMEN GUARDIAN VERIFY</Text><Text style={s.title}>Guardian 정품 인증</Text><Text style={s.lead}>발급번호와 QR로 서버의 발행 상태와 고유 일련번호를 확인합니다.</Text>
  <View style={s.search}><TextInput value={id} onChangeText={setId} autoCapitalize="characters" placeholder="LG-YYYYMMDD-XXXXXXXXXX" style={s.input}/><Pressable disabled={loading} onPress={()=>run()} style={[s.button,loading&&s.disabled]}><Text style={s.buttonText}>{loading?'확인 중…':'인증 확인'}</Text></Pressable></View>
  {message?<View style={s.message}><Text style={s.messageText}>{message}</Text></View>:null}
  {g?<View style={s.card}>
    {product?<GuardianCertificateCard product={product} id={g.id} displayName={g.displayName} serial={g.serial} editionLimit={g.editionLimit} status={result?.status||'pending'} issuedAt={g.issuedAt}/>:null}
    <Text style={s.status}>{statusText[result?.status||'']||result?.status||'상태 확인'}</Text><Text style={s.name}>{g.displayName}</Text><Text style={s.line}>발급번호 · {g.id}</Text><Text style={s.line}>등급 · {TIER_LABEL[g.tier as keyof typeof TIER_LABEL]||g.tier} · ${g.priceUsd}</Text><Text style={s.line}>디자인 · {product?.name||g.guardianDesignKey||g.editionKey||'확인 중'}</Text><Text style={s.line}>고유번호 · {g.serial?`${String(g.serial).includes('/')?g.serial:`${g.serial}/${g.editionLimit}`}`:`발급 대기 / ${g.editionLimit}`}</Text><Text style={s.line}>결제상태 · {g.paymentStatus}</Text><Text style={s.line}>발급상태 · {g.issuanceStatus}</Text>{g.guardianElement?<Text style={s.line}>연결 오행 · {g.guardianElement}</Text>:null}{g.issuedAt?<Text style={s.line}>발행일 · {new Date(g.issuedAt).toLocaleString()}</Text>:null}<Text style={s.note}>QR 주소 · {guardianVerifyUrl(g.id)}</Text><Text style={s.note}>인증 화면에는 소망 문구와 선물 메시지 같은 사적인 내용은 표시하지 않습니다.</Text>
  </View>:null}
  <View style={s.info}><Text style={s.infoTitle}>QR 인증 방식</Text><Text style={s.infoText}>카드의 QR에는 발급번호 기반 공개 인증 URL만 넣습니다. 스캔하면 동일한 서버 기록을 조회하며, 정상 발급 시 카드와 인증 화면 모두 같은 고유번호(예: 1/100 · 1/5 · 1/1)를 표시합니다.</Text></View>
 </ScrollView>
}
const s=StyleSheet.create({page:{padding:18,paddingBottom:50,backgroundColor:'#fff',flexGrow:1},label:{fontSize:12,fontWeight:'900',letterSpacing:1.5,color:'#6b5bd2'},title:{fontSize:29,fontWeight:'900',color:'#242637',marginTop:7},lead:{fontSize:14,lineHeight:22,color:'#676d7a',marginTop:8},search:{marginTop:18,gap:10},input:{borderWidth:1,borderColor:'#dfe1e8',borderRadius:13,paddingHorizontal:13,paddingVertical:13,fontSize:14,color:'#2f3240'},button:{minHeight:47,borderRadius:13,backgroundColor:'#4f3ad6',alignItems:'center',justifyContent:'center'},disabled:{backgroundColor:'#aeb1bb'},buttonText:{color:'#fff',fontWeight:'900'},message:{marginTop:14,padding:14,borderRadius:14,backgroundColor:'#f6f7fb'},messageText:{fontSize:13,lineHeight:20,color:'#505664'},card:{marginTop:20,padding:18,borderRadius:18,borderWidth:1,borderColor:'#e0e2e9',backgroundColor:'#fbfbfe'},status:{fontSize:12,fontWeight:'900',color:'#4f3ad6',marginTop:16},name:{fontSize:23,fontWeight:'900',color:'#2e3040',marginTop:5,marginBottom:7},line:{fontSize:14,lineHeight:23,color:'#515764',marginTop:3},note:{fontSize:12,lineHeight:19,color:'#767c88',marginTop:10},info:{marginTop:18,padding:16,borderRadius:16,backgroundColor:'#f7f5ff'},infoTitle:{fontSize:14,fontWeight:'900',color:'#4031a8'},infoText:{fontSize:13,lineHeight:21,color:'#626876',marginTop:5}});
