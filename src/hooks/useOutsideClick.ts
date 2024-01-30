import { MutableRefObject, useEffect } from 'react';

function hasPresentationParent (element: HTMLElement | null): boolean {
  if (!element || element.tagName === 'HTML') {
    return false;
  }

  if (element.role === 'presentation') {
    return true;
  }
  return hasPresentationParent(element.parentElement);
}

export default function useOutsideClick (
  ref: MutableRefObject<HTMLUnknownElement | null> | MutableRefObject<HTMLUnknownElement | null>[], callback: (e?: any) => void) {
  useEffect(() => {
    function handleClickOutside (event: MouseEvent) {
      if (!Array.isArray(ref) && ref.current && !ref.current.contains(event.target as Node)) {
        if (hasPresentationParent(event.target as HTMLElement)) {
          return;
        }
        callback(event);
      }
      if (Array.isArray(ref)) {
        let isOutsideClicked = true;
        ref.forEach((refItem) => {
          if (refItem.current && refItem.current.contains(event.target as Node)) {
            isOutsideClicked = false;
          }
          if (hasPresentationParent(event.target as HTMLElement)) {
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
  }, [callback, ref]);
}
