import { useEffect, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { API_BASE_URL } from '../constants/api';

export function ApiHealthCheck() {
  const [status, setStatus] = useState<'Checking' | 'Connected' | 'Unavailable'>('Checking');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    let active = true;

    async function checkHealth() {
      try {
        const response = await fetch(new URL('/health', API_BASE_URL).href, {
          signal: controller.signal,
        });
        const healthy = response.ok && (await response.json())?.status === 'ok';
        if (active) setStatus(healthy ? 'Connected' : 'Unavailable');
      } catch {
        if (active) setStatus('Unavailable');
      } finally {
        clearTimeout(timeout);
      }
    }

    void checkHealth();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt]);

  function refresh() {
    setStatus('Checking');
    setAttempt(previous => previous + 1);
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <Text accessibilityLiveRegion="polite" style={{ color: '#725563' }}>API · {status}</Text>
      <Button title="Refresh connection" color="#75405D" disabled={status === 'Checking'} onPress={refresh} />
    </View>
  );
}
