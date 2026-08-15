import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { clearSajuSession, getSajuSession, SajuInput } from '../lib/saju-session';
import { calculateNativeSaju, NativeSajuResult } from '../lib/saju-engine';
import { balanceGuide, branchRelations, fortuneBundle } from '../lib/saju-interpretation';

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
 const relations=branchRelations(result),balance=balanceGuide(result),fortune=fortuneBundle(result,balance,relations);
 return <ScrollView contentContainerStyle={styles.page}>
  <Text style={styles.label}>LUMEN MANSE · APP V1</Text>
  <Text style={styles.title}>{data.name}님의 사주 결과</Text>
  <Text style={styles.copy}>기준 양력 {result.solarDate}{data.birthTime?` · ${data.birthTime}`:' · 출생시간 미입력'}</Text>

  <View style={styles.section}><Text style={styles.kicker}>사주 네 기둥</Text><View style={styles.grid}>{pillars.map(([n,p,h])=><View key={String(n)} style={styles.pillar}><Text style={styles.small}>{n}</Text><Text style={styles.pillarText}>{p}</Text><Text style={styles.hanja}>{h}</Text></View>)}</View>{result.isTimeCorrected&&result.correctedTime?<Text style={styles.notice}>입력한 출생시각에 진태양시 보정을 적용했습니다 · {result.correctedTime.hour}시 {String(result.correctedTime.minute).padStart(2,'0')}분</Text>:null}</View>

  <View style={styles.section}><Text style={styles.kicker}>일간 · 나를 나타내는 천간</Text><Text style={styles.bigValue}>{result.dayMaster}</Text><Text style={styles.copy}>일간을 중심으로 다른 천간과 지장간의 관계를 읽습니다.</Text></View>

  <View style={styles.section}><Text style={styles.kicker}>표면 오행 분포</Text>{Object.entries(result.elements).map(([k,v])=><View key={k} style={styles.elementRow}><Text style={styles.elementName}>{elementLabel[k]}</Text><View style={styles.barTrack}><View style={[styles.barFill,{width:`${Math.max(8,v/8*100)}%`}]} /></View><Text style={styles.count}>{v}</Text></View>)}<Text style={styles.summary}>가장 많이 보이는 기운 · {strong}</Text><Text style={styles.summary}>표면상 가장 적은 기운 · {weak}</Text></View>

  <View style={styles.section}><Text style={styles.kicker}>십신 구조</Text><Text style={styles.line}>년간 · {result.tenGods.year}</Text><Text style={styles.line}>월간 · {result.tenGods.month}</Text><Text style={styles.line}>시간 · {result.tenGods.hour||'출생시간 미입력'}</Text></View>

  <View style={styles.section}><Text style={styles.kicker}>합 · 충 · 형 · 파 · 해</Text>{relations.length?relations.map((x,i)=><Text key={`${x.type}-${i}`} style={styles.line}>• {x.a}{x.b} · {x.type}</Text>):<Text style={styles.line}>네 지지 사이에서 대표적인 관계가 두드러지지 않습니다.</Text>}<Text style={styles.notice}>관계 표시는 원국 지지 사이의 전통적 관계를 요약한 참고 정보입니다.</Text></View>

  <View style={styles.section}><Text style={styles.kicker}>일간 강약 · 균형 참고</Text><Text style={styles.bigValue}>{balance.strength}</Text><Text style={styles.line}>일간 오행 · {elementLabel[balance.dayElement]}</Text><Text style={styles.line}>월지 대표 오행 · {elementLabel[balance.monthElement]}</Text><Text style={styles.line}>도움 흐름 {balance.supportScore} · 소모/제어 흐름 {balance.drainScore}</Text><Text style={styles.notice}>이 평가는 표면 오행과 월지 대표 오행을 이용한 간이 균형 안내입니다. 용신·희신을 확정하는 전문 판단은 아닙니다.</Text></View>

  <View style={styles.section}><Text style={styles.kicker}>신년운세</Text>{fortune.year.map((x,i)=><Text key={i} style={styles.line}>• {x}</Text>)}</View>
  <View style={styles.section}><Text style={styles.kicker}>월간운세</Text>{fortune.month.map((x,i)=><Text key={i} style={styles.line}>• {x}</Text>)}</View>
  <View style={styles.section}><Text style={styles.kicker}>오늘의 운세</Text>{fortune.today.map((x,i)=><Text key={i} style={styles.line}>• {x}</Text>)}</View>
  <View style={styles.section}><Text style={styles.kicker}>금전운</Text>{fortune.wealth.map((x,i)=><Text key={i} style={styles.line}>• {x}</Text>)}</View>

  <View style={[styles.section,styles.recommend]}><Text style={styles.kicker}>부족한 기운 · Guardian 추천</Text><Text style={styles.line}>표면상 가장 적은 기운 · {weak}</Text><Text style={styles.bigValue}>{elementLabel[balance.recommended]}</Text><Text style={styles.line}>{balance.reason}</Text><Text style={styles.line}>{elementLabel[balance.recommended]}의 생활 주제 · {elementMeaning[balance.recommended]}</Text><Text style={styles.notice}>Guardian은 이 균형 주제를 기억하기 위한 상징적 디지털 콘텐츠이며 실제 운세 변화나 결과를 보장하지 않습니다.</Text><Pressable style={styles.button} onPress={()=>router.push({pathname:'/guardian',params:{element:balance.recommended,source:'saju-result'}})}><Text style={styles.buttonText}>나에게 맞는 {balance.recommended} 기운 Guardian 보기</Text></Pressable></View>

  <Text style={styles.notice}>사주·운세 해석은 전통 명리 체계를 이해하기 쉽게 구조화한 참고 콘텐츠입니다. 투자·계약·의료·법률 등 중요한 결정을 대신하지 않습니다.</Text>
  <Text style={styles.notice}>이 결과 화면을 벗어나면 이름·생년월일·출생시간 입력값은 앱 메모리에서 제거됩니다.</Text>
  <Pressable style={styles.secondary} onPress={()=>router.replace('/saju')}><Text style={styles.secondaryText}>다른 정보로 다시 보기</Text></Pressable>
 </ScrollView>
}
const styles=StyleSheet.create({page:{padding:20,paddingBottom:44,backgroundColor:'#fff',flexGrow:1},center:{flex:1,padding:24,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'},label:{fontSize:12,fontWeight:'800',letterSpacing:1.6,color:'#6b5bd2'},title:{fontSize:30,fontWeight:'900',color:'#222438',marginTop:8},copy:{fontSize:15,lineHeight:24,color:'#626876',marginTop:8},section:{marginTop:18,padding:18,borderWidth:1,borderColor:'#e4e5ec',borderRadius:17,backgroundColor:'#fbfbfe'},recommend:{borderColor:'#c6a65a',backgroundColor:'#fffdf7'},kicker:{fontSize:13,fontWeight:'900',color:'#4f3ad6',marginBottom:10},grid:{flexDirection:'row',flexWrap:'wrap',gap:8},pillar:{width:'48%',padding:14,borderRadius:14,backgroundColor:'#fff',borderWidth:1,borderColor:'#e5e6ec',alignItems:'center'},small:{fontSize:12,color:'#73798a',fontWeight:'700'},pillarText:{fontSize:26,fontWeight:'900',marginTop:4,color:'#27293b'},hanja:{fontSize:14,color:'#777d89',marginTop:2},bigValue:{fontSize:30,fontWeight:'900',color:'#27293b',marginVertical:4},line:{fontSize:15,lineHeight:24,color:'#444a58',marginTop:4},elementRow:{flexDirection:'row',alignItems:'center',gap:9,marginVertical:5},elementName:{width:54,fontSize:14,fontWeight:'800',color:'#3f4452'},barTrack:{flex:1,height:9,borderRadius:99,backgroundColor:'#ececf2',overflow:'hidden'},barFill:{height:9,borderRadius:99,backgroundColor:'#6b5bd2'},count:{width:20,textAlign:'right',fontWeight:'800',color:'#4c5160'},summary:{fontSize:14,lineHeight:22,color:'#555b68',marginTop:8},notice:{fontSize:13,lineHeight:21,color:'#747a88',marginTop:14},button:{marginTop:16,backgroundColor:'#4f3ad6',paddingHorizontal:18,paddingVertical:14,borderRadius:13,alignItems:'center'},buttonText:{color:'#fff',fontWeight:'900',textAlign:'center'},secondary:{marginTop:18,paddingVertical:15,alignItems:'center',borderWidth:1,borderColor:'#d8dbe5',borderRadius:13},secondaryText:{fontWeight:'800',color:'#464b59'}});
