import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

export default function AccountScreen(){
 return <ScrollView contentContainerStyle={s.page}>
  <Text style={s.label}>LUMEN ACCOUNT · APP V1</Text>
  <Text style={s.title}>계정 · 동기화</Text>
  <Text style={s.lead}>휴대폰을 바꿔도 구매하거나 선물 받은 Guardian을 복원할 수 있도록 계정 동기화를 준비하고 있습니다.</Text>

  <View style={s.card}>
   <Text style={s.cardTitle}>로그인 방식</Text>
   <Text style={s.line}>• iPhone · Apple로 로그인</Text>
   <Text style={s.line}>• Android / iPhone · Google로 로그인</Text>
   <Text style={s.note}>이메일 자체를 Guardian 소유권 키로 사용하지 않고, 서버가 발급한 내부 사용자 ID로 소유권을 관리합니다.</Text>
  </View>

  <View style={s.card}>
   <Text style={s.cardTitle}>동기화되는 정보</Text>
   <Text style={s.line}>Guardian 발급번호 · 등급 · 디자인 · 고유번호 · 발급상태</Text>
   <Text style={s.line}>구매/선물/Claim으로 확인된 소유권</Text>
   <Text style={s.safe}>동기화하지 않음 · 생년월일 · 출생시간 · 사주 입력값 · 소망 문구 · 선물 메시지</Text>
  </View>

  <View style={s.card}>
   <Text style={s.cardTitle}>현재 상태</Text>
   <Text style={s.line}>로그인 전에는 기존 ‘내 Guardian’ 보관함이 이 기기에서 그대로 작동합니다.</Text>
   <Text style={s.line}>운영 계정 로그인은 Apple/Google 개발자 자격증명과 서버 검증 API 배포가 끝난 뒤 활성화합니다.</Text>
  </View>

  <View style={s.disabledBox}><Text style={s.disabledTitle}>Apple로 로그인 · 준비 중</Text><Text style={s.disabledText}>운영 Client ID / Service ID와 서버 토큰 검증이 연결되기 전에는 활성화하지 않습니다.</Text></View>
  <View style={s.disabledBox}><Text style={s.disabledTitle}>Google로 로그인 · 준비 중</Text><Text style={s.disabledText}>Android/iOS OAuth Client 설정과 서버 토큰 검증이 완료된 뒤 활성화합니다.</Text></View>

  <Pressable style={s.primary} onPress={()=>router.push('/my-guardian')}><Text style={s.primaryText}>현재 내 Guardian 보기</Text></Pressable>
  <Text style={s.privacy}>계정 삭제 기능도 로그인 활성화와 함께 앱 내부에 제공할 예정입니다. Guardian 공개 인증 기록과 계정 소유권 정보는 분리해서 관리합니다.</Text>
 </ScrollView>
}

const s=StyleSheet.create({page:{padding:18,paddingBottom:52,backgroundColor:'#fff',flexGrow:1},label:{fontSize:12,fontWeight:'900',letterSpacing:1.5,color:'#6b5bd2'},title:{fontSize:30,fontWeight:'900',color:'#242637',marginTop:7},lead:{fontSize:14,lineHeight:22,color:'#676d7a',marginTop:8},card:{marginTop:16,padding:17,borderWidth:1,borderColor:'#e2e4ea',borderRadius:17,backgroundColor:'#fbfbfe'},cardTitle:{fontSize:15,fontWeight:'900',color:'#343746',marginBottom:8},line:{fontSize:13,lineHeight:21,color:'#5d6370',marginTop:3},note:{fontSize:12,lineHeight:19,color:'#747a88',marginTop:9},safe:{fontSize:12,lineHeight:19,color:'#4e6752',fontWeight:'800',marginTop:9},disabledBox:{marginTop:12,padding:16,borderRadius:15,backgroundColor:'#f2f2f5'},disabledTitle:{fontSize:14,fontWeight:'900',color:'#777b86'},disabledText:{fontSize:12,lineHeight:19,color:'#858a95',marginTop:4},primary:{marginTop:20,minHeight:48,borderRadius:13,backgroundColor:'#4f3ad6',alignItems:'center',justifyContent:'center'},primaryText:{color:'#fff',fontSize:14,fontWeight:'900'},privacy:{fontSize:12,lineHeight:19,color:'#777d89',marginTop:18}});
