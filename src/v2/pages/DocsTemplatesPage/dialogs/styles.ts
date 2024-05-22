import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM, TB } from 'theme/sizeBreakpoints';

export const DialogContentWrapper = styled.div`
  .form {
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr 1fr;

    
    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
    }
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
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

  @media (max-width: ${TB}) {
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
    @media (min-width: ${TB}) {
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

export const FieldCodesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;

  @media (max-width: ${SM}) {
    grid-template-columns: 1fr;
  }
  .code {
    display: flex;
    flex-direction: column;
    padding: 3px 6px;
    transition: .3s;
    position: relative;

    &:hover {
      background-color: #f0f0f0;
      button {
        opacity: 1;
      }
    }
  }
  .name {
    font-size: 0.75em;
    display: flex;
    align-items: center;
    color: #919191;

    button {
      position: absolute;
      right: 1px;
      top: 1px;
      opacity: 0;
      transition: .3s;

      @media (max-width: ${SM}) {
        opacity: 1;
      }
    }
  }
`;

export const CategoriesWrapper = styled.div`
  .form {
    display: flex;
    align-items: flex-end;

    .MuiInputBase-root {
      width: 100%;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .MuiButtonBase-root {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      height: 36px;
    }
  }

  .categories {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 6px;

    .category {
      display: flex;
      gap: 6px;
      align-items: center;
      color: #4d4d4dde;
      .name {
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .date {
        font-size: 0.7em;
        color: #b9b9b9;
        margin-left: auto;
      }
    }
  }
`;
