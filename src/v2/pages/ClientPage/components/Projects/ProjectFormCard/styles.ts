import styled from 'styled-components';
import { RadioGroup } from 'v2/uikit';

import { TB } from 'theme/sizeBreakpoints';

export const FormCardContent = styled.div`
  position: relative;

  .delete-icon {
    position: absolute;
    bottom: 5px;
    right: 5px;
  }
`;

export const ProjectTitleWrapper = styled.div`
  display: flex;
  align-items: center;

  .name-field {
    input {
      padding: 4px 0 5px;
      font-weight: 600;
    }
  }

  .project-name {
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const TypeRadioButtons = styled(RadioGroup)`
  display: grid !important;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 15px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  .MuiFormControlLabel-root {
    border-radius: 3px;
    border: 1px solid #D0D0D0;
    background: #FAFAFA;
    margin-left: 0;
    margin-right: 0;
  }
`;

export const PositionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 15px;
  margin-bottom: 10px;
`;

export const PositionWrapper = styled.div`
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

  .fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    row-gap: 15px;
    column-gap: 20px;

    @media (max-width: ${TB}) {
      grid-template-columns: 1fr;
    }

    &.hide {
      display: none;
    }

    .fullwidth {
      grid-column: 1 / 3;

      @media (max-width: ${TB}) {
        grid-column: 1 / 1;
      }
    }

    .field-label {
      color: rgb(113, 113, 113);
      font-size: 14px;
      line-height: 14px;
      white-space: nowrap;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .position-ids, .salary, .work-fund {
      display: flex;
      flex-direction: column;
      width: 100%;
      .inputs {
        display: grid;
  
        label:first-child {
          .MuiInputBase-root {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
        }
        label:last-child {
          .MuiInputBase-root {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
          }
        }
      }
    }

    .position-ids > .inputs {
      grid-template-columns: 100px 1fr;
    }

    .salary > .inputs {
      grid-template-columns: 1fr 90px;

      .MuiInputBase-root {
        min-width: 90px !important;
      }
    }

    .work-fund > .inputs {
      grid-template-columns: repeat(3, 1fr);
      label:nth-child(2) {
        .MuiInputBase-root {
          border-radius: 0;
        }
      }
    }

  }
`;
