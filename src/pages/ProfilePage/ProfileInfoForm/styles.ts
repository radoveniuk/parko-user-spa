import styled from 'styled-components';

export const ProfileInfoFormWrapper = styled.div`
  text-align: center;

  .accordion {
    margin: 20px !important;

    .accordion-content {
      display: flex;
      flex-wrap: wrap;
  
      .field-wrap {
        margin: 10px;

        .MuiSelect-select {
          text-align: left;
        }
      }
    }
  }
`;
