import styled from 'styled-components';
import { themeConfig } from 'theme';

export const FileInputWrapper = styled.div`
  label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    
    .input-label {
      margin: 0;
      font-size: 12px;
      color: ${themeConfig.palette.primary.main};
    }
  }
`;
