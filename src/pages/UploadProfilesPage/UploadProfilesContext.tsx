import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react';
import { pick } from 'lodash-es';
import { DateTime } from 'luxon';

import { AnyObject } from 'interfaces/base.types';
import { IUser } from 'interfaces/users.interface';

const TRUE_VALUES = ['áno', 'true', 'yes'];
const FALSE_VALUES = ['nie', 'false', 'not', 'no'];

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
      newRow[relativeFields[oldKey]] = pickedRow[oldKey];

      if (TRUE_VALUES.includes(pickedRow[oldKey]?.toLowerCase())) {
        newRow[relativeFields[oldKey]] = true;
      }
      if (FALSE_VALUES.includes(pickedRow[oldKey]?.toLowerCase())) {
        newRow[relativeFields[oldKey]] = false;
      }
      if (relativeFields[oldKey].toLowerCase().includes('size')) {
        newRow[relativeFields[oldKey]] = pickedRow[oldKey].toUpperCase();
      }
      if (relativeFields[oldKey].toLowerCase().includes('date') || relativeFields[oldKey].toLowerCase().includes('expire')) {
        newRow[relativeFields[oldKey]] = DateTime.fromFormat(pickedRow[oldKey], 'd.M.yyyy').toISODate();
      }
    });
    return {
      ...newRow,
      password: 'ParkoUser_2022',
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
