import styled from 'styled-components';
import { themeConfig } from 'theme';

export const CustomSectionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;

  .form-label {
    color: ${themeConfig.palette.primary.main};
  }

  .config-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
`;
