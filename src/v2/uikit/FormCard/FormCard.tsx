import React, { CSSProperties, ForwardedRef, forwardRef, memo, PropsWithChildren, ReactNode, useState } from 'react';

import { FormCardBodyRowWrapper, FormCardBodyWrapper, FormCardHeaderWrapper, FormCardWrapper } from './styles';

type BaseProps = {
  className?: string;
  style?: CSSProperties;
};

export type FormCardProps<T> = BaseProps & {
  defaultConfig?: T;
  children?: ((props: { formCardConfig: T, updateFormCardConfig: (values: Partial<T>) => void }) => React.ReactNode)
  | React.ReactNode;
};

function Card<T> ({ children, defaultConfig, ...rest }: FormCardProps<T>) {
  const [config, setConfig] = useState<T>(defaultConfig || {} as T);
  const updateConfig = (values: Partial<T>) => void setConfig(prev => ({ ...prev, ...values }));
  return (
    <FormCardWrapper {...rest}>
      {typeof children === 'function' && children?.({ formCardConfig: config, updateFormCardConfig: updateConfig })}
      {typeof children !== 'function' && children}
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
