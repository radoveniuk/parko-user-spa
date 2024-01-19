import styled from 'styled-components';

export const ProjectsWrapper = styled.div`
  display: flex;
  gap: 24px;
  position: relative;
  padding: 1px 0;

  @media (max-width: 1350px) {
    flex-direction: column;
    width: calc(100vw - 508px);
    gap: 20px;
  }

  @media (max-width: 700px) {
    width: 100%;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
  
    @media (min-width: 1800px) {
      width: 600px;
    }
    @media (max-width: 1799px) {
      flex: 1;
    }
    @media (max-width: 1600px) {
      width: 50%;
    }
    @media (max-width: 1350px) {
      width: 600px;
    }
    @media (max-width: 1150px) {
      width: 100%;
    }
  }
`;
