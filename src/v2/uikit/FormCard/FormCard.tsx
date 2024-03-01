import React, { CSSProperties, ForwardedRef, forwardRef, memo, PropsWithChildren, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { WarningIcon } from 'components/icons';
import useOutsideClick from 'hooks/useOutsideClick';
import { AnyObject } from 'interfaces/base.types';

import Button from '../Button';
import Dialog, { DialogActions } from '../Dialog';

import { FormCardBodyRowWrapper, FormCardBodyWrapper, FormCardHeaderWrapper, FormCardWrapper, WarningDialogContent } from './styles';

type BaseProps = {
  className?: string;
  style?: CSSProperties;
};

type FormCardOutsideClickAction = {
  warn(text?: string): void;
};

export type FormCardProps<T> = BaseProps & {
  defaultConfig?: T;
  children?: ((props: { formCardConfig: T, updateFormCardConfig: (values: Partial<T>) => void }) => React.ReactNode)
  | React.ReactNode;
  onOutsideClick?(actions: FormCardOutsideClickAction): void;
  onReset?(): void;
};

function Card<T extends AnyObject> ({ children, defaultConfig, onOutsideClick, className, onReset, ...rest }: FormCardProps<T>) {
  const { t } = useTranslation();
  const [config, setConfig] = useState<T>(defaultConfig || {} as T);
  const updateConfig = (values: Partial<T>) => void setConfig(prev => ({ ...prev, ...values }));

  // outside click
  const formCardRef = useRef(null);
  const [openWarnDialog, setOpenWarnDialog] = useState<boolean | string>(false);
  const [warnHighlight, setWarnHighlight] = useState(false);

  const warn = useCallback((text: string) => {
    if (!warnHighlight && !config.disabled) {
      setOpenWarnDialog(text || true);
      setWarnHighlight(true);
    }
  }, [config.disabled, warnHighlight]);

  const outsideClickHandler = useCallback(() => {
    onOutsideClick?.({ warn });
  }, [onOutsideClick, warn]);

  useOutsideClick(formCardRef, outsideClickHandler);

  useEffect(() => {
    if (config.disabled) {
      setWarnHighlight(false);
    }
  }, [config.disabled]);

  return (
    <FormCardWrapper ref={formCardRef} className={`${className || ''} ${warnHighlight ? 'warn' : ''}`} {...rest}>
      {typeof children === 'function' && children?.({ formCardConfig: config, updateFormCardConfig: updateConfig })}
      {typeof children !== 'function' && children}
      {!!openWarnDialog && (
        <Dialog
          title={t('unsavedChanges')}
          open={!!openWarnDialog}
          onClose={() => void setOpenWarnDialog(false)}
          onSubmit={() => void setOpenWarnDialog(false)}
          color="#ed6c02"
        >
          <WarningDialogContent>{t('unsavedChangesWarn')}</WarningDialogContent>
          <DialogActions>
            <Button variant="contained" onClick={() => void setOpenWarnDialog(false)}>{t('back')}</Button>
            <Button
              variant="outlined"
              color="warning"
              onClick={() => { setOpenWarnDialog(false); onReset?.(); }}
            >
              <WarningIcon />{t('continue')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </FormCardWrapper>
  );
};
Card.displayName = 'FormCard';
export const FormCard = memo(Card) as typeof Card;

export type FormCardHeaderProps = BaseProps & {
  icon: React.JSX.Element;
  title: string | React.JSX.Element;
  children: ReactNode;
};

export const FormCardHeader = memo(({ icon, title, children, ...rest }: FormCardHeaderProps) => (
  <FormCardHeaderWrapper {...rest}>
    <div className="left">
      <div className="icon">{icon}</div>
      <div className="title">{title}</div>
    </div>
    <div className="right">{children}</div>
  </FormCardHeaderWrapper>
));
FormCardHeader.displayName = 'FormCardHeader';

export type FormCardBodyProps = BaseProps & {
  disabled?: boolean;
};

export const FormCardBody = forwardRef(({ children, disabled, ...rest }: PropsWithChildren<FormCardBodyProps>, ref: ForwardedRef<HTMLDivElement>) => (
  <FormCardBodyWrapper ref={ref} disabled={disabled} {...rest}>{children}</FormCardBodyWrapper>
));
FormCardBody.displayName = 'FormCardBody';

export const FormCardBodyRow = ({ children, ...rest }: PropsWithChildren<BaseProps>) => (
  <FormCardBodyRowWrapper {...rest}>{children}</FormCardBodyRowWrapper>
);
FormCardBodyRow.displayName = 'FormCardBodyRow';
