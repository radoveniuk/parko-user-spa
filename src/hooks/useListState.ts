import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import isEqual from 'lodash-es/isEqual';

type Dispatcher<T> = (v: T) => void;

// eslint-disable-next-line max-len
const useListState = <T>(initialValue?: T[]): [T[], { add: Dispatcher<T>, remove: Dispatcher<T>, update: (old: T, v: T) => void }, Dispatch<SetStateAction<T[]>>] => {
  const [value, setValue] = useState<T[]>(initialValue || []);

  const addItem = useCallback((v: T) => {
    setValue((prev) => [...prev, v]);
  }, []);

  const removeItem = (v: T) => {
    setValue((prev) => prev.filter((item) => !isEqual(item, v)));
  };

  const updateItem = (old: T, v: T) => {
    setValue((prev) => prev.map((item) => {
      if (isEqual(item, old)) {
        return v;
      }
      return item;
    }));
  };

  return [value, { add: addItem, remove: removeItem, update: updateItem }, setValue];
};

export default useListState;
