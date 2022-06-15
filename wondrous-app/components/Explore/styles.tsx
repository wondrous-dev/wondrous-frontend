import { Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import { SIDEBAR_WIDTH } from 'utils/constants';
import { CreateFormPreviewButton } from '../CreateEntity/styles';

export const Background = styled.div`
  width: 80%;
  max-width: 1038px;
  padding-top: 30px;
  margin-top: 60px;
  border-radius: 12px;
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

export const StyledGridContainer = styled(Grid)`
  && {
    width: 80%;
    max-width: 1038px;
    margin-left: ${SIDEBAR_WIDTH};
    display: flex;
    justify-content: center;
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
`;
export const StyledGridItem = styled(Grid)`
  && {
    background-color: #1e1e1e;
    border-radius: 12px;
    text-align: center;
    margin: auto;
    margin-top: 20px;
    padding-bottom: 20px;
    min-height: 530px;
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
    color: white;
    padding-left: 8px;
    padding-right: 8px;
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
