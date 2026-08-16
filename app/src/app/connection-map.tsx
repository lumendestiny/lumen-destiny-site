import { useState } from 'react';
import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { calculateConnection, ConnectionResult, ELEMENT_ORDER, elementPercent } from '../lib/connection-engine';
import type { SajuInput } from '../lib/saju-session';

type Person={name:string;birthDate:string;birthTime:string;calendar:'solar'|'lunar'};
const empty=():Person=>({name:'',birthDate:'',birthTime:'',calendar:'solar'});
const label:Record<string,string>={목:'성장 · 확장',화:'표현 · 추진',토:'안정 · 조율',금:'결단 · 질서',수:'유연 · 통찰'};

export default function ConnectionMapScreen() {
  const [me,setMe]=useState<Person>(empty());
  const [other,setOther]=useState<Person>(empty());
  const [result,setResult]=useState<ConnectionResult|null>(null);
  const [message,setMessage]=useState('');
  const valid=(p:Person)=>!!p.name.trim()&&/^\d{4}-\d{2}-\d{2}$/.test(p.birthDate.trim())&&(!p.birthTime.trim()||/^\d{2}:\d{2}$/.test(p.birthTime.trim()));
  const run=()=>{
    setMessage('');setResult(null);
    if(!valid(me)||!valid(other)){setMessage('두 사람의 이름과 생년월일(YYYY-MM-DD)을 확인해 주세요. 출생시간은 알면 HH:MM 형식으로 입력해 주세요.');return;}
    try{
      const toInput=(p:Person):SajuInput=>({name:p.name.trim(),birthDate:p.birthDate.trim(),birthTime:p.birthTime.trim(),calendar:p.calendar,gender:'unspecified'});
      setResult(calculateConnection(toInput(me),toInput(other)));
    }catch{setMessage('오행 연결 계산에 실패했습니다. 날짜와 시간을 다시 확인해 주세요.');}
  };
  return (
    <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
      <Text style={styles.eyebrow}>LUMEN LINK · BETA</Text>
      <Text style={styles.title}>인연 오행지도</Text>
      <Text style={styles.lead}>두 사람의 실제 명식을 계산해 서로 어떤 오행을 상대적으로 보완하는지 살펴봅니다.</Text>

      <View style={styles.notice}><Text style={styles.noticeTitle}>루멘 독자 구조</Text><Text style={styles.noticeCopy}>현재 버전은 두 사람의 오행 분포와 부족·초과 영역을 비교하는 자체 계산 구조입니다. 점수는 관계의 좋고 나쁨이 아니라 오행 분포의 ‘보완 정도’를 나타내는 참고값입니다.</Text></View>

      <PersonCard title="나" value={me} onChange={setMe}/>
      <PersonCard title="연결할 사람" value={other} onChange={setOther}/>
      <Pressable style={styles.primary} onPress={run}><Text style={styles.primaryText}>인연 오행지도 계산하기</Text></Pressable>
      {message?<Text style={styles.message}>{message}</Text>:null}

      {result?<>
        <View style={styles.scoreBox}><Text style={styles.score}>{result.score}</Text><View style={{flex:1}}><Text style={styles.scoreLabel}>오행 보완도</Text><Text style={styles.grade}>{result.grade}</Text></View></View>
        <View style={styles.section}><Text style={styles.sectionTitle}>{result.a.name}님의 오행</Text>{ELEMENT_ORDER.map(k=><ElementRow key={k} name={k} value={elementPercent(result.a.elements,k)}/>)}</View>
        <View style={styles.section}><Text style={styles.sectionTitle}>{result.b.name}님의 오행</Text>{ELEMENT_ORDER.map(k=><ElementRow key={k} name={k} value={elementPercent(result.b.elements,k)}/>)}</View>
        <View style={styles.section}><Text style={styles.sectionTitle}>서로 보완되는 흐름</Text><Text style={styles.body}>{result.summary}</Text>
          {result.strongestForA?<View style={styles.personCard}><View><Text style={styles.personTitle}>{result.b.name} → {result.a.name}</Text><Text style={styles.personCopy}>{result.strongestForA.element} 기운 보완 · {result.strongestForA.label}</Text></View><Text style={styles.badge}>보완</Text></View>:null}
          {result.strongestForB?<View style={styles.personCard}><View><Text style={styles.personTitle}>{result.a.name} → {result.b.name}</Text><Text style={styles.personCopy}>{result.strongestForB.element} 기운 보완 · {result.strongestForB.label}</Text></View><Text style={styles.badge}>보완</Text></View>:null}
          {result.sharedGap.length?<Text style={styles.insight}>두 사람에게 공통으로 낮게 보이는 기운: {result.sharedGap.join(' · ')}</Text>:null}
        </View>
      </>:null}

      <View style={styles.section}><Text style={styles.sectionTitle}>친구를 연결해 지도 완성하기</Text><Text style={styles.body}>다음 단계에서는 초대 링크를 받은 사람이 자신의 정보를 직접 입력하고 참여하도록 연결합니다. 생년월일·출생시간 원본은 상대방에게 노출하지 않고, 계산된 관계 요약만 지도에 남기는 방향으로 개발합니다.</Text><Pressable style={styles.disabledButton}><Text style={styles.disabledButtonText}>개인 초대 링크 · 서버 연결 준비 중</Text></Pressable></View>

      <View style={styles.guardianBox}><Text style={styles.sectionTitle}>인연망에서도 부족한 기운</Text><Text style={styles.body}>여러 지인이 연결되면 전체 인연망을 합산해 반복해서 보완되지 않는 오행을 찾고, 그 의미를 먼저 설명한 뒤 관련 Guardian을 선택적으로 안내할 예정입니다.</Text><Link href="/guardian" asChild><Pressable style={styles.guardianButton}><Text style={styles.guardianButtonText}>Guardian 살펴보기 →</Text></Pressable></Link></View>
      <Text style={styles.privacy}>입력한 두 사람의 출생정보는 현재 이 화면 계산에만 사용하며 계정이나 Guardian 보관함에 저장하지 않습니다.</Text>
    </ScrollView>
  );
}
function PersonCard({title,value,onChange}:{title:string;value:Person;onChange:(v:Person)=>void}){return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><TextInput style={styles.input} value={value.name} onChangeText={x=>onChange({...value,name:x})} placeholder="이름 또는 닉네임"/><TextInput style={styles.input} value={value.birthDate} onChangeText={x=>onChange({...value,birthDate:x})} placeholder="생년월일 YYYY-MM-DD" keyboardType="numbers-and-punctuation"/><TextInput style={styles.input} value={value.birthTime} onChangeText={x=>onChange({...value,birthTime:x})} placeholder="출생시간 HH:MM · 모르면 비워두기" keyboardType="numbers-and-punctuation"/><View style={styles.toggleRow}>{(['solar','lunar'] as const).map(v=><Pressable key={v} onPress={()=>onChange({...value,calendar:v})} style={[styles.toggle,value.calendar===v&&styles.toggleOn]}><Text style={[styles.toggleText,value.calendar===v&&styles.toggleTextOn]}>{v==='solar'?'양력':'음력'}</Text></Pressable>)}</View></View>}
function ElementRow({name,value}:{name:(typeof ELEMENT_ORDER)[number];value:number}){return <View style={styles.elementRow}><View style={styles.elementName}><Text style={styles.elementHan}>{name}</Text><Text style={styles.elementLabel}>{label[name]}</Text></View><View style={styles.track}><View style={[styles.fill,{width:`${Math.max(4,value)}%`}]} /></View><Text style={styles.percent}>{value}%</Text></View>}
const styles=StyleSheet.create({page:{padding:20,paddingBottom:50,backgroundColor:'#fff'},eyebrow:{marginTop:18,fontSize:12,letterSpacing:2.4,fontWeight:'800',color:'#5146c8'},title:{marginTop:10,fontSize:34,lineHeight:42,fontWeight:'900',letterSpacing:-1.2},lead:{marginTop:12,fontSize:17,lineHeight:27,color:'#4d5260'},notice:{marginTop:24,padding:18,borderRadius:18,backgroundColor:'#f3f1ff'},noticeTitle:{fontSize:16,fontWeight:'800',color:'#5146c8'},noticeCopy:{marginTop:8,fontSize:14,lineHeight:22,color:'#555968'},section:{marginTop:18,padding:18,borderWidth:1,borderColor:'#e7e8ed',borderRadius:20},sectionTitle:{fontSize:20,fontWeight:'900'},input:{marginTop:10,borderWidth:1,borderColor:'#dfe1e8',borderRadius:12,paddingHorizontal:12,paddingVertical:12,fontSize:14,backgroundColor:'#fff'},toggleRow:{flexDirection:'row',gap:8,marginTop:10},toggle:{flex:1,minHeight:40,borderWidth:1,borderColor:'#dadce5',borderRadius:10,alignItems:'center',justifyContent:'center'},toggleOn:{backgroundColor:'#5146c8',borderColor:'#5146c8'},toggleText:{fontSize:13,fontWeight:'800',color:'#5d6370'},toggleTextOn:{color:'#fff'},primary:{marginTop:18,minHeight:50,borderRadius:14,backgroundColor:'#1f2330',alignItems:'center',justifyContent:'center'},primaryText:{color:'#fff',fontWeight:'900'},message:{marginTop:10,fontSize:13,lineHeight:20,color:'#9a4747'},scoreBox:{marginTop:22,padding:18,borderRadius:20,backgroundColor:'#f7f6ff',flexDirection:'row',alignItems:'center',gap:18},score:{fontSize:48,fontWeight:'900',color:'#5146c8'},scoreLabel:{fontSize:13,fontWeight:'800',color:'#686d79'},grade:{marginTop:3,fontSize:20,fontWeight:'900'},elementRow:{marginTop:16,flexDirection:'row',alignItems:'center',gap:10},elementName:{width:84},elementHan:{fontSize:18,fontWeight:'900'},elementLabel:{marginTop:2,fontSize:11,color:'#727783'},track:{flex:1,height:8,borderRadius:999,backgroundColor:'#ececf1',overflow:'hidden'},fill:{height:'100%',borderRadius:999,backgroundColor:'#5146c8'},percent:{width:36,textAlign:'right',fontWeight:'700'},personCard:{marginTop:12,padding:14,borderRadius:14,backgroundColor:'#f8f8fb',flexDirection:'row',justifyContent:'space-between',alignItems:'center'},personTitle:{fontSize:16,fontWeight:'800'},personCopy:{marginTop:3,fontSize:13,color:'#666b77'},badge:{fontSize:12,fontWeight:'800',color:'#5146c8'},body:{marginTop:10,fontSize:14,lineHeight:23,color:'#555a66'},insight:{marginTop:16,fontSize:13,lineHeight:21,color:'#686d79'},disabledButton:{marginTop:16,paddingVertical:14,borderRadius:14,alignItems:'center',backgroundColor:'#ececf1'},disabledButtonText:{fontWeight:'800',color:'#777b85'},guardianBox:{marginTop:18,padding:20,borderRadius:20,backgroundColor:'#f7f6ff'},guardianButton:{marginTop:16,paddingVertical:14,borderRadius:14,alignItems:'center',backgroundColor:'#5146c8'},guardianButtonText:{color:'#fff',fontWeight:'900'},privacy:{fontSize:12,lineHeight:19,color:'#777d89',marginTop:18}});
