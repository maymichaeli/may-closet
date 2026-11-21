import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{ headerTintColor: '#48243B', headerStyle: { backgroundColor: '#FFF5F7' } }}
      >
        <Stack.Screen name="index" options={{ title: 'My Closet', headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
