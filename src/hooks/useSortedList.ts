import { useMemo, useState } from 'react';
import { orderBy } from 'lodash-es';

export declare type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type PathImpl<K extends string | number, V> = V extends Primitive ? `${K}` : `${K}` | `${K}.${Path<V>}`;
type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;

type Path<T> = T extends ReadonlyArray<infer V> ? IsTuple<T> extends true ? {
  [K in TupleKeys<T>]-?: PathImpl<K & string, T[K]>;
}[TupleKeys<T>] : PathImpl<number, V> : {
  [K in keyof T]-?: PathImpl<K & string, T[K]>;
}[keyof T];

type Sort<T> = {
  dir: 'asc' | 'desc';
  sorting: Path<T> | ((v: T) => unknown);
};

export default function useSortedList <T> (data: T[]) {
  const [sort, setSort] = useState<null | Sort<T>>(null);
  const sortedData = useMemo(() => {
    if (!sort) return data;
    return orderBy(data, sort.sorting, sort.dir);
  }, [data, sort]);

  return {
    sorting: sort,
    setSorting: setSort,
    sortedData,
  };
}
