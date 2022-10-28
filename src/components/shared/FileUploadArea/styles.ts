import styled from 'styled-components';

import { themeConfig } from 'theme';

export const FileUploadAreaWrapper = styled.div`
  margin-top: 15px;

  .dzu-dropzone {
    min-height: 340px;
    max-height: 340px;
    border-style: dashed;
    overflow: auto;
  }

  .dzu-submitButton, .dzu-inputLabelWithFiles {
    font-family: 'Open Sans';
    font-weight: 500;
    font-size: 0.875rem;
    transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    line-height: 1.75;
    text-transform: uppercase;
    min-width: 64px;
    padding: 6px 16px;
    border-radius: 4px;
    color: #fff;
    min-height: 0 !important;
  }

  .dzu-submitButton {
    background-color: ${themeConfig.palette.primary.main};
    &:hover {
      background-color: ${themeConfig.palette.primary.light} !important;
    }
  }

  .dzu-inputLabelWithFiles {
    background-color: ${themeConfig.palette.secondary.main};
    &:hover {
      background-color: ${themeConfig.palette.secondary.dark} !important;
    }
  }

  .dzu-inputLabel {
    font-family: "Open Sans";
    color: ${themeConfig.palette.primary.main};
  }

  .dzu-previewContainer {
    padding: 20px 3%;

    .dzu-previewFileName {
      color: ${themeConfig.palette.primary.main};
    }
  }
`;
