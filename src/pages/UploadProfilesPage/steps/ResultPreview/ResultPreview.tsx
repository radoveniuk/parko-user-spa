import React from 'react';
import { invert } from 'lodash-es';

import { BooleanIcon } from 'components/icons';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { isMongoId } from 'helpers/regex';
import { IUser } from 'interfaces/users.interface';

import { useRelativeFields, useResult } from '../../UploadProfilesContext';

const ResultsPreview = () => {
  const [relativeFields] = useRelativeFields();
  const usersResult = useResult();

  return (
    <>
      {usersResult && (
        <ListTable
          columns={Object.keys(invert(relativeFields)).map((field) => isMongoId(field) ? invert(relativeFields)[field] : `user.${field}`)}
        >
          {usersResult?.map((user, index) => (
            <ListTableRow key={index}>
              {(Object.keys(invert(relativeFields)) as (keyof IUser)[]).map((field) => (
                <ListTableCell key={field}>
                  <>
                    {typeof user[field] === 'string' && user[field]}
                    {typeof user[field] === 'boolean' && <BooleanIcon value={user[field] as boolean} />}
                  </>
                </ListTableCell>
              ),
              )}
            </ListTableRow>
          ))}
        </ListTable>
      )}
    </>
  );
};

export default ResultsPreview;
