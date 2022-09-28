import styled from 'styled-components';

export const DialogContentWrapper = styled.div`
  padding: 10px;
  .form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    width: 456px;

    .form-field, .search-input {
      max-width: 223px !important;
      min-width: 223px !important;
    }
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
`;
