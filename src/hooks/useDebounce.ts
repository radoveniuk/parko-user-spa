import { useState, useEffect } from 'react';

export default function useDebounce (value:any, delay: number = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => {
        clearTimeout(handler);
      };
    },
    [delay, value],
  );

  return debouncedValue;
}
