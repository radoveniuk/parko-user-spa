import { MutableRefObject, useEffect } from 'react';

export default function useOutsideClick (ref: MutableRefObject<HTMLUnknownElement | null>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside (event: MouseEvent) {
      if (ref && ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
