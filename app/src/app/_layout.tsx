import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerTitleAlign: 'center' }}>
      <Stack.Screen name="index" options={{ title: '루멘 명운' }} />
      <Stack.Screen name="saju" options={{ title: '무료사주' }} />
      <Stack.Screen name="saju-result" options={{ title: '사주 결과' }} />
      <Stack.Screen name="fortune" options={{ title: '운세' }} />
      <Stack.Screen name="compatibility" options={{ title: '궁합' }} />
      <Stack.Screen name="connection-map" options={{ title: '인연지도' }} />
      <Stack.Screen name="link-join" options={{ title: '인연지도 초대' }} />
      <Stack.Screen name="link-invites" options={{ title: '인연지도 초대 관리' }} />
      <Stack.Screen name="guardian" options={{ title: 'LUMEN GUARDIAN' }} />
      <Stack.Screen name="guardian-order" options={{ title: 'Guardian 발급 준비' }} />
      <Stack.Screen name="guardian-verify" options={{ title: 'Guardian 인증' }} />
      <Stack.Screen name="my-guardian" options={{ title: '내 Guardian' }} />
      <Stack.Screen name="account" options={{ title: '계정 · 동기화' }} />
    </Stack>
  );
}
