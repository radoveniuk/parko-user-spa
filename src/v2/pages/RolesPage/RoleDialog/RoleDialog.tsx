import React, { memo } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import isEmpty from 'lodash-es/isEmpty';
import In from 'v2/components/In';
import { Checkbox } from 'v2/uikit';
import Button from 'v2/uikit/Button';
import Dialog, { DialogActions, DialogProps } from 'v2/uikit/Dialog';
import Input from 'v2/uikit/Input';

import { IRole } from 'interfaces/role.interface';

import useRoleActions from '../hooks/useRoleActions';

import permissions from './permissions.json';
import { DialogContentWrapper, PermissionSection } from './styles';

type Props = DialogProps & {
  defaultData: IRole | true;
};

const RoleDialog = ({ defaultData, onClose, ...rest }: Props) => {
  const { t } = useTranslation();
  const {
    register, formState: { errors }, handleSubmit, control,
  } = useForm<IRole>({ defaultValues: typeof defaultData !== 'boolean' ? defaultData : {} });

  const { create, update } = useRoleActions();

  const submitHandler: SubmitHandler<IRole> = (values) => {
    defaultData === true ? create(values) : update(values);
    onClose();
  };

  return (
    <Dialog
      onClose={onClose}
      mobileFullscreen
      {...rest}
    >
      <DialogContentWrapper>
        <div className="form">
          <Input
            label={t('roles.name')}
            theme="gray"
            className="fullwidth"
            error={!!errors.name}
            {...register('name', { required: true })}
          />
          <Controller
            control={control}
            name="permissions"
            defaultValue={[]}
            rules={{ validate: v => !!v.length }}
            render={({ field }) => (
              <div className="fullwidth permissions">
                <In
                  data={permissions}
                  render={(sectionName, sectionPermissions) => (
                    <PermissionSection key={sectionName}>
                      <Checkbox
                        className="select-all"
                        label={t(`roles.${sectionName}`)}
                        checked={permissions[sectionName].every(p => field.value.includes(p))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...new Set([...field.value, ...sectionPermissions])]);
                          } else {
                            field.onChange(field.value.filter(p => !sectionPermissions.includes(p)));
                          }
                        }}
                      />
                      {sectionPermissions.map((permission: string) => (
                        <Checkbox
                          key={permission}
                          label={t(`roles:permissionList:${permission}`.replaceAll(':', '.'))}
                          checked={field.value.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, permission]);
                            } else {
                              field.onChange(field.value.filter(p => p !== permission));
                            }
                          }}
                        />
                      ))}
                    </PermissionSection>
                  )}
                />
              </div>
            )}
          />
        </div>
      </DialogContentWrapper>
      <DialogActions>
        <Button
          onClick={handleSubmit(submitHandler)}
          disabled={!isEmpty(errors)}
          variant="contained"
        >
          {t('approve')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(RoleDialog);
