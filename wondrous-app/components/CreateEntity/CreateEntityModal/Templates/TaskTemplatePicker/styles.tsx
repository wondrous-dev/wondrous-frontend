import { ButtonUnstyled, PopperUnstyled } from '@mui/base';
import { Autocomplete, Button, ClickAwayListener, Typography } from '@mui/material';
import { CheckedBoxPropsIcon } from 'components/Icons/checkedBoxProps';
import CloseModalIcon from 'components/Icons/closeModal';
import EllipsesIcon from 'components/Icons/ellipsesIcon';
import Ethereum from 'components/Icons/ethereum';
import PodIcon from 'components/Icons/podIcon';
import PointsIconCustom from 'components/Icons/PointsIconCustom';
import styled, { css } from 'styled-components';
import { greyColors, white } from 'theme/colors';
import palette from 'theme/palette';
import Arrow from '../../../../Icons/arrow.svg';

export const scrollBarStyles = css`
  :hover {
    &::-webkit-scrollbar {
      display: block;
    }
  }
  &::-webkit-scrollbar {
    display: none;
    position: absolute;
    z-index: 999;
    width: 20px;
    background: transparent;
    border-radius: 0 4px 4px 0;
    outline: none;
  }
  &::-webkit-scrollbar-track {
    background: #606060;
    background-clip: padding-box;
    border: 8px solid rgba(0, 0, 0, 0);
    border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    border: 8px solid rgba(0, 0, 0, 0);
    background: #c4c4c4;
    background-clip: padding-box;
  }
`;

export const PodSearchWrapper = styled.div``;

export const TaskTemplateTitle = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 24px;
    font-weight: 700;
    color: ${palette.white};
    white-space: nowrap;
  }
`;

export const TaskTemplateIcon = styled(CheckedBoxPropsIcon)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  margin-right: 8px;
  background: linear-gradient(180deg, #4f00de 0%, #474747 85.77%);
  color: '#474747' svg {
    width: 12px;
    height: 12px;
  }
`;

export const TaskTemplateModal = styled(ButtonUnstyled)`
  font-family: 'Space Grotesk';
  font-weight: 500;
  font-size: 13px;
  min-width: 130px;
  max-width: 250px;
  border-radius: 4px;
  padding: 12px;
  background: ${greyColors.grey90};
  border: 1px solid ${(props) => (props.open ? greyColors.grey57 : `transparent`)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  gap: 6px;
  :hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`;

export const TaskTemplateLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
  overflow: hidden;
  margin-right: 8px;
`;

export const TaskTemplateDefaultPopper = styled(PopperUnstyled)`
  display: inline-block;
  flex-direction: column;
  padding: 8px;
  border-radius: 4px;
  background-color: ${greyColors.grey95};
  border: 1px solid ${greyColors.grey57};
  position: relative;
  z-index: 9999;
  ${(props) => props.style}
`;

export const TaskTemplateActionPopper = styled(PopperUnstyled)`
  padding: 24px;
  overflow-y: scroll;
  border-radius: 4px;
  background-color: ${greyColors.grey95};
  border: 1px solid ${greyColors.grey57};
  position: relative;
  z-index: 9999;
  ${(props) => props.style}

  &::-webkit-scrollbar {
    display: none;
    position: absolute;
    z-index: 999;
    width: 20px;
    background: transparent;
    border-radius: 0 4px 4px 0;
    outline: none;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    border: 8px solid rgba(0, 0, 0, 0);
    background: #c4c4c4;
    background-clip: padding-box;
  }
`;

export const TaskTemplateActionContainer = styled.div`
  padding: 24px;
  background: #141414;
  width: 100%;
  justify-content: flex-end;
  display: flex;
`;

export const TaskTemplateSaveTopContainer = styled.div`
  padding: 24px;
