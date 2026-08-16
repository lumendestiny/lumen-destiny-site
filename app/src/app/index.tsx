import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const items = [
  ['무료사주', '사주 네 기둥과 쉬운 해설', '/saju'],
  ['운세', '금전운 · 신년운세 · 월간운세 · 오늘의 운세', '/fortune'],
  ['궁합', '두 사람의 흐름을 비교', '/compatibility'],
  ['인연지도', '지인과 연결해 서로 보완하는 오행과 관계를 확인', '/connection-map'],
  ['인연지도 초대 관리', '보낸 링크와 참여 결과 다시 확인', '/link-invites'],
  ['LUMEN GUARDIAN', '사주 결과와 연결된 맞춤 Guardian', '/guardian'],
  ['내 Guardian', '발급받거나 선물 받은 Guardian 보관함', '/my-guardian'],
  ['계정 · 동기화', '기기 변경 후 Guardian 복원을 위한 계정 준비', '/account'],
] as const;

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>LUMEN DESTINY</Text>
        <Text style={styles.title}>운명을 보는 것이 아니라,{"\n"}삶의 방향을 찾습니다.</Text>
        <Text style={styles.copy}>사주와 운세 해설은 무료로 제공하고, 복잡한 명리 정보를 읽기 쉬운 말로 정리합니다.</Text>
      </View>

      <View style={styles.grid}>
        {items.map(([title, copy, href]) => (
          <Link key={title} href={href} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardCopy}>{copy}</Text>
              <Text style={styles.arrow}>열기 →</Text>
            </Pressable>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingBottom: 40, backgroundColor: '#ffffff' },
  hero: { minHeight: 320, justifyContent: 'center', alignItems: 'center' },
  eyebrow: { fontSize: 12, letterSpacing: 3, fontWeight: '700', marginBottom: 20 },
  title: { fontSize: 34, lineHeight: 44, fontWeight: '800', textAlign: 'center', letterSpacing: -1.2 },
  copy: { maxWidth: 520, marginTop: 24, fontSize: 16, lineHeight: 26, textAlign: 'left' },
  grid: { gap: 12 },
  card: { borderWidth: 1, borderColor: '#e6e7ec', borderRadius: 18, padding: 20, backgroundColor: '#fbfbfd' },
  cardTitle: { fontSize: 20, fontWeight: '800' },
  cardCopy: { marginTop: 7, fontSize: 14, lineHeight: 21 },
  arrow: { marginTop: 18, fontWeight: '700' },
});
