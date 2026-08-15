import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CompatibilityScreen(){return <ScrollView contentContainerStyle={s.page}><Text style={s.title}>궁합</Text><View style={s.card}><Text style={s.h}>두 사람의 흐름 비교</Text><Text style={s.p}>웹 궁합 계산 결과와 쉬운 해설을 앱 전용 입력·결과 흐름으로 연결합니다.</Text></View></ScrollView>}
const s=StyleSheet.create({page:{padding:20,backgroundColor:'#fff',flexGrow:1},title:{fontSize:30,fontWeight:'800',marginBottom:16},card:{padding:20,borderRadius:18,borderWidth:1,borderColor:'#e6e7ec'},h:{fontSize:18,fontWeight:'700'},p:{fontSize:15,lineHeight:24,marginTop:12}});
