import styled from 'styled-components';

export const RelativeFieldsGrid = styled.div`
  display: grid;
  grid-gap: 0.7rem;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  overflow-x: auto;
`;

export const FileUploadingWrapper = styled.div`
  margin-top: 20px;

  .csvReader {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;

    a:first-child {
      margin-right: 20px;
    }
  }

  .acceptedFile {
    border: 1px solid #ccc;
    height: 35px;
    line-height: 2.5;
    padding-left: 10px;
    width: 40%;
  }
`;
