import { useCallback, useState } from 'react';

const useLocalStorageState = (storageKey: string, initialValue = ''): [string, (v: string) => void] => {
  const [value, setValue] = useState<string>(window.localStorage.getItem(storageKey) || initialValue || '');

  if (!window.localStorage.getItem(storageKey)) {
    window.localStorage.setItem(storageKey, initialValue);
  }
  const updateValue = useCallback((newValue: string) => {
    window.localStorage.setItem(storageKey, newValue);
    setValue(newValue);
  }, [storageKey]);

  return [value, updateValue];
};

export default useLocalStorageState;
