import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { setSajuSession } from '../lib/saju-session';

export default function SajuScreen() {
  const [name,setName]=useState('');
  const [birthDate,setBirthDate]=useState('');
  const [birthTime,setBirthTime]=useState('');
  const [calendar,setCalendar]=useState<'solar'|'lunar'>('solar');
  const [gender,setGender]=useState<'male'|'female'|'unspecified'>('unspecified');
  const [error,setError]=useState('');

  function submit(){
    const dateOk=/^\d{4}-\d{2}-\d{2}$/.test(birthDate);
    const timeOk=!birthTime||/^\d{2}:\d{2}$/.test(birthTime);
    if(!name.trim()){setError('이름 또는 닉네임을 입력해 주세요.');return;}
    if(!dateOk){setError('생년월일을 YYYY-MM-DD 형식으로 입력해 주세요.');return;}
    if(!timeOk){setError('출생시간은 HH:MM 형식으로 입력해 주세요. 모르면 비워둘 수 있습니다.');return;}
    setError('');
    setSajuSession({name:name.trim(),birthDate,birthTime,calendar,gender});
    router.push('/saju-result');
  }

  return <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <Text style={styles.label}>FREE SAJU</Text>
    <Text style={styles.title}>무료사주</Text>
    <Text style={styles.copy}>복잡한 명리 정보를 읽기 쉬운 말로 정리합니다. 사주와 운세 해설은 무료입니다.</Text>

    <View style={styles.card}>
      <Text style={styles.fieldLabel}>이름 또는 닉네임</Text>
      <TextInput value={name} onChangeText={setName} placeholder="예: 지환" style={styles.input} maxLength={30}/>
      <Text style={styles.fieldLabel}>생년월일</Text>
      <TextInput value={birthDate} onChangeText={setBirthDate} placeholder="1980-01-01" keyboardType="numbers-and-punctuation" style={styles.input}/>
      <Text style={styles.fieldLabel}>출생시간</Text>
      <TextInput value={birthTime} onChangeText={setBirthTime} placeholder="14:30 · 모르면 비워두세요" keyboardType="numbers-and-punctuation" style={styles.input}/>

      <Text style={styles.fieldLabel}>달력</Text>
      <View style={styles.row}>{(['solar','lunar'] as const).map(v=><Pressable key={v} onPress={()=>setCalendar(v)} style={[styles.chip,calendar===v&&styles.chipActive]}><Text style={[styles.chipText,calendar===v&&styles.chipTextActive]}>{v==='solar'?'양력':'음력'}</Text></Pressable>)}</View>
      <Text style={styles.fieldLabel}>성별</Text>
      <View style={styles.row}>{(['male','female','unspecified'] as const).map(v=><Pressable key={v} onPress={()=>setGender(v)} style={[styles.chip,gender===v&&styles.chipActive]}><Text style={[styles.chipText,gender===v&&styles.chipTextActive]}>{v==='male'?'남성':v==='female'?'여성':'선택 안 함'}</Text></Pressable>)}</View>

      {!!error&&<Text style={styles.error}>{error}</Text>}
      <Pressable onPress={submit} style={styles.button}><Text style={styles.buttonText}>무료 결과 보기</Text></Pressable>
    </View>

    <View style={styles.notice}><Text style={styles.noticeTitle}>개인정보 안내</Text><Text style={styles.noticeText}>입력한 출생정보는 앱 화면 이동을 위해 메모리에만 임시 보관하고, 결과 화면을 닫거나 다시 시작하면 제거하는 구조로 설계하고 있습니다. URL이나 공개 인증 기록에는 넣지 않습니다.</Text></View>
  </ScrollView>;
}
const styles=StyleSheet.create({page:{padding:20,paddingBottom:40,backgroundColor:'#fff',flexGrow:1},label:{fontSize:12,fontWeight:'800',letterSpacing:2,color:'#6b5bd2'},title:{fontSize:34,fontWeight:'900',marginTop:8,color:'#222438'},copy:{fontSize:16,lineHeight:25,marginTop:12,color:'#606575'},card:{padding:20,borderWidth:1,borderColor:'#e6e7ec',borderRadius:20,marginTop:22,backgroundColor:'#fff'},fieldLabel:{fontSize:13,fontWeight:'800',color:'#414654',marginTop:14,marginBottom:7},input:{height:50,borderWidth:1,borderColor:'#dfe2e8',borderRadius:13,paddingHorizontal:14,fontSize:16,backgroundColor:'#fafbfc'},row:{flexDirection:'row',flexWrap:'wrap',gap:8},chip:{paddingHorizontal:14,paddingVertical:10,borderWidth:1,borderColor:'#dddfea',borderRadius:999,backgroundColor:'#fff'},chipActive:{backgroundColor:'#4f3ad6',borderColor:'#4f3ad6'},chipText:{fontSize:14,fontWeight:'700',color:'#555b68'},chipTextActive:{color:'#fff'},error:{color:'#b42318',marginTop:14,lineHeight:21},button:{marginTop:20,minHeight:52,borderRadius:14,backgroundColor:'#4f3ad6',alignItems:'center',justifyContent:'center'},buttonText:{color:'#fff',fontWeight:'900',fontSize:16},notice:{marginTop:18,padding:16,borderRadius:14,backgroundColor:'#f7f6fc'},noticeTitle:{fontWeight:'900',color:'#373a49'},noticeText:{fontSize:13,lineHeight:21,color:'#666c79',marginTop:6}});
