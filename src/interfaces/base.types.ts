export type AnyObject = {[key: string]: any};

export type MongoEntity = IMongoDoc & AnyObject;

type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type PathImpl<K extends string | number, V> = V extends Primitive ? `${K}` : `${K}` | `${K}.${Path<V>}`;
type TupleKeys<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;

export type Path<T> = T extends ReadonlyArray<infer V> ? IsTuple<T> extends true ? {
  [K in TupleKeys<T>]-?: PathImpl<K & string, T[K]>;
}[TupleKeys<T>] : PathImpl<number, V> : {
  [K in keyof T]-?: PathImpl<K & string, T[K]>;
}[keyof T];

export type MongoHistory<T> = {
  updatedBy: {
    _id: string,
    name?: string,
    surname?: string,
  };
  changes: Partial<Record<keyof T, { oldValue: any, newValue: any }>>;
}

export interface IMongoDoc {
  _id: string
  createdAt: string;
  updatedAt: string;
}
