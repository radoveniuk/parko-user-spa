import React, { Fragment, memo, ReactNode } from 'react';

import { AnyObject } from 'interfaces/base.types';

type Props<T> = {
  data: T;
  render(key: keyof T, value: any): ReactNode;
};

function In<T> ({ data, render }: Props<T>) {
  return (
    <>
      {Object.keys(data as AnyObject).map((k) => {
        const key = k as keyof T;
        return (
          <Fragment key={key.toString()}>
            {render(key, data[key])}
          </Fragment>
        );
      })}
    </>
  );
};

export default memo(In) as typeof In;
