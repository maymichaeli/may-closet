type Category = { id: string; name: string };

const categoriesUrl = () => new URL('/categories', process.env.EXPO_PUBLIC_API_URL).href;

export async function fetchCategories({ signal }: { signal: AbortSignal }): Promise<Category[]> {
  const response = await fetch(categoriesUrl(), { signal });
  if (!response.ok) throw new Error('Could not load categories');
  return response.json();
}

export async function createCategory(name: string): Promise<Category> {
  const response = await fetch(categoriesUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (response.status === 409) throw new Error('A category with this name already exists.');
  if (!response.ok) throw new Error('Couldn’t save this category. Please try again.');
  return response.json();
}
