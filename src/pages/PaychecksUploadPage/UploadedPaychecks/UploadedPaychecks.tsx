import React, { useState } from 'react';
import { useQueryClient } from 'react-query';

import { useDeleteFileMutation } from 'api/mutations/fileMutation';
import { useDeletePaycheckMutation } from 'api/mutations/paycheckMutation';
import downloadFile from 'api/query/downloadFile';
import { useGetPaycheckList } from 'api/query/paycheckQuery';
import { CloseIcon, DownloadFileIcon } from 'components/icons';
import DialogConfirm from 'components/shared/DialogConfirm';
import IconButton from 'components/shared/IconButton';
import ListTable, { ListTableCell, ListTableRow } from 'components/shared/ListTable';
import { IFile } from 'interfaces/file.interface';
import { IPaycheck } from 'interfaces/paycheck.interface';

import { UploadedPaychecksWrapper } from './styles';

const cols = [
  'file.name',
  'file.ext',
  '',
  '',
];

const UploadedPaychecks = () => {
  const { data = [] } = useGetPaycheckList();
  const deletePaycheckMutation = useDeletePaycheckMutation();
  const deleteFileMutation = useDeleteFileMutation();
  const queryClient = useQueryClient();

  const [itemToDelete, setItemToDelete] = useState<IPaycheck | null>(null);

  const deletePaycheck = async () => {
    if (!itemToDelete) return;
    deletePaycheckMutation.mutate(itemToDelete._id);
    deleteFileMutation.mutate((itemToDelete.linkedFile as IFile));
    queryClient.setQueryData('paychecks', data.filter((item) => item._id !== itemToDelete._id));
    setItemToDelete(null);
  };

  return (
    <UploadedPaychecksWrapper>
      <ListTable columns={cols} className="file-grid">
        {data.map((paycheckItem) => (
          <ListTableRow key={paycheckItem._id} className="file-row">
            <ListTableCell>{(paycheckItem.linkedFile as IFile).originalname}</ListTableCell>
            <ListTableCell>{(paycheckItem.linkedFile as IFile).ext}</ListTableCell>
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
            <ListTableCell><IconButton itemType="span" onClick={() => {
              setItemToDelete(paycheckItem);
            } }><CloseIcon /></IconButton></ListTableCell>
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

export default UploadedPaychecks;
