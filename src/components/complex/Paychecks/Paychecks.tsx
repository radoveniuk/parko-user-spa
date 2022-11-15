import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { uploadFiles } from 'api/common';
import { useDeleteFileMutation } from 'api/mutations/fileMutation';
import { useDeletePaycheckMutation, useUpdatePaycheckMutation } from 'api/mutations/paycheckMutation';
import downloadFile from 'api/query/downloadFile';
import { useGetPaycheckList } from 'api/query/paycheckQuery';
import { CloseIcon, DownloadFileIcon, EditIcon } from 'components/icons';
import DialogConfirm from 'components/shared/DialogConfirm';
import FileInput from 'components/shared/FileInput';
import IconButton from 'components/shared/IconButton';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IFile } from 'interfaces/file.interface';
import { IPaycheck } from 'interfaces/paycheck.interface';
import { IUser } from 'interfaces/users.interface';

import { EmptyDataWrapper, UploadedPaychecksWrapper } from './styles';

const ADMIN_COLS = [
  'paycheck.date',
  'paycheck.user',
  'file.name',
  '',
  '',
  '',
];

const USER_COLS = [
  'paycheck.date',
  'file.name',
  '',
];

type Props = {
  filter?: Partial<IPaycheck>
}

const Paychecks = ({ filter }: Props) => {
  const { t } = useTranslation();
  const { data = [], refetch } = useGetPaycheckList(filter);
  const updatePaycheckMutation = useUpdatePaycheckMutation();
  const deletePaycheckMutation = useDeletePaycheckMutation();
  const deleteFileMutation = useDeleteFileMutation();
  const { role } = useAuthData();

  const [itemToDelete, setItemToDelete] = useState<IPaycheck | null>(null);

  if (!data.length) {
    return (
      <EmptyDataWrapper>
        {t('noData')}
      </EmptyDataWrapper>
    );
  };

  const deletePaycheck = async () => {
    if (!itemToDelete) return;
    await Promise.all([
      deletePaycheckMutation.mutateAsync(itemToDelete._id),
      deleteFileMutation.mutateAsync((itemToDelete.linkedFile as IFile)),
    ]).then(() => {
      setItemToDelete(null);
      refetch();
    });
  };

  const updatePaycheck = async (file: File, paycheckItem: IPaycheck) => {
    const formData = new window.FormData();

    formData.append('files', file);
    deleteFileMutation.mutate((paycheckItem.linkedFile as IFile));

    const [uploadedFileData] = await uploadFiles(formData);
    await updatePaycheckMutation.mutateAsync({ _id: paycheckItem._id, linkedFile: uploadedFileData._id });
    refetch();
  };

  const cols = ['admin', 'recruiter'].includes(role as string)
    ? (!filter?.user ? ADMIN_COLS : ADMIN_COLS.filter((item) => item !== 'paycheck.user'))
    : USER_COLS;

  return (
    <UploadedPaychecksWrapper>
      <ListTable columns={cols} className="file-grid">
        {data.map((paycheckItem) => (
          <ListTableRow key={paycheckItem._id} className="file-row">
            <ListTableCell>{getDateFromIso(paycheckItem.date, 'MM.yyyy')}</ListTableCell>
            {!filter?.user && <ListTableCell>{(paycheckItem.user as IUser).name} {(paycheckItem.user as IUser).surname}</ListTableCell>}
            <ListTableCell>{(paycheckItem.linkedFile as IFile).originalname}</ListTableCell>
            <ListTableCell>
              <IconButton
                onClick={() => {
                  const file = paycheckItem.linkedFile as IFile;
                  downloadFile(file._id, file.originalname, 'pdf');
                }}
              >
                <DownloadFileIcon />
              </IconButton>
            </ListTableCell>
            {['admin', 'recruiter'].includes(role as string) && (
              <>
                <ListTableCell>
                  <FileInput
                    id={paycheckItem._id}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => { updatePaycheck(e.target.files?.[0] as File, paycheckItem); }}
                    buttonComponent={(
                      <div className="file-input">
                        <IconButton><EditIcon /></IconButton>
                      </div>
                    )}
                    accept="application/pdf"
                  />
                </ListTableCell>
                <ListTableCell>
                  <IconButton
                    onClick={() => {
                      setItemToDelete(paycheckItem);
                    }}>
                    <CloseIcon />
                  </IconButton>
                </ListTableCell>
              </>
            )}
          </ListTableRow>
        ))}
      </ListTable>
      <DialogConfirm
        open={!!itemToDelete}
        onSubmit={() => void deletePaycheck()}
        onClose={() => void setItemToDelete(null) }
      />
    </UploadedPaychecksWrapper>
  );
};

export default Paychecks;
