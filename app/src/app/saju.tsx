import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SajuScreen() {
  return <ScrollView contentContainerStyle={styles.page}><View style={styles.card}><Text style={styles.label}>FREE SAJU</Text><Text style={styles.title}>무료사주</Text><Text style={styles.copy}>다음 단계에서 웹의 사주 계산 엔진과 개인정보 임시전달 구조를 앱 공통 API에 연결합니다.</Text></View></ScrollView>;
}
const styles=StyleSheet.create({page:{padding:20,backgroundColor:'#fff',flexGrow:1},card:{padding:22,borderWidth:1,borderColor:'#e6e7ec',borderRadius:18},label:{fontSize:12,fontWeight:'700',letterSpacing:2},title:{fontSize:30,fontWeight:'800',marginTop:8},copy:{fontSize:16,lineHeight:26,marginTop:18}});
