import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { randomUUID } from 'expo-crypto';
import { fetchItems, photoUrl, saveItem, type PhotoDraft } from '../../api/items';
import { useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { launchImageLibraryAsync } from 'expo-image-picker';

export default function CategoryScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name?: string }>();
  const [draft, setDraft] = useState<PhotoDraft | null>(null);
  const [galleryWidth, setGalleryWidth] = useState(0);
  const thumbnailSize = Math.max(0, (galleryWidth - 12) / 2);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState('');

  const client = useQueryClient();
  const queryKey = ['categories', id, 'items'];
  const items = useQuery({
    queryKey,
    queryFn: ({ signal }) => fetchItems(id, signal),
    retry: false,
  });
  const save = useMutation({
    mutationFn: (photo: PhotoDraft) => saveItem(id, photo),
    onSuccess: async () => {
      setDraft(null);
      await client.invalidateQueries({ queryKey });
    },
  });

  async function choosePhoto() {
    setPicking(true);
    setError('');
    try {
      const result = await launchImageLibraryAsync({ mediaTypes: ['images'] });
      if (!result.canceled) {
        save.reset();
        setDraft({ id: randomUUID(), asset: result.assets[0] });
      }
    } catch {
      setError('Couldn’t open the selected photo. Please try again.');
    } finally {
      setPicking(false);
    }
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: name ?? 'Category' }} />
      {draft ? (
        <View style={styles.preview}>
          <Text accessibilityRole="header" style={styles.heading}>
            Photo preview
          </Text>
          <Image
            source={{ uri: draft.asset.uri }}
            accessibilityLabel="Selected clothing photo"
            accessible
            resizeMode="contain"
            style={styles.image}
          />
        </View>
      ) : null}
      {draft && (
        <Button
          title={save.isPending ? 'Saving…' : 'Save'}
          color="#75405D"
          disabled={save.isPending || picking}
          onPress={() => save.mutate(draft)}
        />
      )}
      {save.isError && (
        <Text accessibilityRole="alert" style={styles.hint}>
          {save.error.message}
        </Text>
      )}
      <Button
        title={draft ? 'Change photo' : 'Add item'}
        color="#75405D"
        disabled={picking || save.isPending}
        onPress={choosePhoto}
      />
      {draft && (
        <Button
          title="Cancel"
          color="#75405D"
          disabled={picking || save.isPending}
          onPress={() => {
            setDraft(null);
            save.reset();
            setError('');
          }}
        />
      )}
      {error && (
        <Text accessibilityRole="alert" style={styles.hint}>
          {error}
        </Text>
      )}
      {items.isPending && <Text style={styles.hint}>Loading clothing…</Text>}
      {items.isError && (
        <View>
          <Text style={styles.hint}>Couldn’t load clothing.</Text>
          <Button title="Try again" onPress={() => items.refetch()} />
        </View>
      )}
      {items.data?.length === 0 && !draft && (
        <Text style={styles.hint}>Choose a photo of your first item.</Text>
      )}
      {Boolean(items.data?.length) && (
        <View
          style={styles.gallery}
          onLayout={(event) => setGalleryWidth(event.nativeEvent.layout.width)}
        >
          {galleryWidth > 0 &&
            items.data?.map((item) => (
              <Image
                key={item.id}
                source={{ uri: photoUrl(item.id) }}
                accessible
                accessibilityLabel={'Saved item in ' + (name ?? 'category')}
                resizeMode="contain"
                style={[styles.thumbnail, { width: thumbnailSize, height: thumbnailSize }]}
              />
            ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#FFF5F7' },
  content: { padding: 24, gap: 16 },
  preview: { gap: 16 },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  thumbnail: { borderRadius: 12, backgroundColor: '#FFFAFB' },
  heading: { fontFamily: 'Georgia', fontSize: 28, color: '#48243B' },
  hint: { fontSize: 17, color: '#725563' },
  image: { width: '100%', aspectRatio: 1, borderRadius: 16, backgroundColor: '#FFFAFB' },
});
