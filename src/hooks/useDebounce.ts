import { useState, useEffect } from 'react';

export default function useDebounce <T> (value:T, delay: number = 500) {
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
