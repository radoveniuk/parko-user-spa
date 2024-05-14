import { useCallback, useState } from 'react';

const useBoolean = (defaultValue: boolean) => {
  const [state, setState] = useState(defaultValue);
  const setTrue = useCallback(() => { setState(true); }, []);
  const setFalse = useCallback(() => { setState(false); }, []);
  const toggle = useCallback(() => { setState(prev => !prev); }, []);

  return [state, setTrue, setFalse, toggle] as const;
};

export default useBoolean;
