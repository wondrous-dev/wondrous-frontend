import { PopperUnstyled } from '@mui/base';
import { Grid, Typography, Button } from '@mui/material';
import EllipsesIcon from 'components/Icons/ellipsesIcon';

import styled from 'styled-components';
import palette from 'theme/palette';

export const StyledGrid = styled(Grid)`
  && {
    border: 1px solid ${palette.grey79};
    border-bottom-width: 0;
    padding: 12px;
    max-height: 90vh;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      display: none;
      width: 0;
      height: 0;
    }
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &:nth-child(even) {
      border-right-width: 0;
      border-left-width: 0;
    }
  }
`;

export const LeftColumnText = styled(Typography)`
  && {
    color: ${palette.blue20};
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 12px;
  }
`;

export const CategoryDiv = styled.div`
  padding: 10px 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background: ${palette.grey78};
  }
`;

export const CategoryText = styled(LeftColumnText)`
  && {
    color: ${palette.white};
    margin-bottom: 0;
  }
`;

export const TaskTemplateCountDiv = styled.div`
  background: ${palette.grey87};
  padding: 4px;
`;
export const TemplateTitle = styled(Typography)`
  && {
    font-weight: 700;
    font-size: 16px;
    text-transform: capitalize;
    color: ${palette.white};
    margin-bottom: 8px;
  }
`;

export const TemplateDiv = styled.div`
  background: ${palette.grey87};
  padding: 14px;
  margin-bottom: 12px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
`;

export const TemplateDivTitle = styled(Typography)`
  && {
    font-weight: 700;
    font-size: 13px;
    color: ${palette.white};
  }
`;

export const TemplatePodDiv = styled.div`
  background: ${palette.grey78};
  border-radius: 4px;
  padding: 5px 8px 5px 4px;
  display: flex;
  align-items: center;
  margin-top: 8px;
  width: fit-content;
`;

export const TemplatePodText = styled(Typography)`
  && {
    font-size: 13px;
    color: ${palette.white};
    font-weight: 500;
  }
`;
export const TemplateDivDescription = styled(TemplateDivTitle)`
  && {
    color: ${palette.grey250};
    overflow: hidden;
    overflow-wrap: break-word;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
  }
`;

export const SaveTemplateButton = styled.div`
  background: ${palette.grey85};
  border-radius: 6px;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 16px;
  &:hover {
    background: ${palette.grey78};
  }
`;

export const SaveTemplateButtonText = styled(Typography)`
  && {
    font-size: 13px;
    font-weight: 500;
    color: ${palette.white};
  }
`;

export const TemplateSelectText = styled.span`
  text-transform: capitalize;
`;

export const TaskTemplateEllipsesIcon = styled(EllipsesIcon)`
  width: 24px;
  color: ${palette.white};
  background: rgba(122, 122, 122, 0.2);
  height: 24px;
  padding: 6px;
  border-radius: 6px;
  path {
    background: rgba(122, 122, 122, 0.2);
  }
  :hover {
    cursor: pointer;
  }
`;

export const TaskTemplateOptionsDeleteLabel = styled(Button)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 100;
    width: 100%;
    padding: 4px 8px 4px 8px;
    color: #cf4141;
    margin-bottom: 4px;
    overflow: hidden;
    border-radius: 4px;
    background: #121212;
    :hover {
      background: rgba(122, 122, 122, 0.2);
    }
  }
`;

export const TaskTemplateOptionsLabel = styled(Button)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 100;
    padding: 4px 8px 4px 8px;
    color: ${palette.white};
    width: 100%;
    margin-bottom: 4px;
    overflow: hidden;
    border-radius: 4px;
    background: #121212;
    :hover {
      background: rgba(122, 122, 122, 0.2);
    }
  }
`;

export const TemplateOptionsPopper = styled(PopperUnstyled)`
  padding: 4px;
  border-radius: 4px;
  background-color: #1f1f1f;
  border: 1px solid ${palette.grey57};
  position: relative;
  z-index: 9999;
`;

export const StyledGridContainer = styled(Grid)`
  && {
    max-height: 100vh;
    overflow-y: scroll;
  }
`;
