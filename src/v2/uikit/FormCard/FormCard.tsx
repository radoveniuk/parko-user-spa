import React, { CSSProperties, memo, PropsWithChildren, ReactNode, useState } from 'react';

import { FormCardBodyRowWrapper, FormCardBodyWrapper, FormCardHeaderWrapper, FormCardWrapper } from './styles';

type FormCardConfig = Record<string, string | number | boolean>;

type BaseProps = {
  className?: string;
  style?: CSSProperties;
};

export type FormCardProps = BaseProps & {
  defaultConfig?: FormCardConfig;
  children?: (props: { formCardConfig: FormCardConfig, updateFormCardConfig: (values: FormCardConfig) => void }) => React.ReactNode;
};

export const FormCard = memo(({ children, defaultConfig = {}, ...rest }: FormCardProps) => {
  const [config, setConfig] = useState<FormCardConfig>(defaultConfig);
  const updateConfig = (values: FormCardConfig) => void setConfig(prev => ({ ...prev, ...values }));
  return (
    <FormCardWrapper {...rest}>
      {children?.({ formCardConfig: config, updateFormCardConfig: updateConfig })}
    </FormCardWrapper>
  );
});
FormCard.displayName = 'FormCard';

export type FormCardHeaderProps = BaseProps & {
  icon: React.JSX.Element;
  title: string;
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

export const FormCardBody = ({ children, disabled, ...rest }: PropsWithChildren<FormCardBodyProps>) => (
  <FormCardBodyWrapper disabled={disabled} {...rest}>{children}</FormCardBodyWrapper>
);
FormCardBody.displayName = 'FormCardBody';

export const FormCardBodyRow = ({ children, ...rest }: PropsWithChildren<BaseProps>) => (
  <FormCardBodyRowWrapper {...rest}>{children}</FormCardBodyRowWrapper>
);
FormCardBodyRow.displayName = 'FormCardBodyRow';
