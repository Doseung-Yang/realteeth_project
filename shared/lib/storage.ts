const STORAGE_VERSION = "v1";

export function saveToStorage<T>(key: string, data: T): boolean {
  try {
    const versionedKey = `${key}:${STORAGE_VERSION}`;
    localStorage.setItem(versionedKey, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    return false;
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const versionedKey = `${key}:${STORAGE_VERSION}`;
    const data = localStorage.getItem(versionedKey);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to load from localStorage:", error);
    return null;
  }
}

export function removeFromStorage(key: string): boolean {
  try {
    const versionedKey = `${key}:${STORAGE_VERSION}`;
    localStorage.removeItem(versionedKey);
    return true;
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
    return false;
  }
}
