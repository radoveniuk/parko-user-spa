import styled from 'styled-components';

export const EmploymentCardWrapper = styled.div`
  .static-info {
    border-radius: 5px;
    border: 1px solid #D0D0D0;
    background: #FAFAFA;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 15px 20px;
    position: relative;

    .toggle-view {
      position: absolute;
      right: 5px;
      top: 5px;
    }

    .title {
      color: #131313;
    }

    .info {
      display: flex;
      flex-direction: column;
      font-size: 0.875rem;
      gap: 2px;
      color: #717171;

      &.hide {
        display: none;
      }

      .row {
        ul {
          margin: 0;
          padding-inline-start: 24px;
        }
      }
    }
  }

  .buttons {
    display: flex;
    gap: 10px;
    margin-top: 11px;
    flex-wrap: wrap;
  }
`;

export const EmploymentCardTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  .status {
    &.hired {
      background-color: #2A6AE7;
    }
    &.canceled {
      background-color: #717171;
    }
    &.fired {
      background-color: #E72A2A;
    }
    color: #fff;
    font-size: 0.7rem;
    padding: 1px 4px;
    border-radius: 2px;
    margin-top: 2px;
  }
`;