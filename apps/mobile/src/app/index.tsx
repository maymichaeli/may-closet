import { useQuery } from '@tanstack/react-query';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchCategories } from '../api/categories';
import { ApiHealthCheck } from '../components/ApiHealthCheck';
import { AddCategoryForm } from '../components/AddCategoryForm';

export default function ClosetScreen() {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    retry: false,
  });

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets>
        <Text accessibilityRole="header" style={styles.title}>My Closet</Text>
        {query.isPending && <Text style={styles.detail}>Loading categories…</Text>}
        {query.isError && (
          <View style={styles.card}>
            <Text style={styles.detail}>Couldn’t load your categories.</Text>
            <Button title="Try again" color="#75405D" onPress={() => query.refetch()} />
          </View>
        )}
        {query.isSuccess && query.data.length === 0 && (
          <View style={styles.card}>
            <Text accessible={false} accessibilityElementsHidden importantForAccessibility="no" style={styles.ribbon}>🎀</Text>
            <Text style={styles.message}>Your closet is empty</Text>
            <Text style={styles.detail}>Your clothing and categories will appear here.</Text>
          </View>
        )}
        {query.isSuccess && query.data.length > 0 && (
          <View style={styles.categories}>
            <Text accessibilityRole="header" style={styles.message}>Categories</Text>
            {query.data.map(category => (
              <Text key={category.id} style={styles.category}>{category.name}</Text>
            ))}
          </View>
        )}
        <AddCategoryForm />
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
  categories: {
    gap: 12,
  },
  category: {
    backgroundColor: '#FFFAFB',
    borderColor: '#EBCDD7',
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    color: '#48243B',
    fontSize: 20,
  },
  card: {
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
