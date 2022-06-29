import React, { createContext, Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react';
import { AnyObject } from 'interfaces/base.types';
import { IUser } from 'interfaces/users.interface';
import { pick } from 'lodash-es';

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

  const result = useMemo(() => rows
    .map((row) => {
      const pickedRow = pick(row, Object.keys(relativeFields));
      const oldKeys = Object.keys(pickedRow);
      const newRow: AnyObject = {};
      oldKeys.forEach((oldKey) => {
        newRow[relativeFields[oldKey]] = pickedRow[oldKey];
      });
      return newRow;
    }) as IUser[], [rows, relativeFields]);

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
