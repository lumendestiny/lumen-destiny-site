import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="index" options={{ title: '루멘 명운' }} />
      <Stack.Screen name="saju" options={{ title: '무료사주' }} />
      <Stack.Screen name="saju-result" options={{ title: '사주 결과' }} />
      <Stack.Screen name="fortune" options={{ title: '운세' }} />
      <Stack.Screen name="compatibility" options={{ title: '궁합' }} />
      <Stack.Screen name="guardian" options={{ title: 'LUMEN GUARDIAN' }} />
      <Stack.Screen name="guardian-order" options={{ title: 'Guardian 발급 준비' }} />
      <Stack.Screen name="guardian-verify" options={{ title: 'Guardian 인증' }} />
    </Stack>
  );
}
