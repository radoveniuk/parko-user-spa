import styled from 'styled-components';

export const ModalContentWrapper = styled.div`
  width: 80vw;

  .profiles-grid {
    max-height: 60vh;
  }

  .modal-footer {
    padding-top: 10px;
    display: flex;
    
    .selected-profiles {
      flex-grow: 1;
      display: flex;
      overflow: auto;
      margin-right: 5px;
      max-width: 80%;
    }

    button {
      margin-left: auto;
    }
  }
`;
