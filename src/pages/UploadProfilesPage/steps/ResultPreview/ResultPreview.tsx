import React from 'react';

import { invert } from 'lodash-es';
import { IUser } from 'interfaces/users.interface';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useRelativeFields, useResult } from '../../UploadProfilesContext';
import { BooleanIcon } from 'components/icons';

const ResultsPreview = () => {
  const [relativeFields] = useRelativeFields();
  const usersResult = useResult();

  return (
    <>
      {usersResult && (
        <ListTable columns={Object.keys(invert(relativeFields)).map((field) => `user.${field}`)} >
          {usersResult?.map((user, index) => (
            <ListTableRow key={index}>
              {(Object.keys(invert(relativeFields)) as (keyof IUser)[]).map((field) =>
                <ListTableCell key={field}>
                  <>
                    {typeof user[field] === 'string' && user[field]}
                    {typeof user[field] === 'boolean' && <BooleanIcon value={user[field] as boolean} />}
                  </>
                </ListTableCell>)}
            </ListTableRow>
          ))}
        </ListTable>
      )}
    </>
  );
};

export default ResultsPreview;
