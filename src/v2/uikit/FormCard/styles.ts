import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const FormCardWrapper = styled.div`
  border-radius: 5px;
  border: 1px solid #D0D0D0;
  background: #FFF;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  position: relative;
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
      color: ${themeConfig.palette.primary.main};
      display: flex;
      align-items: center;
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

  @media (max-width: ${SM}) {
    grid-template-columns: 1fr;
  }
`;
