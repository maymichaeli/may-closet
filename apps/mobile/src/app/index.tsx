import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ApiHealthCheck } from '../components/ApiHealthCheck';

export default function ClosetScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>My Closet</Text>
        <View style={styles.emptyState}>
          <Text accessible={false} accessibilityElementsHidden importantForAccessibility="no" style={styles.ribbon}>🎀</Text>
          <Text style={styles.message}>Your closet is empty</Text>
          <Text style={styles.detail}>Your clothing and categories will appear here.</Text>
        </View>
        {__DEV__ && <ApiHealthCheck />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 28,
  },
  title: {
    color: '#48243B',
    fontFamily: 'Georgia',
    fontSize: 42,
  },
  emptyState: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#EBCDD7',
    backgroundColor: '#FFFAFB',
  },
  ribbon: {
    fontSize: 40,
  },
  message: {
    color: '#48243B',
    fontFamily: 'Georgia',
    fontSize: 25,
    textAlign: 'center',
  },
  detail: {
    color: '#725563',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
