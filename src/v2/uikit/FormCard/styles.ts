import styled from 'styled-components';

import { themeConfig } from 'theme';
import { TB } from 'theme/sizeBreakpoints';

export const FormCardWrapper = styled.div`
  border-radius: 5px;
  /* border: 1px solid #D0D0D0; */
  box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 3px 0px, rgba(0, 0, 0, 0.12) 0px 2px 1px -1px, rgba(0, 0, 0, 0.14) 0px 1px 1px 0px;
  background: #FFF;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  position: relative;
  
  &.warn {
    box-shadow: rgb(184 103 0 / 52%) 0px 1px 3px 0px, rgb(255 0 0 / 12%) 0px 2px 1px -1px, rgb(255 0 0 / 14%) 0px 1px 1px 0px;
  }

  @media (max-width: ${TB}) {
    margin: 0 12px;
  }
`;

export const FormCardHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 13px 20px;
  align-items: center;
  border-bottom: 1px solid #D0D0D0;
  gap: 12px;
  flex-wrap: wrap;
  
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
      overflow: hidden;
      max-width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .right {
    margin-left: auto;
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

  .fullwidth {
    grid-column: 1 / 3;
  }
  @media (max-width: ${TB}) {
    grid-template-columns: 1fr;

    .fullwidth {
      grid-column: 1;
    }
  }
`;
