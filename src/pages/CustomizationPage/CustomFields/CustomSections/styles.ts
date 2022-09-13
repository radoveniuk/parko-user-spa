import styled from 'styled-components';
import { themeConfig } from 'theme';

export const CustomSectionForm = styled.div`
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

export const CustomSectionsWrapper = styled.div`
  .sections-grid {
    display: grid;
    grid-template-columns: 1fr 40px 40px 40px;

    .section-radio-wrapper {
      display: contents;
      gap: 10px;
    }
  }
`;
