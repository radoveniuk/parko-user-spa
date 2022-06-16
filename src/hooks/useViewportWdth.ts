import { useCallback, useEffect, useState } from 'react';

const useViewportWdth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  const setSize = useCallback(() => {
    setWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', setSize, { passive: true });
    window.addEventListener('orientationchange', setSize, { passive: true });

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('orientationchange', setSize);
    };
  }, [setSize]);

  return width;
};

export default useViewportWdth;
