import { ButtonUnstyled, PopperUnstyled } from '@mui/base';
import { Autocomplete, ClickAwayListener, InputAdornment, TextField, Typography } from '@mui/material';
import { CheckedBoxPropsIcon } from 'components/Icons/checkedBoxProps';
import CloseModalIcon from 'components/Icons/closeModal';
import EllipsesIcon from 'components/Icons/ellipsesIcon';
import Ethereum from 'components/Icons/ethereum';
import PodIcon from 'components/Icons/podIcon';
import PointsIconCustom from 'components/Icons/PointsIconCustom';
import SearchIcon from 'components/Icons/search';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';
import Arrow from '../../../Icons/arrow.svg';

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
  background: #282828;
  border: 1px solid ${(props) => (props.open ? `#7a7a7a` : `transparent`)};
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

export const TaskTemplateDefaultPopper = styled((props) => <PopperUnstyled {...props} />)`
  padding: 8px;
  border-radius: 4px;
  background-color: #1f1f1f;
  border: 1px solid #7a7a7a;
  position: relative;
  z-index: 9999;
`;

export const TaskTemplateActionPopper = styled((props) => <PopperUnstyled {...props} />)`
  padding: 24px;
  overflow-y: scroll;
  border-radius: 4px;
  background-color: #1f1f1f;
  border: 1px solid #7a7a7a;
  position: relative;
  z-index: 9999;
  ${scrollBarStyles}
`;

export const TaskTemplateCancelButton = styled(ButtonUnstyled)`
  font-family: 'Space Grotesk';
  font-weight: 500;
  font-size: 13px;
  color: #ffffff;
  border-radius: 20px;
  margin-right: 8px;
  text-align: center;
  padding: 8px 30px 8px 30px;
  background: #1f1f1f;
  border: 1px solid ${(props) => (props.open ? `#7a7a7a` : `transparent`)};
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
  border: 1px solid #7a7a7a;
  position: relative;
  z-index: 9999;
`;

export const PodSearchAutocomplete = styled(Autocomplete)``;

export const TaskTemplateClickAway = styled(ClickAwayListener)``;

export const PopperSearchInputList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PodSearchInput = styled(TextField)`
  && {
    width: 100%;
    padding: 10px;
    && .MuiOutlinedInput-root {
      background: #313131;
      width: 100%;
      display: flex;
      padding: 0 8px;
    }
    && .MuiOutlinedInput-input {
      height: 32px;
      padding: 0;
      font-family: 'Space Grotesk';
      font-weight: 400;
      font-size: 14px;
      color: ${palette.white};
    }
  }
  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

export const PodSearchInputAdornment = styled(InputAdornment)`
  && {
    height: 13px;
    width: 13px;
  }
`;

export const PodSearchInputIcon = styled(SearchIcon)`
  path {
    stroke: ${palette.white};
  }
`;

export const PodSearchAutocompletePopper = styled.div`
  && {
    position: relative;
  }
  .MuiAutocomplete-noOptions {
    font-family: 'Space Grotesk';
    color: ${palette.white};
    margin: 0;
    padding: 0;
    background-image: none;
    background: #1f1f1f !important;
    border: none;
    border-radius: 0;
    padding: 12px;
    font-size: 13px;
    font-weight: 500;
  }
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

export const PodSearchPaper = styled.div`
  && {
    padding: 0;
    margin: 0;
    border-radius: 0 0 4px 4px;
  }
`;

export const PodSearchList = styled.ul`
  && {
    color: ${palette.white};
    margin: 0;
    padding: 0;
    background-image: none;
    background: #1f1f1f !important;
    border: none;
    border-radius: 0;
    max-height: 170px;
    ${scrollBarStyles}
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

export const TaskTemplateTitleBar = styled((props) => <div {...props} />)`
  flex-direction: row;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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
    fill: #7a7a7a;
  }
  :hover {
    background: rgba(122, 122, 122, 0.2);
  }
`;

export const TaskTemplateEllipsesIcon = styled(EllipsesIcon)`
  width: 24px;
  color: #ffffff;
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

export const TaskTemplateLabelValue = styled((props) => <Typography {...props} />)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 100;
    color: #ffffff;
    margin-bottom: 4px;
    overflow: hidden;
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
    background: linear-gradient(180deg, #ffffff 0%, #ffd653 100%);
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
  color: linear-gradient(180deg, #ffffff 0%, #ffd653 100%);
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

export const TaskTemplateOptionsLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 100;
    padding: 4px 8px 4px 8px;
    color: ${palette.white};
    margin-bottom: 4px;
    overflow: hidden;
    border-radius: 4px;
    background: #121212;
    :hover {
      background: rgba(122, 122, 122, 0.2);
    }
  }
`;

export const TaskTemplateOptionsDeleteLabel = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-weight: 100;
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
      fill: #7a7a7a;
    }
  }
`;

export const TaskTemplateDeleteIcon = styled(CloseModalIcon)``;
