import styled from 'styled-components';

export const MobileClientCardWrapper = styled.div`
  .card {
    margin: 3px 6px;
    padding: 6px 12px;
    border-radius: 5px;
    position: relative;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    background-color: rgb(255, 255, 255);
    display: flex;
    position: relative;
    
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

      .project {
        display: flex;
        gap: 6px;
        align-items: center;
      }

      .business-name {
        font-size: 0.75em;
      }

      .project, .business-name {
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
