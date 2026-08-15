import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { clearSajuSession, getSajuSession, SajuInput } from '../lib/saju-session';

export default function SajuResultScreen(){
 const [data,setData]=useState<SajuInput|null>(null);
 useEffect(()=>{setData(getSajuSession());return()=>clearSajuSession()},[]);
 if(!data)return <View style={styles.center}><Text style={styles.title}>입력정보가 없습니다.</Text><Pressable style={styles.button} onPress={()=>router.replace('/saju')}><Text style={styles.buttonText}>무료사주 입력하기</Text></Pressable></View>;
 return <ScrollView contentContainerStyle={styles.page}>
  <Text style={styles.label}>SAJU RESULT · APP V1</Text>
  <Text style={styles.title}>{data.name}님의 사주 결과</Text>
  <Text style={styles.copy}>앱의 네이티브 입력 흐름이 연결되었습니다. 다음 단계에서 웹에서 검증한 사주 계산 엔진을 공통 API로 분리해 이 화면에 실제 네 기둥·오행·십신·운세 해설을 연결합니다.</Text>
  <View style={styles.card}>
   <Text style={styles.kicker}>입력 확인</Text>
   <Text style={styles.line}>생년월일 · {data.birthDate}</Text>
   <Text style={styles.line}>출생시간 · {data.birthTime||'모름'}</Text>
   <Text style={styles.line}>달력 · {data.calendar==='solar'?'양력':'음력'}</Text>
   <Text style={styles.line}>성별 · {data.gender==='male'?'남성':data.gender==='female'?'여성':'선택 안 함'}</Text>
  </View>
  <View style={styles.card}><Text style={styles.kicker}>연결 예정 결과</Text><Text style={styles.line}>사주 네 기둥 · 오행 분포 · 십신 · 합충형파해</Text><Text style={styles.line}>금전운 · 신년운세 · 월간운세 · 오늘의 운세</Text><Text style={styles.line}>부족/보완 기운 · 맞춤 Guardian 추천</Text></View>
  <Text style={styles.notice}>이 화면을 벗어나면 입력 정보는 앱 메모리에서 제거됩니다.</Text>
  <Pressable style={styles.secondary} onPress={()=>router.replace('/saju')}><Text style={styles.secondaryText}>다른 정보로 다시 보기</Text></Pressable>
 </ScrollView>
}
const styles=StyleSheet.create({page:{padding:20,paddingBottom:40,backgroundColor:'#fff',flexGrow:1},center:{flex:1,padding:24,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'},label:{fontSize:12,fontWeight:'800',letterSpacing:1.6,color:'#6b5bd2'},title:{fontSize:30,fontWeight:'900',color:'#222438',marginTop:8},copy:{fontSize:15,lineHeight:24,color:'#626876',marginTop:12},card:{marginTop:18,padding:18,borderWidth:1,borderColor:'#e4e5ec',borderRadius:17,backgroundColor:'#fbfbfe'},kicker:{fontSize:13,fontWeight:'900',color:'#4f3ad6',marginBottom:8},line:{fontSize:15,lineHeight:25,color:'#444a58'},notice:{fontSize:13,lineHeight:21,color:'#747a88',marginTop:18},button:{marginTop:18,backgroundColor:'#4f3ad6',paddingHorizontal:20,paddingVertical:14,borderRadius:13},buttonText:{color:'#fff',fontWeight:'900'},secondary:{marginTop:18,paddingVertical:15,alignItems:'center',borderWidth:1,borderColor:'#d8dbe5',borderRadius:13},secondaryText:{fontWeight:'800',color:'#464b59'}});
