import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import isEqual from 'lodash-es/isEqual';

type Dispatcher<T> = (v: T) => T[];

// eslint-disable-next-line max-len
export type UseListStateType<T> = [T[], { add: (v: T, direction?: 'start' | 'end') => T[], remove: Dispatcher<T>, update: (old: T, v: T) => T[], toggle: Dispatcher<T> }, Dispatch<SetStateAction<T[]>>]

const useListState = <T>(initialValue?: T[]): UseListStateType<T> => {
  const [value, setValue] = useState<T[]>(initialValue || []);

  const addItem = useCallback((v: T, direction: 'start' | 'end' = 'end') => {
    const newValue = direction === 'end' ? [...value, v] : [v, ...value];
    setValue(newValue);
    return newValue;
  }, [value]);

  const removeItem = (v: T) => {
    const newValue = value.filter((item) => !isEqual(item, v));
    setValue(newValue);
    return newValue;
  };

  const updateItem = (old: T, v: T) => {
    const newValue = value.map((item) => {
      if (isEqual(item, old)) {
        return v;
      }
      return item;
    });
    setValue(newValue);
    return newValue;
  };

  const toggleItem = (v: T) => {
    const newValue = !value.some((item) => isEqual(item, v)) ? [...value, v] : value.filter((item) => !isEqual(item, v));
    setValue(newValue);
    return newValue;
  };

  return [value, { add: addItem, remove: removeItem, update: updateItem, toggle: toggleItem }, setValue];
};

export default useListState;
