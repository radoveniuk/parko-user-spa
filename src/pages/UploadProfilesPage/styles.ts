import styled from 'styled-components';

export const StepperWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .MuiStepper-horizontal {
    width: 100%;
  }
`;

export const DefaultPassWrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 5px;
  border: 1px solid #ac3b61;
  background-color: #eee1dc;
  padding-left: 15px;
  margin-top: 10px;
  max-width: 200px;

  button {
    margin-left: auto;
  }
`;
