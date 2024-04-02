import styled from 'styled-components';

export const MobileOrderCardWrapper = styled.div`
  .card {
    margin: 3px 6px;
    padding: 12px;
    border-radius: 5px;
    position: relative;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    background-color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 3px;
    
    .date {
      color: rgb(126, 126, 126);
      position: absolute;
      right: 6px;
      top: 6px;
      font-size: 11px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;

      .name {
        font-size: 1.2rem;
        font-weight: 400;
        white-space: nowrap;
        max-width: calc(100% - 30px);
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    a, .goal {
      display: flex;
      align-items: center;
      gap: 3px;
    }

    a, .project, .goal {
      font-size: .9rem;
    }
    
    .project, .goal {
      color: #717171;
    }

    .actions {
      position: absolute;
      bottom: 6px;
      right: 6px;
    }
  }
`;
