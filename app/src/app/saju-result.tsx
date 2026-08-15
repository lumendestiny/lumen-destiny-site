import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { clearSajuSession, getSajuSession, SajuInput } from '../lib/saju-session';
import { calculateNativeSaju, NativeSajuResult } from '../lib/saju-engine';

const elementLabel:Record<string,string>={목:'목(木)',화:'화(火)',토:'토(土)',금:'금(金)',수:'수(水)'};
const elementMeaning:Record<string,string>={목:'성장·기획·새로운 시작',화:'표현·활력·실행',토:'안정·관리·현실성',금:'판단·정리·결단',수:'정보·유연성·통찰'};

export default function SajuResultScreen(){
 const [data,setData]=useState<SajuInput|null>(null);
 useEffect(()=>{setData(getSajuSession());return()=>clearSajuSession()},[]);
 const result=useMemo<NativeSajuResult|null>(()=>{if(!data)return null;try{return calculateNativeSaju(data)}catch{return null}},[data]);
 if(!data)return <View style={styles.center}><Text style={styles.title}>입력정보가 없습니다.</Text><Pressable style={styles.button} onPress={()=>router.replace('/saju')}><Text style={styles.buttonText}>무료사주 입력하기</Text></Pressable></View>;
 if(!result)return <View style={styles.center}><Text style={styles.title}>사주 결과를 계산하지 못했습니다.</Text><Text style={styles.copy}>입력한 날짜와 시간을 확인한 뒤 다시 시도해 주세요.</Text><Pressable style={styles.button} onPress={()=>router.replace('/saju')}><Text style={styles.buttonText}>다시 입력하기</Text></Pressable></View>;
 const pillars=[['년주',result.pillars.year,result.pillarHanja.year],['월주',result.pillars.month,result.pillarHanja.month],['일주',result.pillars.day,result.pillarHanja.day],['시주',result.pillars.hour||'미입력',result.pillarHanja.hour||'']];
 const weak=result.weakest.map(x=>elementLabel[x]).join(' · '),strong=result.strongest.map(x=>elementLabel[x]).join(' · ');
 return <ScrollView contentContainerStyle={styles.page}>
  <Text style={styles.label}>LUMEN MANSE · APP V1</Text>
  <Text style={styles.title}>{data.name}님의 사주 결과</Text>
  <Text style={styles.copy}>기준 양력 {result.solarDate}{data.birthTime?` · ${data.birthTime}`:' · 출생시간 미입력'}</Text>

  <View style={styles.section}><Text style={styles.kicker}>사주 네 기둥</Text><View style={styles.grid}>{pillars.map(([n,p,h])=><View key={String(n)} style={styles.pillar}><Text style={styles.small}>{n}</Text><Text style={styles.pillarText}>{p}</Text><Text style={styles.hanja}>{h}</Text></View>)}</View>{result.isTimeCorrected&&result.correctedTime?<Text style={styles.notice}>입력한 출생시각에 진태양시 보정을 적용했습니다 · {result.correctedTime.hour}시 {String(result.correctedTime.minute).padStart(2,'0')}분</Text>:null}</View>

  <View style={styles.section}><Text style={styles.kicker}>일간 · 나를 나타내는 천간</Text><Text style={styles.bigValue}>{result.dayMaster}</Text><Text style={styles.copy}>일간을 중심으로 다른 천간과 지장간의 관계를 읽습니다.</Text></View>

  <View style={styles.section}><Text style={styles.kicker}>표면 오행 분포</Text>{Object.entries(result.elements).map(([k,v])=><View key={k} style={styles.elementRow}><Text style={styles.elementName}>{elementLabel[k]}</Text><View style={styles.barTrack}><View style={[styles.barFill,{width:`${Math.max(8,v/8*100)}%`}]} /></View><Text style={styles.count}>{v}</Text></View>)}<Text style={styles.summary}>가장 많이 보이는 기운 · {strong}</Text><Text style={styles.summary}>표면상 가장 적은 기운 · {weak}</Text></View>

  <View style={styles.section}><Text style={styles.kicker}>십신 구조</Text><Text style={styles.line}>년간 · {result.tenGods.year}</Text><Text style={styles.line}>월간 · {result.tenGods.month}</Text><Text style={styles.line}>시간 · {result.tenGods.hour||'출생시간 미입력'}</Text></View>

  <View style={styles.section}><Text style={styles.kicker}>쉽게 보는 현재 핵심</Text><Text style={styles.line}>강하게 드러나는 기운은 {strong}이며, 생활에서는 {result.strongest.map(x=>elementMeaning[x]).join(' · ')}의 성향으로 나타날 수 있습니다.</Text><Text style={styles.line}>표면상 적게 나타난 {weak}은 이후 월령·일간 강약·합충을 함께 본 뒤 실제 보완 후보를 정합니다.</Text></View>

  <View style={styles.section}><Text style={styles.kicker}>다음 연결</Text><Text style={styles.line}>금전운 · 신년운세 · 월간운세 · 오늘의 운세</Text><Text style={styles.line}>합충형파해 · 보완 기운 정밀판단 · 맞춤 Guardian 추천</Text></View>
  <Text style={styles.notice}>이 결과 화면을 벗어나면 이름·생년월일·출생시간 입력값은 앱 메모리에서 제거됩니다.</Text>
  <Pressable style={styles.secondary} onPress={()=>router.replace('/saju')}><Text style={styles.secondaryText}>다른 정보로 다시 보기</Text></Pressable>
 </ScrollView>
}
const styles=StyleSheet.create({page:{padding:20,paddingBottom:44,backgroundColor:'#fff',flexGrow:1},center:{flex:1,padding:24,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'},label:{fontSize:12,fontWeight:'800',letterSpacing:1.6,color:'#6b5bd2'},title:{fontSize:30,fontWeight:'900',color:'#222438',marginTop:8},copy:{fontSize:15,lineHeight:24,color:'#626876',marginTop:8},section:{marginTop:18,padding:18,borderWidth:1,borderColor:'#e4e5ec',borderRadius:17,backgroundColor:'#fbfbfe'},kicker:{fontSize:13,fontWeight:'900',color:'#4f3ad6',marginBottom:10},grid:{flexDirection:'row',flexWrap:'wrap',gap:8},pillar:{width:'48%',padding:14,borderRadius:14,backgroundColor:'#fff',borderWidth:1,borderColor:'#e5e6ec',alignItems:'center'},small:{fontSize:12,color:'#73798a',fontWeight:'700'},pillarText:{fontSize:26,fontWeight:'900',marginTop:4,color:'#27293b'},hanja:{fontSize:14,color:'#777d89',marginTop:2},bigValue:{fontSize:34,fontWeight:'900',color:'#27293b'},line:{fontSize:15,lineHeight:24,color:'#444a58',marginTop:4},elementRow:{flexDirection:'row',alignItems:'center',gap:9,marginVertical:5},elementName:{width:54,fontSize:14,fontWeight:'800',color:'#3f4452'},barTrack:{flex:1,height:9,borderRadius:99,backgroundColor:'#ececf2',overflow:'hidden'},barFill:{height:9,borderRadius:99,backgroundColor:'#6b5bd2'},count:{width:20,textAlign:'right',fontWeight:'800',color:'#4c5160'},summary:{fontSize:14,lineHeight:22,color:'#555b68',marginTop:8},notice:{fontSize:13,lineHeight:21,color:'#747a88',marginTop:14},button:{marginTop:18,backgroundColor:'#4f3ad6',paddingHorizontal:20,paddingVertical:14,borderRadius:13},buttonText:{color:'#fff',fontWeight:'900'},secondary:{marginTop:18,paddingVertical:15,alignItems:'center',borderWidth:1,borderColor:'#d8dbe5',borderRadius:13},secondaryText:{fontWeight:'800',color:'#464b59'}});
