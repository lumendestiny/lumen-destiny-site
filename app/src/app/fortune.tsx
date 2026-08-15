import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FortuneScreen(){return <ScrollView contentContainerStyle={s.page}><Text style={s.title}>운세</Text><View style={s.card}><Text style={s.h}>금전운 · 신년운세 · 월간운세 · 오늘의 운세</Text><Text style={s.p}>웹에서 구축한 개인화 운세 구조를 앱용 결과 카드와 기간별 탐색 UI로 옮길 예정입니다.</Text></View></ScrollView>}
const s=StyleSheet.create({page:{padding:20,backgroundColor:'#fff',flexGrow:1},title:{fontSize:30,fontWeight:'800',marginBottom:16},card:{padding:20,borderRadius:18,borderWidth:1,borderColor:'#e6e7ec'},h:{fontSize:18,fontWeight:'700'},p:{fontSize:15,lineHeight:24,marginTop:12}});
