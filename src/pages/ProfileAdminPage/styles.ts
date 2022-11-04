import styled from 'styled-components';

import { themeConfig } from 'theme';

export const DeleteDialogContent = styled.div`
  .actions {
    display: flex;
    justify-content: flex-end;
  }
`;

export const ProfileDataWrapper = styled.div`
  margin-top: 25px;
  display: flex;
  flex-wrap: wrap;

  .profile-actions {
    display: flex;
    gap: 20px;
    margin-top: 10px;

    .delete-button {
      margin-left: auto;
    }
  }
`;

export const ProfileTabContent = styled.div`
  height: 95vh;
  overflow-y: auto;
  flex-grow: 1;

  .section-title {
    font-size: 20px;
    margin-bottom: 20px;
  };

  .section-card {
    padding: 20px;
    border: 1px solid #9F9D9D;
    border-radius: 20px;
    margin-left: 20px;
  }
`;

export const ProfileCard = styled.div`
  border: 1px solid #9F9D9D;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  position: relative;

  .card-title {
    font-size: 20px;
  }

  .card-fast-actions {
    display: flex;
    gap: 40px;

    button {
      border-radius: 50%;
      min-height: 50px;
      max-height: 50px;
      max-width: 50px;
      min-width: 50px;
    }
  }

  .card-profile-settings {
    display: grid;
    grid-gap: 15px;
    grid-template-columns: 180px 180px;

    .MuiFormControl-root {
      max-width: 180px;
      
      .MuiInputBase-root {
        max-width: 180px;
        min-width: 180px !important;

      }
    }
  }

  .profile-contacts {
    display: flex;
    flex-direction: column;
    font-size: 15px;
    color: ${themeConfig.palette.primary.main};
    gap: 14px;
    align-items: center;
  }

  .card-divider {
    height: 1px;
    width: 80%;
    background-color: #9F9D9D;
  }
  
  .tabs-options {
    height: 40vh;
    position: relative;
  }
`;

export const EmptyDataWrapper = styled.div`
  height: calc(100vh - 165px);
  font-size: 30px;
  font-weight: 600;
  color: #b9b9b9;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;
