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
  align-items: flex-start;

  .profile-actions {
    display: flex;
    gap: 15px;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  @media (max-width: ${SM}) {
    flex-direction: column;
  }
`;

export const ProfileTabContent = styled.div`
  flex-grow: 1;

  @media (max-width: ${SM}) {
    height: auto;
  }

  .accordion-projects {
    width: calc(100% - 18px * 2);
    margin: 0 auto 17px !important;
  }
  
  .section-card {
    margin: 0 20px;
    padding: 15px 0;
    
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

export const SideInfoBarWrapper = styled.div`
  max-width: 360px;
`;

export const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  position: relative;

  @media (max-width: ${SM}) {
    border: none;
    padding: 0;
  }

  .project-stages {
    max-height: 45vh;
    overflow: auto;

    .stage-step {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .date {
        font-size: 12px;
      }
    }
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

  .role-select {
    width: 100%;

    .MuiFormControl-root {
      width: 100%;
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
    position: relative;
    width: 100%;

    .MuiTab-root {
      align-items: baseline;
      padding-left: 8px;
      min-height: 42px;
      color: #616161 !important;
      border-radius: 3px;

      &.Mui-selected {
        background: #E0E0E0;
      }
    }

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
