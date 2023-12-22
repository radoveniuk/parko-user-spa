import { MutableRefObject, useEffect } from 'react';

export default function useOutsideClick (
  ref: MutableRefObject<HTMLUnknownElement | null> | MutableRefObject<HTMLUnknownElement | null>[], callback: (e?: any) => void) {
  useEffect(() => {
    function handleClickOutside (event: MouseEvent) {
      if (!Array.isArray(ref) && ref.current && !ref.current.contains(event.target as Node)) {
        callback(event);
      }
      if (Array.isArray(ref)) {
        let isOutsideClicked = true;
        ref.forEach((refItem) => {
          if (refItem.current && refItem.current.contains(event.target as Node)) {
            isOutsideClicked = false;
          }
        });
        if (isOutsideClicked) {
          callback(event);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
