// 定義存儲的鍵名
export const STORAGE_KEYS = {
  USER_TYPE: 'user_type',
  ADDITIONAL_INFO: 'additional_info',
  WORK_EXPERIENCE: 'work_experience',
  PROJECT_EXPERIENCE: 'project_experience',
  RESUME_DATA: 'resume_data',
  SELECTED_MODEL: 'selected_model'
} as const;

// 類型定義
export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// 存儲數據
export const setStorageItem = <T>(key: StorageKey, value: T): void => {
  try {
    if (typeof window !== 'undefined') {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    }
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
  }
};

// 獲取數據
export const getStorageItem = <T>(key: StorageKey): T | null => {
  try {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    }
    return null;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return null;
  }
};

// 刪除數據
export const removeStorageItem = (key: StorageKey): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing from localStorage: ${error}`);
  }
};

// 清除所有數據
export const clearStorage = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  } catch (error) {
    console.error(`Error clearing localStorage: ${error}`);
  }
}; 