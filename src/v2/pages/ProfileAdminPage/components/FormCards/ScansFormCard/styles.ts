import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const ActionsCell = styled.div`
  display: flex;
  gap: 6px;
  justify-content: flex-end;
`;

export const ScanDialogContent = styled.div`
  .form {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 12px;
    margin-bottom: 24px;
  
    *:last-child {
      grid-column: 1 / 3;
    }

    @media (max-width: ${SM}) {
      grid-template-columns: 1fr;
      *:last-child {
        grid-column: 1;
      }
    }
  }
  .actions {
    align-items: baseline;
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    bottom: 0;
    background-color: #fff;
    width: calc(100% - 24px);
    padding-bottom: 12px;
    padding-top: 12px;
  }
`;

export const FileInputArea = styled.div`
  width: 100%;
  height: 36px;
  color: #8b8b8b;
  border: 2px dashed #8b8b8b;
  border-radius: 4px;
  font-size: 16px;
  transition: .3s;
  grid-column: 1 / 3;

  circle {
    color: #8b8b8b !important;
  }

  @media (max-width: ${SM}) {
    grid-column: 1;
    height: 48px;
  }

  &.error {
    border-color: ${themeConfig.palette.error.main};
    color: ${themeConfig.palette.error.main};

    circle {
      color:  ${themeConfig.palette.error.main} !important;
    }
  }

  &:has(.file-link) {
    background-color: #fff;
    border-color: #8397bc63;
    color: ${themeConfig.palette.primary.light};
    @media (min-width: ${SM}) {
      width: calc(50% - 16px);
    }
  }
  
  .FileInput, .file-link {
    height: 100%;
    display: flex;
    align-items: center;
    transition: .3s;
    border-radius: inherit;
  }
  
  .FileInput {
    gap: 12px;
    background-color: #e8e8e8;
    justify-content: center;
    &:hover {
      background-color: rgb(213 213 213);
    }
  }
  
  .file-link {
    cursor: pointer;
    position: relative;
    
    .content {
      padding-left: 12px;
      height: 100%;
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      transition: .3s;
      &:hover {
        background-color: #cfd7e545;
      }
    }

    .name {
      max-width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .delete-icon {
      position: absolute;
      right: 0;
    }
  }
`;

export const LoaderWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgb(255 255 255 / 50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: inherit;
`;
