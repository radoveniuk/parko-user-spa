import styled from 'styled-components';

import { themeConfig } from 'theme';

export const FormCardWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #D0D0D0;
  background: #FFF;
  display: flex;
  flex-direction: column;
`;

export const FormCardHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 20px;
  align-items: center;
  border-bottom: 1px solid #D0D0D0;;
  .left, .right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .left {
    height: 18px;
    .icon {
      path {
        fill: ${themeConfig.palette.primary.main};
      }
    }
    .title {
      font-weight: 600;
      font-size: 16px;
    }
  }
  .right {
    button {
      max-height: 20px;
    }
  }
`;

export const FormCardBodyWrapper = styled.div<{ disabled?: boolean }>`
  padding: 15px 20px;
`;

export const FormCardBodyRowWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 15px 20px;
  align-items: end;
  background-color: #fff;
`;
