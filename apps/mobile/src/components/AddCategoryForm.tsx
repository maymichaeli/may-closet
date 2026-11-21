import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { createCategory } from '../api/categories';

export function AddCategoryForm() {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createCategory,
    onSuccess: async () => {
      setName('');
      Keyboard.dismiss();
      await queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const canSave = name.trim().length > 0 && !mutation.isPending;
  function save() {
    if (canSave) {
      mutation.mutate(name.trim());
    }
  }

  return (
    <View style={styles.form}>
      <Text style={styles.label}>New category</Text>
      <TextInput
        accessibilityLabel="New category"
        placeholder="Category name"
        placeholderTextColor="#725563"
        value={name}
        editable={!mutation.isPending}
        onChangeText={(value) => {
          setName(value);
          if (mutation.isError) {
            mutation.reset();
          }
        }}
        onSubmitEditing={save}
        returnKeyType="done"
        style={styles.input}
      />
      {mutation.isError && (
        <Text accessibilityRole="alert" style={styles.error}>
          {mutation.error.message}
        </Text>
      )}
      <Button
        title={mutation.isPending ? 'Saving…' : 'Add category'}
        color="#75405D"
        disabled={!canSave}
        onPress={save}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 8 },
  label: { color: '#48243B', fontSize: 18, fontWeight: '600' },
  input: {
    color: '#48243B',
    backgroundColor: '#FFFAFB',
    borderColor: '#C792A5',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 17,
  },
  error: { color: '#902945' },
});
