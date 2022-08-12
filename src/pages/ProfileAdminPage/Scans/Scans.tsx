import React from 'react';
import { useTranslation } from 'react-i18next';

import { IUser } from 'interfaces/users.interface';
import { IFile } from 'interfaces/file.interface';
import { File, Files } from 'components/shared/FileList';

import { ScansWrapper } from './styles';

type Props = {
  data: IUser;
};

const Scans = ({ data }: Props) => {
  const { t } = useTranslation();
  const scanKeys = Object.keys(data).filter((key) => key.includes('Scan')) as (keyof IUser)[];
  return (
    <ScansWrapper>
      <Files>
        {scanKeys
          .filter((scanKey) => data[scanKey])
          .map((skanKey) => {
            const fileData = data[skanKey] as IFile;
            return (
              <File key={skanKey} name={t(`user.${skanKey}`)} fileId={fileData._id} ext={fileData.ext} />
            );
          })}
      </Files>
    </ScansWrapper>
  );
};

export default Scans;
