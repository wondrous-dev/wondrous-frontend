import { ButtonBase } from '@mui/material';
import { Box } from '@mui/system';
import styled from 'styled-components';

export const StyledViewQuestResults = styled(Box)`
  && {
    background: ${({ isReward }) => (!isReward ? '#c6bbfc' : '#F8AFDB')};
    padding: 6px;
    border-radius: 6px;
    font-family: 'Poppins';
    font-style: normal;
    width: fit-content;
    font-weight: 500;
    font-size: 14px;
    line-height: 14px;

    display: flex;
    align-items: center;
    letter-spacing: 0.02em;

    color: #000000;
  }
`;

export const FilterPill = styled(ButtonBase)`
  && {
    background: ${({ isActive }) => (isActive ? '#84BCFF' : '#F7F7F7')};
    border: ${({ isActive }) => (isActive ? '1px solid #000000' : 'none')};
    border-radius: 6px;
    padding: 10px;

    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 14px;
    /* identical to box height, or 100% */

    display: flex;
    align-items: center;
    letter-spacing: 0.01em;

    color: #000000;
  }
`;

export const StyledLinkButton = styled(ButtonBase)`
  && {
    width: 26px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f8642d;
    border-radius: 6px;
  }
`;
