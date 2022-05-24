import styled from 'styled-components';

export const BaseInfoWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  .user-card {
    border: 1px solid;
    border-radius: 2px;
    margin: 20px;
  }
  
  .user-settings {
    margin: 20px;
  }
`;
