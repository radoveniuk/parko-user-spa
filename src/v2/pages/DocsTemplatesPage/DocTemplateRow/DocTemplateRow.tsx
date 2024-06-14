import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Menu, MenuItem } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';

import { useDeleteDocsTemplate } from 'api/mutations/docsTemplateMutation';
import { useDeleteFileMutation } from 'api/mutations/fileMutation';
import downloadFile from 'api/query/downloadFile';
import { DeleteIcon, DownloadFileIcon, EditIcon, ThreeDotsIcon } from 'components/icons';
import { ListTableCell } from 'components/shared/ListTable';
import { useAuthData } from 'contexts/AuthContext';
import { getDateFromIso } from 'helpers/datetime';
import { IDocsTemplate } from 'interfaces/docsTemplate.interface';
import { IDocsTemplateCategory } from 'interfaces/docsTemplateCategory.interface';
import { IFile } from 'interfaces/file.interface';

import { TemplateDialog } from '../dialogs';

import { StyledListTableRow } from './styles';

type RowProps = {
  data: IDocsTemplate;
}

const DocTemplateRow = ({ data }: RowProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const queryKey = ['docsTemplates', JSON.stringify({})];

  const deleteTemplateMutation = useDeleteDocsTemplate();
  const deleteFileMutation = useDeleteFileMutation();

  const file = data.file as IFile;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { permissions } = useAuthData();

  return (
    <StyledListTableRow>
      <ListTableCell>
        {data.name}
      </ListTableCell>
      <ListTableCell>
        {file.originalname}.{file.ext}
      </ListTableCell>
      <ListTableCell>
        {(data.category as IDocsTemplateCategory)?.name}
      </ListTableCell>
      <ListTableCell>
        {getDateFromIso(data.createdAt, 'dd.MM.yyyy HH:mm')}
      </ListTableCell>
      <ListTableCell>
        {data.createdBy?.fullname}
      </ListTableCell>
      <ListTableCell>
        {data.updatedBy?.fullname}
      </ListTableCell>
      <ListTableCell align="right">
        <Menu
          isCloseOnMenu
          menuComponent={(
            <IconButton className="menu-btn"><ThreeDotsIcon /></IconButton>
          )}
        >
          <MenuItem
            onClick={() => void downloadFile(file._id, file.originalname, file.ext, 'save')}
          >
            <DownloadFileIcon />{t('download')}
          </MenuItem>
          {permissions.includes('docsTemplates:update') && (
            <MenuItem onClick={() => void setOpenDialog(true)}>
              <EditIcon />{t('edit')}
            </MenuItem>
          )}
          {permissions.includes('docsTemplates:delete') && (
            <MenuItem onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon />{t('delete')}</MenuItem>
          )}
        </Menu>
      </ListTableCell>
      {!!openDialog && (
        <TemplateDialog
          title={data.name}
          open={openDialog}
          defaultData={data}
          onClose={() => void setOpenDialog(false)}
        />
      )}
      {!!openDeleteDialog && (
        <DialogConfirm
          open={openDeleteDialog}
          onClose={() => void setOpenDeleteDialog(false)}
          onSubmit={() => {
            const prevData = queryClient.getQueryData(queryKey) as IDocsTemplate[];
            queryClient.setQueryData(
              queryKey,
              prevData.filter(item => item._id !== data._id),
            );
            Promise.all([
              deleteTemplateMutation.mutateAsync(data._id as string),
              deleteFileMutation.mutateAsync(file, { onSuccess: undefined }),
            ]).then(() => {
              setOpenDeleteDialog(false);
            });
          }}
        />
      )}
    </StyledListTableRow>
  );
};
export default DocTemplateRow;
