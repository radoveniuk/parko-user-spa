import styled from 'styled-components';

export const ColsSettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 24px;

  .selectGroup {
    margin-top: 16px;
    .MuiTypography-root {
      font-weight: 600;
      font-size: 1.1em;
    }
  }
  .selectSubGroup {
    margin-top: 8px;
    .MuiTypography-root {
      font-weight: 600;
      font-size: 1.05em;
      color: #8e8e8e;
    }
  }
  .cols {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
`;
