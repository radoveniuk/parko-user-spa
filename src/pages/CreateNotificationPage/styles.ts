import styled from 'styled-components';

export const NotificationForm = styled.form`
  .controls {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    flex-direction: column;

    .controls-input {
      max-width: 350px;
    }

    .selected-users {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }
  }
`;
