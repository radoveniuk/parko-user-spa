import styled from 'styled-components';

import { themeConfig } from 'theme';

export const FilesListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const FileWrapper = styled.div`
  word-break: break-all;
  height: 140px;
  width: 100px;
  border: 1px solid #d4d4d4;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s;
  cursor: pointer;
  margin: 20px;

  &:hover {
    background-color: #d4d4d4;
  }

  .file-media {
    height: 70%;
  }

  .file-text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: inherit;
    font-weight: 700;
    color: ${themeConfig.palette.primary.main};
  }
`;
