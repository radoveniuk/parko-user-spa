import styled from 'styled-components';

import { themeConfig } from 'theme';
import { SM } from 'theme/sizeBreakpoints';

export const DeleteDialogContent = styled.div`
  .actions {
    display: flex;
    justify-content: flex-end;
  }
`;

export const ProfileDataWrapper = styled.div`
  margin-top: 25px;
  display: flex;
  justify-content: center;

  .profile-actions {
    display: flex;
    gap: 20px;
    margin-top: 10px;
    flex-wrap: wrap;

    .delete-button {
      margin-left: auto;
    }
  }

  @media (max-width: ${SM}) {
    flex-direction: column;
  }
`;

export const ProfileTabContent = styled.div`
  height: 95vh;
  overflow-y: auto;
  flex-grow: 1;

  @media (max-width: ${SM}) {
    height: auto;
  }

  
  .section-card {
    border: 1px solid #9F9D9D;
    border-radius: 20px;
    margin-left: 20px;
    padding: 20px;
    
    .section-title {
      font-size: 20px;
      margin-bottom: 20px;
    };
    @media (max-width: ${SM}) {
      border: none;
      margin-left: 0;
      padding: 20px 0;

      .section-title {
        text-align: center;
      };
    }
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

  @media (max-width: ${SM}) {
    border: none;
    padding: 0;
  }

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

    @media (max-width: ${SM}) {
      height: auto;
    }
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
