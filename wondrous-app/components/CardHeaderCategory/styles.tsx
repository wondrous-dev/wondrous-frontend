import styled from 'styled-components';
import Typography from '@mui/material/Typography';

import { CheckedIcon, GreenStarIcon, InProgressIcon, RedStarIcon, ToDoIcon, YellowStarIcon } from '../Icons/taskTypes';

export const CardCategoryBlock = styled.div`
  position: relative;
  max-width: 80px;
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
`;

export const CardCategoryIconContainer = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;

  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #0f0f0f;
`;

export const CardCategoryDoneIcon = styled(CheckedIcon)`
  width: 20px;
  height: 20px;
`;

export const CardCategoryInfoBlock = styled.div`
  z-index: 1;
  width: 60px;
  height: 28px;
  background-color: #0f0f0f;
  min-width: 50px;
  border-radius: 300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 9px;
`;

export const CardCategoryInfoBlockText = styled(Typography)`
  && {
    font-weight: 600;
    font-size: 13px;
    line-height: 14px;
    letter-spacing: 0.01em;
    color: #ffffff;
  }
`;

export const CardCategoryDoneStarIcon = styled(GreenStarIcon)`
  width: 10px;
  height: 10px;
`;

export const CardCategoryInProgressIcon = styled(InProgressIcon)`
  width: 20px;
  height: 20px;
`;

export const CardCategoryInProgressStarIcon = styled(YellowStarIcon)`
  width: 10px;
  height: 10px;
`;

export const CardCategoryToDoIcon = styled(ToDoIcon)`
  width: 20px;
  height: 20px;
`;

export const CardCategoryToDoStarIcon = styled(RedStarIcon)`
  width: 10px;
  height: 10px;
`;
