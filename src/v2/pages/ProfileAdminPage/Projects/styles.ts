import styled from 'styled-components';

export const ProjectWrapper = styled.div`
  .actions {
    display: flex;
    justify-content: flex-end;
  }

  .select_blocks {
    margin-top: 15px;
    display: grid;
    gap: 15px;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .card-title {
    font-size: 20px;


    .client-info {
      text-align: center;
      font-size: 14px;
      color: #8f8f8f;
    }
  }

  .card-title-projects {
    text-align: center;
    margin-top: 30px;
  }
`;
