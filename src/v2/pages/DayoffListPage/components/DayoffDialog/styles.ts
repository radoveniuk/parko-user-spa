import styled from 'styled-components';

import { themeConfig } from 'theme';
import { TB } from 'theme/sizeBreakpoints';

export const PrepaymentDialogContent = styled.div`
  .tab-btn {
    padding-left: 16px !important;

    &.error {
      color: red !important;
      &.Mui-selected {
        background: #ff000017;
      }
    }
  }

  .form {
    margin-top: 12px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 24px;
    row-gap: 12px;
    margin-bottom: 48px;
    width: 500px;

    .fullwidth {
      grid-column: 1 / 3;
    }

    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
      width: 100%;
      *:last-child {
        grid-column: 1;
      }
      .fullwidth {
        grid-column: 1;
      }
    }
  }

  .files {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    width: 500px;
    gap: 12px;

    .files-list {
      margin: 0;
      padding-inline-start: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px;

      li {
        display: flex;
        align-items: center;
        border-radius: 4px;
        padding: 2px 8px;
        background-color: #f3f9ff;

        span {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
        
        button {
          margin-left: auto;
        }
      }
    }
    @media (max-width: ${TB}) {
      width: 100%;

      .files-list { 
        grid-template-columns: 1fr;

        li span {
          max-width: 300px;
        }
      }
    }
  }
`;

export const FileInputArea = styled.div`
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
