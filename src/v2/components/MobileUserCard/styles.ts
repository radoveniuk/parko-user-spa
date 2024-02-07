import styled from 'styled-components';

export const MobileProfileCard = styled.div`
  .card {
    margin: 3px 6px;
    padding: 6px 12px;
    border-radius: 5px;
    position: relative;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    background-color: rgb(255, 255, 255);
    display: flex;
    position: relative;

    &.deleted {
      background-color: #f2e5e5;

      .left {
        background-color: #e6dada;
      }
    }

    .user-checkbox {
      position: absolute;
      right: 3px;
      top: 3px;
    }
    
    .left {
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #faf9f8;
      gap: 12px;
      padding: 6px 12px;
      border-radius: 5px;

      .actions {
        display: flex;
        align-items: center;
      }
    }

    .right {
      padding: 0 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;

      .name, .project {
        display: flex;
        gap: 6px;
        align-items: center;
        white-space: nowrap;
      }

      .project {
        color: #717171;
      }

      .name {
        color: #8397bc;
      }

      .phone {
        margin-top: auto;
        margin-bottom: 5px;
      }
    }
  }
`;