`;

export const TaskTemplateCancelButton = styled(ButtonUnstyled)`
  font-family: 'Space Grotesk';
  font-weight: 500;
  font-size: 13px;
  color: ${white};
  border-radius: 20px;
  margin-right: 8px;
  text-align: center;
  padding: 8px 30px 8px 30px;
  background: #1f1f1f;
  border: 1px solid ${(props) => (props.open ? greyColors.grey57 : `transparent`)};
  display: flex;
  align-items: center;
  :hover {
    background: #474747;
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`;

export const TemplateOptionsPopper = styled(PopperUnstyled)`
  padding: 4px;
  border-radius: 4px;
  background-color: #1f1f1f;
  border: 1px solid ${greyColors.grey57};
  position: relative;
  z-index: 9999;
`;

export const PodSearchAutocomplete = styled(Autocomplete)``;

export const TaskTemplateClickAway = styled(ClickAwayListener)``;

export const PopperSearchInputList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PodSearchLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 15px;
    font-weight: 500;
    color: ${palette.white};
    margin-left: 6px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
  }
`;

export const PodSearchListItem = styled.li`
  && {
    list-style: none;
    display: ${({ hide }) => (hide ? 'none' : 'flex')};
    align-items: center;
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    color: ${palette.white};
    :last-of-type {
      border-radius: 0 0 4px 4px;
    }

    &&[aria-selected='true'],
    &&[aria-selected='true'].Mui-focused,
    &&.Mui-focused {
      background: rgba(122, 122, 122, 0.2);
    }
  }
`;

export const TaskTemplateListItems = styled.li`
  && {
    list-style: none;
    display: ${({ hide }) => (hide ? 'none' : 'inline-grid')};
    align-items: center;
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    color: ${palette.white};
    :last-of-type {
      border-radius: 0 0 4px 4px;
    }

    &&[aria-selected='true'],
    &&[aria-selected='true'].Mui-focused,
    &&.Mui-focused {
      background: rgba(122, 122, 122, 0.2);
    }
  }
`;

export const TaskTemplatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const TaskTemplateTitleBar = styled.div`
  flex-direction: row;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  ${(props) => props.style}
`;

export const TaskTemplateSpecificTitleBar = styled.div`
  flex-direction: row;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const TaskTemplateCloseIcon = styled(CloseModalIcon)`
  transform: rotate(90deg);
  background: rgba(0, 0, 0, 1);
  width: 32px;
  height: 32px;
  padding: 8px;
  border-radius: 6px;
  path {
    fill: ${greyColors.grey57};
  }
  :hover {
    background: rgba(122, 122, 122, 0.2);
  }
`;

export const TaskTemplateEllipsesIcon = styled(EllipsesIcon)`
  width: 24px;
  color: ${white};
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

export const TaskTemplateContainer = styled.div`
  border-radius: 4px;
  background: #121212;
  padding: 14px;
  margin-bottom: 12px;
  :hover {
    background: rgba(122, 122, 122, 0.2);
  }
`;
export const TaskTemplateBorderLine = styled.div`
  border-bottom: 0.5px dashed #4b4b4b;
  margin-bottom: 12px;
`;
export const PodSearchDefaultImage = styled((props) => (
  <div {...props}>
    <PodIcon />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ color }) => color};
  border-radius: 50px;
  width: 20px;
  height: 20px;
  svg {
    width: 20px;
    height: 20px;
  }
`;

export const TaskTemplateLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 500;
    color: ${palette.white};
    margin-left: 6px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const TaskTemplateRewardContainer = styled.div`
  && {
    flex-direction: row;
    display: flex;
  }
`;

export const TaskTemplateLabelValue = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 100;
    color: ${white};
    margin-bottom: 4px;
    overflow: hidden;
    ${(props) => props.style}
  }
`;

export const TaskTemplateRewardValue = styled(Typography)`
  && {
    font-family: 'Space Grotesk';

    font-size: 13px;
    font-weight: 500;
    ${({ theme }) => `
      color: ${theme.palette.green800};
    `}
  }
`;

export const TaskTemplatePointsValue = styled(Typography)`
  && {
    font-family: 'Space Grotesk';

    font-size: 13px;
    font-weight: 500;
    background: linear-gradient(180deg, ${white} 0%, #ffd653 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const TaskTemplateRewardBox = styled(Typography)`
  && {
    flex-direction: row;
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 6px;
    background: rgba(122, 122, 122, 0.2);
    margin-bottom: 4px;
    margin-top: 8px;
    margin-right: 4px;
  }
`;

export const CreateEntityDefaultDaoImage = styled(PointsIconCustom)`
  color: linear-gradient(180deg, ${white}, 0%, #ffd653 100%);
  background: #000000;
  width: 24px;
  height: 24px;
  padding: 6px;
  border-radius: 20px;
  margin-right: 8px;
`;

export const TaskTemplateEthereumIcon = styled(Ethereum)`
  background: #000000;
  width: 24px;
  height: 24px;
  padding: 6px;
  border-radius: 20px;
  margin-right: 8px;
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

export const TaskTemplateReviewerValue = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 100;
    color: ${palette.white};
    margin-bottom: 4px;
    overflow: hidden;
    max-width: 100%;
    margin-left: 4px;
  }
`;

export const TaskTemplateArrowIcon = styled((props) => (
  <div {...props}>
    <Arrow />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: space-between;
  transform: rotate(270deg);
  svg {
    path {
      fill: ${greyColors.grey57};
    }
  }
`;

export const TaskTemplateDeleteIcon = styled(CloseModalIcon)``;
