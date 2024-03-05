import styled from 'styled-components';

export const AddressSearchInputWrapper = styled.div`
  position: relative;

  .suggestions {
    position: absolute;
    z-index: 1;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12);
    max-width: 100%;
    max-height: 200px;
    overflow: auto;

    ul {
      li {
        .content {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
`;
