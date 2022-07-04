import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react';
import { pick } from 'lodash-es';
import { DateTime } from 'luxon';

import { AnyObject } from 'interfaces/base.types';
import { IUser } from 'interfaces/users.interface';
import { DEFAULT_PASS } from './constants';

const TRUE_VALUES = ['áno', 'true', 'yes'];
const FALSE_VALUES = ['nie', 'false', 'not', 'no'];
const PERMIT_TYPE_VALUES: AnyObject = {
  business: ['podnikania', 'business'],
  study: ['study', 'štúdia'],
  work: ['work', 'práca'],
};

type contextType = {
  relativeFieldsState: [AnyObject, Dispatch<SetStateAction<AnyObject>>],
  rowsState: [AnyObject[], Dispatch<SetStateAction<AnyObject[]>>],
  fileKeysState: [string[], Dispatch<SetStateAction<string[]>>],
  result: IUser[],
}

const UploadProfilesContext = createContext<contextType | undefined>(undefined);

const UploadProfilesProvider = ({ children }: { children: ReactNode }) => {
  const [relativeFields, setRelativeFields] = useState<AnyObject>({});
  const [rows, setRows] = useState<AnyObject[]>([]);
  const fileKeysState = useState<string[]>([]);

  const result = useMemo(() => rows.map((row) => {
    const pickedRow = pick(row, Object.keys(relativeFields));
    const oldKeys = Object.keys(pickedRow);
    const newRow: AnyObject = {};

    oldKeys.forEach((oldKey) => {
      const userKey = relativeFields[oldKey];

      newRow[userKey] = pickedRow[oldKey];

      if (TRUE_VALUES.includes(pickedRow[oldKey]?.toLowerCase())) {
        newRow[userKey] = true;
      }
      if (FALSE_VALUES.includes(pickedRow[oldKey]?.toLowerCase())) {
        newRow[userKey] = false;
      }
      if (userKey.toLowerCase().includes('size')) {
        newRow[userKey] = pickedRow[oldKey].toUpperCase();
      }
      if (userKey.toLowerCase().includes('date') || userKey.toLowerCase().includes('expire')) {
        newRow[userKey] = DateTime.fromFormat(pickedRow[oldKey], 'd.M.yyyy').toISODate();
      }
      if (userKey === 'permitType') {
        let typeValue = '';
        for (const key in PERMIT_TYPE_VALUES) {
          if (Object.prototype.hasOwnProperty.call(PERMIT_TYPE_VALUES, key)) {
            const type = PERMIT_TYPE_VALUES[key];
            if (type.includes(pickedRow[oldKey].toLowerCase())) {
              typeValue = key;
            }
          }
        }
        newRow[userKey] = typeValue;
      }
    });
    return {
      ...newRow,
      password: DEFAULT_PASS,
      role: 'user',
    } as IUser;
  })
    .filter((userRow) => !!userRow.email), [rows, relativeFields]);

  return (
    <UploadProfilesContext.Provider value={{
      relativeFieldsState: [relativeFields, setRelativeFields],
      rowsState: [rows, setRows],
      result,
      fileKeysState,
    }}>
      {children}
    </UploadProfilesContext.Provider>
  );
};

export default UploadProfilesProvider;

export const useRelativeFields = () => {
  const context = useContext(UploadProfilesContext);
  if (!context) {
    throw new Error('not context');
  }
  return context.relativeFieldsState;
};

export const useRows = () => {
  const context = useContext(UploadProfilesContext);
  if (!context) {
    throw new Error('not context');
  }
  return context.rowsState;
};

export const useResult = () => {
  const context = useContext(UploadProfilesContext);
  if (!context) {
    throw new Error('not context');
  }
  return context.result;
};

export const useFileKeys = () => {
  const context = useContext(UploadProfilesContext);
  if (!context) {
    throw new Error('not context');
  }
  return context.fileKeysState;
};
