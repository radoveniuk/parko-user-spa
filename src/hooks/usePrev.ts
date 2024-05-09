import { useEffect, useRef } from 'react';

export default function usePrev (value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current as any;
}
