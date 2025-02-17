export function saveToLocalStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFromLocalStorage<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}
