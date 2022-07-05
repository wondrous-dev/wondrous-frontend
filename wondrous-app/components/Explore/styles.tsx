import { Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import { SIDEBAR_WIDTH } from 'utils/constants';
import { CreateFormPreviewButton } from '../CreateEntity/styles';
import Masonry from '@mui/lab/Masonry';

export const Background = styled.div`
  width: 80%;
  padding-top: 30px;
  margin-top: 60px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  margin-left: ${SIDEBAR_WIDTH};
  margin-bottom: 24px;
`;

export const BackgroundText = styled(Typography)`
  && {
    display: inline;
    font-weight: 500;
    font-size: 48px;
    line-height: 52px;
    background: linear-gradient(45.88deg, #f77bff 30.92%, #6b0eff 56.81%, #01f4fc 101.09%);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -moz-background-clip: text;
    -moz-text-fill-color: transparent;
    -webkit-text-fill-color: transparent;
    text-align: center;
  }
`;

export const StyledGridContainer = styled(Masonry)`
  && {
    width: 80%;
    margin-left: ${SIDEBAR_WIDTH};
    display: flex;
    overflow: scroll;
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`;

export const StyledGridItemContainer = styled(Grid)`
  max-width: 327px;
  cursor: pointer;
`;
export const StyledGridItem = styled(Grid)`
  && {
    background-color: #1e1e1e;
    border-radius: 12px;
    text-align: center;
    margin: auto;
    margin-top: 20px;
    padding-bottom: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const OrgName = styled(Typography)`
  && {
    color: white;
    font-weight: bold;
    font-size: 18px;
    line-height: 26px;
    margin-bottom: 8px;
  }
`;

export const OrgDescription = styled(Typography)`
  && {
    font-size: 15px;
    line-height: 24px;
    color: #c4c4c4;
    padding-left: 12px;
    padding-right: 12px;
  }
`;

export const ExploreButton = styled(CreateFormPreviewButton)`
  && {
    margin-left: 0;
    height: auto;
    padding: 4px 16px;
    margin-top: 24px;
    position: absolute;
    bottom: 16px;
  }
`;

export const TabsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 25px;
  width: 100%;
  margin-left: ${SIDEBAR_WIDTH};
  width: 80%;
`;

export const IconWrapper = styled.div`
  margin-bottom: 16px;
  position: relative;
`;

export const Tab = styled.button`
  background: #1e1e1e;
  border-radius: 6px;
  padding: 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 0;
  margin-left: 12px;
  gap: 24px;
  max-height: 72px;
  span {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 700;
    font-size: 22px;
    line-height: 24px;
    position: relative;

    /* identical to box height, or 109% */

    letter-spacing: 0.0025em;

    /* Status - In progress */

    background: ${({ color }) => color};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    &::after {
      background: none;
      content: attr(data-text);
      left: 0;
      filter: blur(18px);
      top: 0;
      z-index: 1;
      position: absolute;
      height: 70%;
      width: 100%;
    }
  }
  ${IconWrapper} {
    svg {
      z-index: 2;
      position: relative;
    }
    &::before {
      content: '';
      position: absolute;
      height: 100%;
      width: ${({ iconPseudoStyleWidth = '100%' }) => iconPseudoStyleWidth};
      z-index: 0;
      background: none;
      filter: blur(28px);
      border-radius: 100%;
      left: 0;
      top: 0;
    }
  }
  &:hover {
    ${IconWrapper} {
      &::before {
        background: ${({ hoverColor }) => hoverColor};
      }
    }
    span {
      &::after {
        background: ${({ hoverColor }) => hoverColor};
      }
    }
  }
`;
