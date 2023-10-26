import { useMemo, useRef } from 'react';

const WHITE = 'rgb(255, 255, 255)';
const GRAY = 'rgb(240, 240, 240)';

const useFormFieldBackground = () => {
  const ref = useRef<HTMLLabelElement>(null);
  const backgroundColor = (() => {
    if (!ref.current || !ref.current.parentElement) return WHITE;
    const computedStyle = getComputedStyle(ref.current.parentElement);
    if (computedStyle.backgroundColor === WHITE) {
      return GRAY;
    }
  })();
  return { backgroundColor, ref };
};

export default useFormFieldBackground;
