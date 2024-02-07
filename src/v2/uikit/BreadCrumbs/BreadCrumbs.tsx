import React, { Children, PropsWithChildren } from 'react';

import { BreadCrumbsWrapper } from './styles';

type Props = {
  actions?: React.ReactNode;
};

const BreadCrumbs = ({ children, actions }: PropsWithChildren<Props>) => {
  const childrenList = Children.toArray(children);
  return (
    <BreadCrumbsWrapper>
      <div className="breadcrumbs">
        {childrenList.map((child, index) => (
          <div key={index} className="breadcrumb">
            {child}
            {index + 1 !== childrenList.length && <div className="divider">/</div>}
          </div>
        ))}
      </div>
      <div className="actions">{actions}</div>
    </BreadCrumbsWrapper>
  );
};

export default BreadCrumbs;
