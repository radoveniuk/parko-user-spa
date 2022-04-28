import { useState } from 'react';

const useLocalStorageState = (storageKey: string, initialValue = ''): [string, (v: string) => void] => {
  const [value, setValue] = useState<string>(initialValue || window.localStorage.getItem(storageKey) || '');

  if (!window.localStorage.getItem(storageKey)) {
    window.localStorage.setItem(storageKey, initialValue);
  }
  const updateValue = (newValue: string) => {
    window.localStorage.setItem(storageKey, newValue);
    setValue(newValue);
  };

  return [value, updateValue];
};

export default useLocalStorageState;
