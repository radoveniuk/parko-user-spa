import React, { CSSProperties, memo, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import { Avatar, Menu, MenuItem } from 'v2/uikit';
import DialogConfirm from 'v2/uikit/DialogConfirm';
import IconButton from 'v2/uikit/IconButton';
import StatusLabel from 'v2/uikit/StatusLabel';

import { useDeleteDocsTemplate } from 'api/mutations/docsTemplateMutation';
import { useDeleteFileMutation } from 'api/mutations/fileMutation';
import downloadFile from 'api/query/downloadFile';
import { DayoffIcon, DeleteIcon, DownloadFileIcon, EditIcon, WordFileIcon } from 'components/icons';
import { getDateFromIso } from 'helpers/datetime';
import { IClient } from 'interfaces/client.interface';
import { IDayOff } from 'interfaces/dayoff.interface';
import { IDocsTemplate } from 'interfaces/docsTemplate.interface';
import { IFile } from 'interfaces/file.interface';
import { IProject } from 'interfaces/project.interface';
import { IUser } from 'interfaces/users.interface';
import { themeConfig } from 'theme';

import { TemplateDialog } from '../dialogs';

import { MobileCardWrapper } from './styles';

type Props = {
  data: IDocsTemplate;
};

const MobilePrepaymentCard = ({ data }: Props) => {
  const { t } = useTranslation();

  const deleteTemplateMutation = useDeleteDocsTemplate();
  const deleteFileMutation = useDeleteFileMutation();

  const file = data.file as IFile;

  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <>
      <Menu
        isCloseOnMenu
        menuComponent={(
          <MobileCardWrapper>
            <WordFileIcon size={80} color={themeConfig.palette.primary.light} />
            <div className="name">{data.name}</div>
            <div className="date">{getDateFromIso(data.createdAt)}</div>
          </MobileCardWrapper>
        )}
      >
        <MenuItem
          onClick={() => void downloadFile(file._id, file.originalname, file.ext, 'save')}
        >
          <DownloadFileIcon style={{ marginRight: 5 }} />{t('download')}
        </MenuItem>
        <MenuItem onClick={() => void setOpenDialog(true)}>
          <EditIcon style={{ marginRight: 5 }} />{t('edit')}
        </MenuItem>
        <MenuItem onClick={() => void setOpenDeleteDialog(true)}><DeleteIcon style={{ marginRight: 5 }} />{t('delete')}</MenuItem>
      </Menu>
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
            Promise.all([
              deleteTemplateMutation.mutateAsync(data._id as string),
              deleteFileMutation.mutateAsync(file),
            ]).then(() => {
              setOpenDeleteDialog(false);
            });
          }}
        />
      )}
    </>
  );
};

export default memo(MobilePrepaymentCard);
