import React, { ChangeEvent, useState } from 'react';
import _, { omit } from 'lodash-es';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';

import Accordion from 'components/shared/Accordion';
import Button from 'components/shared/Button';
import Input from 'components/shared/Input';
import { IUser } from 'interfaces/users.interface';
import Checkbox from 'components/shared/Checkbox';
import DatePicker from 'components/shared/DatePicker';
import { useAuthData } from 'contexts/AuthContext';
import { useGetUser } from 'api/query/userQuery';
import { useCreateUserMutation, useUpdateUserMutation } from 'api/mutations/userMutation';
import Select from 'components/shared/Select';
import { useGetCountries } from 'api/query/formFieldsQuery';
import { FAMILY_STATUSES, PERMIT_TYPES, SIZES, STUDY } from 'constants/selectsOptions';
import useTranslatedSelect from 'hooks/useTranslatedSelect';
import FileInput from 'components/shared/FileInput';
import { uploadFiles } from 'api/common';
import { AcceptIcon, DeleteIcon, UploadIcon } from 'components/icons';
import PhoneInput, { checkPhoneNumber } from 'components/shared/PhoneInput';
import { IFile } from 'interfaces/file.interface';
import { useDeleteFileMutation } from 'api/mutations/fileMutation';
import IconButton from 'components/shared/IconButton';
import DialogConfirm from 'components/shared/DialogConfirm';
import downloadFile from 'api/query/downloadFile';

import { FIELDS, ADMIN_FIELDS, FieldSection, UserField } from './fields';
import DialogForm from './DialogForm';

import { ProfileInfoFormWrapper } from './styles';

