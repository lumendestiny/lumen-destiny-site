import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const elements = [
  ['木', '성장 · 확장', 34],
  ['火', '표현 · 추진', 27],
  ['土', '안정 · 조율', 18],
  ['金', '결단 · 질서', 9],
  ['水', '유연 · 통찰', 12],
] as const;

const people = [
  ['가족', '金 보완', '강한 보완'],
  ['친구', '水 보완', '좋은 흐름'],
  ['동료', '土 보완', '안정 흐름'],
] as const;

export default function ConnectionMapScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.eyebrow}>LUMEN LINK · BETA</Text>
      <Text style={styles.title}>인연 오행지도</Text>
      <Text style={styles.lead}>내 주변 사람들과 어떤 기운을 주고받는지 연결해서 살펴봅니다.</Text>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>첫 번째 버전</Text>
        <Text style={styles.noticeCopy}>현재는 독자적인 화면·데이터 구조를 먼저 구축하는 단계입니다. 초대 링크와 서버 저장은 개인정보·소유권 구조를 확정한 뒤 연결합니다.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>나의 오행 기준</Text>
        {elements.map(([name, label, value]) => (
          <View key={name} style={styles.elementRow}>
            <View style={styles.elementName}><Text style={styles.elementHan}>{name}</Text><Text style={styles.elementLabel}>{label}</Text></View>
            <View style={styles.track}><View style={[styles.fill, { width: `${value}%` }]} /></View>
            <Text style={styles.percent}>{value}%</Text>
          </View>
        ))}
        <Text style={styles.insight}>예시에서는 金이 가장 적습니다. 실제 서비스에서는 사용자의 명식을 계산해 이 기준을 자동 생성합니다.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>내 인연 네트워크</Text>
        <View style={styles.me}><Text style={styles.meText}>나</Text></View>
        {people.map(([relation, complement, flow]) => (
          <View key={relation} style={styles.personCard}>
            <View><Text style={styles.personTitle}>{relation}</Text><Text style={styles.personCopy}>{complement}</Text></View>
            <Text style={styles.badge}>{flow}</Text>
          </View>
        ))}
        <Text style={styles.insight}>사람이 추가될수록 누가 어떤 오행을 보완하는지와 인연망 전체의 균형을 다시 계산하는 구조로 확장합니다.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>친구를 연결해 지도 완성하기</Text>
        <Text style={styles.body}>초대받은 사람이 자신의 정보를 직접 입력하고 참여하면 두 사람의 보완 관계만 연결됩니다. 상대의 원본 생년월일·출생시간은 초대한 사람에게 공개하지 않는 것을 기본 원칙으로 합니다.</Text>
        <Pressable style={styles.disabledButton}><Text style={styles.disabledButtonText}>초대 링크 만들기 · 준비 중</Text></Pressable>
      </View>

      <View style={styles.guardianBox}>
        <Text style={styles.sectionTitle}>인연망에서도 부족한 기운</Text>
        <Text style={styles.body}>사람들과의 보완 관계를 계산한 뒤에도 부족한 오행이 남는 경우에만 관련 의미와 Guardian을 선택적으로 안내합니다.</Text>
        <Link href="/guardian" asChild><Pressable style={styles.guardianButton}><Text style={styles.guardianButtonText}>Guardian 살펴보기 →</Text></Pressable></Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, paddingBottom: 50, backgroundColor: '#fff' },
  eyebrow: { marginTop: 18, fontSize: 12, letterSpacing: 2.4, fontWeight: '800', color: '#5146c8' },
  title: { marginTop: 10, fontSize: 34, lineHeight: 42, fontWeight: '900', letterSpacing: -1.2 },
  lead: { marginTop: 12, fontSize: 17, lineHeight: 27, color: '#4d5260' },
  notice: { marginTop: 24, padding: 18, borderRadius: 18, backgroundColor: '#f3f1ff' },
  noticeTitle: { fontSize: 16, fontWeight: '800', color: '#5146c8' },
  noticeCopy: { marginTop: 8, fontSize: 14, lineHeight: 22, color: '#555968' },
  section: { marginTop: 18, padding: 18, borderWidth: 1, borderColor: '#e7e8ed', borderRadius: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900' },
  elementRow: { marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 10 },
  elementName: { width: 84 },
  elementHan: { fontSize: 18, fontWeight: '900' },
  elementLabel: { marginTop: 2, fontSize: 11, color: '#727783' },
  track: { flex: 1, height: 8, borderRadius: 999, backgroundColor: '#ececf1', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, backgroundColor: '#5146c8' },
  percent: { width: 36, textAlign: 'right', fontWeight: '700' },
  insight: { marginTop: 18, fontSize: 13, lineHeight: 21, color: '#686d79' },
  me: { marginTop: 18, width: 64, height: 64, borderRadius: 32, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1f2330' },
  meText: { color: '#fff', fontWeight: '900', fontSize: 18 },
  personCard: { marginTop: 10, padding: 14, borderRadius: 14, backgroundColor: '#f8f8fb', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  personTitle: { fontSize: 16, fontWeight: '800' },
  personCopy: { marginTop: 3, fontSize: 13, color: '#666b77' },
  badge: { fontSize: 12, fontWeight: '800', color: '#5146c8' },
  body: { marginTop: 10, fontSize: 14, lineHeight: 23, color: '#555a66' },
  disabledButton: { marginTop: 16, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: '#ececf1' },
  disabledButtonText: { fontWeight: '800', color: '#777b85' },
  guardianBox: { marginTop: 18, padding: 20, borderRadius: 20, backgroundColor: '#f7f6ff' },
  guardianButton: { marginTop: 16, paddingVertical: 14, borderRadius: 14, alignItems: 'center', backgroundColor: '#5146c8' },
  guardianButtonText: { color: '#fff', fontWeight: '900' },
});
