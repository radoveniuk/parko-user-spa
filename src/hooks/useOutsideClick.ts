import { MutableRefObject, useEffect } from 'react';

interface ElementPosition {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

const getElementPosition = (element: HTMLElement): ElementPosition => {
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    bottom: rect.bottom + window.scrollY,
    right: rect.right + window.scrollX,
  };
};

const checkOverlappingElement = (elementA: ElementPosition, elementB: ElementPosition): boolean => (
  elementA.bottom >= elementB.top &&
      elementA.top <= elementB.bottom &&
      elementA.right >= elementB.left &&
      elementA.left <= elementB.right
);

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
      const isElementOverlapping = (backgroundElement: HTMLElement) => {
        const clickedElement = event.target as HTMLElement;
        const clickedElementPosition = getElementPosition(clickedElement);
        const backgroundElementPosition = getElementPosition(backgroundElement);
        return checkOverlappingElement(clickedElementPosition, backgroundElementPosition);
      };

      if (!Array.isArray(ref) && ref.current && !ref.current.contains(event.target as Node)) {
        if (hasPresentationParent(event.target as HTMLElement) && isElementOverlapping(ref.current)) {
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