const ProfileInfoForm = () => {
  const isEditor = window.location.href.includes('editor');
  const { id: editingUserId = '' } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, control, setValue } = useForm<IUser>();
  const { t } = useTranslation();
  const { id, role } = useAuthData();
  const { data: userData } = useGetUser(!isEditor ? id : editingUserId, { enabled: !isEditor || !!editingUserId, refetchOnWindowFocus: false });
  const { data: countriesOptions } = useGetCountries();
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteFileMutation = useDeleteFileMutation();

  const { enqueueSnackbar } = useSnackbar();
  const familyStateOptions = useTranslatedSelect(FAMILY_STATUSES, 'familyStatus');
  const studyOptions = useTranslatedSelect(STUDY, 'study');
  const permitTypeOptions = useTranslatedSelect(PERMIT_TYPES, 'permitType');

  // eslint-disable-next-line no-unused-vars
  const [filesStorage, setFilesStorage] = useState<{[key in keyof Partial<IUser>]: File}>({});
  const [fileToDelete, setFileToDelete] = useState<{ name: keyof Partial<IUser>; data?: IFile; fieldChange(v: any): void } | null>(null);

  const uploadScans = async () => {
    const formData = new window.FormData();

    Object.keys(filesStorage).forEach((key) => {
      const file = filesStorage[key as keyof IUser];
      if (file) {
        const ext = file.name.split('.')[file.name.split('.').length - 1];
        formData.append('files', file, `${key}.${ext}`);
      }
    });

    if (formData.get('files')) {
      const uploadedFilesData = await uploadFiles(formData);
      uploadedFilesData.forEach((file) => {
        const fieldName = file.originalname as 'internationalPassScan' | 'passScan' | 'idCardFaceScan' |
        'idCardBackScan' | 'permitFaceScan' | 'permitBackScan';
        setValue(fieldName, file._id);
      });
    }
  };

  const onSubmit: SubmitHandler<IUser> = async (data) => {
    const updatedUserData = { ...userData, ...data };
    if (!updatedUserData.password) {
      delete updatedUserData.password;
    }

    (Object.keys(data) as (keyof IUser)[])
      .forEach((key) => {
        if (key.includes('Scan') && typeof updatedUserData[key] !== 'string') {
          delete updatedUserData[key];
        }
      });

    if (!isEditor || editingUserId) {
      updateUserMutation.mutateAsync({ ...updatedUserData })
        .then(() => {
          enqueueSnackbar(t('user.dataUpdated'), { variant: 'success' });
          navigate(-1);
        });
    } else {
      createUserMutation.mutateAsync({ ...updatedUserData, role: 'user' })
        .then(() => {
          enqueueSnackbar(t('user.dataUpdated'), { variant: 'success' });
          navigate(-1);
        });
    }
  };

  const deleteFile = () => {
    if (!fileToDelete) return null;

    if (fileToDelete.data) {
      deleteFileMutation.mutateAsync(fileToDelete.data).then(() => {
        updateUserMutation.mutate({ _id: !isEditor ? id : editingUserId, [fileToDelete.name]: null });
        fileToDelete.fieldChange(null);
        setFileToDelete(null);
      });
    } else {
      setFilesStorage((prev) => omit(prev, fileToDelete.name));
      fileToDelete.fieldChange(null);
      setFileToDelete(null);
    }
  };

  const generateField = (fieldName: keyof IUser, fieldData: UserField | undefined) => {
    const selectOptions: any = {
      pantsSize: SIZES,
      tshortSize: SIZES,
      permitType: permitTypeOptions,
      country: countriesOptions,
      familyState: familyStateOptions,
      study: studyOptions,
    };

    return (!_.isUndefined(userData) || isEditor) && (_.isUndefined(fieldData?.visible) || fieldData?.visible?.(watch)) && (
      <div className="field-wrap">
        {(fieldData?.type === 'string' || fieldData?.type === 'number') && (
          <Input
            type={fieldData.type}
            label={t(`user.${fieldName}`)}
            defaultValue={userData?.[fieldName] || ''}
            error={!!errors[fieldName]}
            helperText={errors?.[fieldName] && (errors?.[fieldName] as any).message}
            {...register(fieldName, {
              required: fieldData.required,
              validate: fieldData.validation,
            })}
          />
        )}
        {fieldData?.type === 'phone' && (
          <Controller
            control={control}
            name={fieldName}
            defaultValue={userData?.[fieldName] || ''}
            rules={{ validate: (value) => !value || checkPhoneNumber(value as string), required: fieldData.required }}
            render={({ field }) => (
              <PhoneInput
                value={field.value as string}
                onChange={field.onChange}
                label={t('project.phone')}
                error={!!errors.phone}
              />
            )}
          />
        )}
        {fieldData?.type === 'boolean' && (
          <Checkbox
            defaultChecked={!!userData?.[fieldName] || false}
            title={t(`user.${fieldName}`)}
            {...register(fieldName)}
          />
        )}
        {fieldData?.type === 'date' && (
          <Controller
            control={control}
            name={fieldName}
            defaultValue={userData?.[fieldName] || ''}
            render={({ field }) => (
              <DatePicker
                value={field.value as string}
                onChange={field.onChange}
                label={t(`user.${fieldName}`)}
              />
            )}
          />
        )}
        {(fieldData?.type === 'select' && selectOptions[fieldName]) && (
          <Select
            options={selectOptions[fieldName] || []}
            defaultValue={userData?.[fieldName] || ''}
            label={t(`user.${fieldName}`)}
            style={{ minWidth: 200 }}
            error={!!errors[fieldName]}
            {...register(fieldName, {
              required: fieldData.required,
            })}
          />
        )}
        {fieldData?.type === 'file' && (
          <Controller
            control={control}
            name={fieldName}
            defaultValue={userData?.[fieldName] || undefined}
            render={({ field }) => (
              <div>
                <FileInput
                  id={fieldName}
                  label={t(`user.${fieldName}`)}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setFilesStorage((prev) => ({ ...prev, [fieldName]: e.target.files?.[0] as File }));
                    field.onChange(null);
                  }}
                >
                  {(() => {
                    const isFileUploaded = !!filesStorage[fieldName] || !!field.value;
                    return (
                      <>
                        {isFileUploaded && <><AcceptIcon />&nbsp;{ t('user.uploaded')}</>}
                        {!isFileUploaded && <><UploadIcon />&nbsp;{t('user.upload')}</>}
                      </>
                    );
                  })()}
                </FileInput>
                <div className="file-actions">
                  {!!filesStorage[fieldName] && (
                    <>
                      <span>{filesStorage[fieldName]?.name}</span>
                      <IconButton
                        onClick={() => {
                          setFileToDelete({ name: fieldName, fieldChange: field.onChange });
                        }}
                      >
                        <DeleteIcon size={15} />
                      </IconButton>
                    </>
                  )}
                  {!filesStorage[fieldName] && !!field.value && (
                    <>
                      <span
                        className="download-file-link"
                        onClick={() => void downloadFile((field.value as IFile)._id, t(`user.${fieldName}`), (field.value as IFile).ext || 'pdf')}
                      >
                        {`${t(`user.${(field.value as IFile).originalname}`)}.${(field.value as IFile).ext}`}
                      </span>
                      <IconButton
                        onClick={() => {
                          setFileToDelete({ name: fieldName, data: field.value as IFile, fieldChange: field.onChange });
                        }}
                      >
                        <DeleteIcon size={15} />
                      </IconButton>
                    </>
                  )}
                </div>
              </div>
            )}
          />
        )}
        {fieldData?.type === 'form' && (
          <DialogForm
            label={t(`user.${fieldName}`)}
            onChange={(value) => void setValue(fieldName, value)}
            defaultValueJson={userData?.[fieldName] as string}
          />
        )}
      </div>
    );
  };

  if (isEditor && editingUserId && !userData) return null;

  const fields = (!isEditor && role === 'admin') ? ADMIN_FIELDS : FIELDS;

  return (
    <ProfileInfoFormWrapper>
      {(Object.keys(fields) as FieldSection[]).map((fieldSectionKey, index) => (
        <div key={fieldSectionKey}>
          {Object.keys(fields[fieldSectionKey]).some((fieldKey) => {
            const field = fields[fieldSectionKey][fieldKey as keyof IUser];
            const visible = !field?.visible || field?.visible?.(watch);
            return visible;
          }) && (
            <Accordion
              title={t(`user.${fieldSectionKey}`)}
              id={fieldSectionKey}
              className="accordion"
              defaultExpanded={index === 0}
            >
              <div className="accordion-content">
                {(Object.keys(fields[fieldSectionKey]) as (keyof IUser)[]).map((key) => (
                  <div key={key}>
                    {generateField(key, fields[fieldSectionKey][key])}
                  </div>
                ))}
              </div>
            </Accordion>
          )}
        </div>
      ))}
      {!_.isEmpty(errors) && (
        <div className="form-errors">
          <p>{t('errors')}</p>
          <ul>
            {Object.keys(errors).map((item) => <li key={item}>{t(`user.${item}`)}</li>)}
          </ul>
        </div>
      )}
      <div className="form-actions">
        <Button
          onClick={() => {
            uploadScans().then(() => {
              handleSubmit(onSubmit)();
            });
          }}
          disabled={!_.isEmpty(errors)}
        >
          {t('user.updateData')}
        </Button>
      </div>
      {!!fileToDelete && (
        <DialogConfirm
          open={!!fileToDelete}
          onSubmit={deleteFile}
          onClose={() => void setFileToDelete(null) }
        />
      )}
    </ProfileInfoFormWrapper>
  );
};

export default ProfileInfoForm;
