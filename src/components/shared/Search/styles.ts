import styled from 'styled-components';

export const SearchWrapper = styled.div`
  position: relative;
  max-width: 400px;

  .search-input {
    min-width: 350px;
    max-width: 350px;
  }

  .search-results {
    position: absolute;
    background-color: #fff;
    z-index: 2;
    min-width: 100%;
    box-shadow: 0px 4px 5px 0px rgb(0 0 0 / 24%);
    max-height: 500px;
    overflow-y: auto;

    .search-result-item {
      min-height: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 5px;
      cursor: pointer;
      
      &:hover {
        background-color: #eaeaea;
      }
    }
  }
`;
