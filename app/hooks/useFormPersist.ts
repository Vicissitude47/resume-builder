'use client';

import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, StorageKey } from '../utils/storage';

export function useFormPersist<T>(key: StorageKey, initialState: T) {
  // 初始化狀態，優先使用本地存儲的數據
  const [state, setState] = useState<T>(() => {
    const storedValue = getStorageItem<T>(key);
    return storedValue !== null ? storedValue : initialState;
  });

  // 當狀態改變時，自動保存到本地存儲
  useEffect(() => {
    setStorageItem(key, state);
  }, [key, state]);

  // 提供一個重置函數
  const resetState = () => {
    setState(initialState);
  };

  return [state, setState, resetState] as const;
} 