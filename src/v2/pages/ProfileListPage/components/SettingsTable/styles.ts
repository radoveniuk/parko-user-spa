import styled from 'styled-components';

export const ColsSettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  .cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 12px 24px;
  }
`;
