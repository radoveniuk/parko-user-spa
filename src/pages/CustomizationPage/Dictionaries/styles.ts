import styled from 'styled-components';

import { themeConfig } from 'theme';

const borderColor = '#e9e9e9';

export const DictionariesWrapper = styled.div`
  display: flex;
  border-top: 1px solid ${borderColor};

  .dictionaries-list {
    border-right: 1px solid ${borderColor};
    min-width: 33%;
    max-height: calc(100vh - 190px);
    min-height: calc(100vh - 190px);
    overflow-y: auto;
  }

  .create-fab {
    position: absolute;
    bottom: 30px;
    right: 10px;
    border-radius: 50%;
    min-height: 50px;
    max-height: 50px;
    max-width: 50px;
    min-width: 50px;
    font-size: 30px;
  }

  .form {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .MuiTextField-root {
      max-width: 300px;
    }

    .form-label {
      color: ${themeConfig.palette.primary.main};
    }

    .chips-wrapper {
      display: flex;
      flex-direction: row;
      gap: 10px;
      flex-wrap: wrap;
      overflow: auto;
    }

    .config-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
`;
