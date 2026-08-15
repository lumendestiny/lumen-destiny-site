import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function GuardianScreen(){return <ScrollView contentContainerStyle={s.page}><Text style={s.title}>LUMEN GUARDIAN</Text><View style={s.card}><Text style={s.h}>맞춤 Guardian 아카이브</Text><Text style={s.p}>사주 결과의 보완 참고 기운을 받아 추천 Guardian, 희소성, 남은 수량, SOLD OUT 상태를 앱에서도 같은 서버 기준으로 보여줍니다.</Text></View></ScrollView>}
const s=StyleSheet.create({page:{padding:20,backgroundColor:'#fff',flexGrow:1},title:{fontSize:30,fontWeight:'800',marginBottom:16},card:{padding:20,borderRadius:18,borderWidth:1,borderColor:'#e6e7ec'},h:{fontSize:18,fontWeight:'700'},p:{fontSize:15,lineHeight:24,marginTop:12}});
