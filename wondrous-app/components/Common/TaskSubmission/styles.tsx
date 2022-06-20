import { ButtonBase, InputAdornment, InputBase, Typography } from '@mui/material';
import { MediaItem } from 'components/CreateEntity/MediaItem';
import { MediaItemWrapper } from 'components/CreateEntity/MediaItem/styles';
import CloseModalIcon from 'components/Icons/closeModal';
import LeftArrowIcon from 'components/Icons/leftArrow';
import LinkIcon from 'components/Icons/linkSubmissionIcon.svg';
import styled from 'styled-components';
import { Button } from '../button';
import { FileLoading } from '../FileUpload/FileUpload';
import { GradientHighlightHorizontal } from '../gradients';
import { SafeImage } from '../Image';
import TaskMedia from '../TaskMedia';
import ChangesRequestedIcon from 'components/Icons/changesRequestedIcon.svg';

export const SubmissionButtonWrapperGradient = styled.div`
  background: linear-gradient(94.19deg, #7427ff 10.13%, #232323 131.81%);
  width: 100%;
  padding: 1px;
  border-radius: 6px;
`;

export const SubmissionButtonWrapperBackground = styled.div`
  background: #171717;
  width: 100%;
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;
  width: 100%;
  padding: 14px;
`;

export const SubmissionButtonCreate = styled(Button)`
  && {
    ${GradientHighlightHorizontal}
    height: 30px;
    width: fit-content;
    > button {
      font-family: 'Space Grotesk';
      ${({ theme }) => `
        font-weight: ${theme.typography.fontWeightMedium};
        background: ${theme.palette.black}
  `}
    }
  }
`;

export const SubmissionButtonTextHelper = styled(Typography)`
  && {
    font-size: 14px;
    text-align: center;
    ${({ theme }) => `
      font-weight: ${theme.typography.fontWeightMedium};
      color: ${theme.palette.grey250}
      `}
  }
`;

export const SubmissionButtonReviewWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

export const SubmissionButtonEdit = styled(ButtonBase)`
  width: max-content;
  height: 28px;
  border-radius: 100px;
  font-family: 'Space Grotesk';
  padding: 7px 16px;
  text-decoration: underline;
  ${({ theme }) => `
    color: ${theme.palette.white};
    font-weight: ${theme.typography.fontWeightMedium};
  `}
`;

export const SubmissionButtonRequestChange = styled(ButtonBase)`
  border: 1px solid #474747;
  width: max-content;
  height: 28px;
  border-radius: 100px;
  font-family: 'Space Grotesk';
  padding: 7px 16px;
  ${({ theme }) => `
    color: ${theme.palette.white};
    font-weight: ${theme.typography.fontWeightMedium};
  `}
`;

export const SubmissionButtonApprove = styled(ButtonBase)`
  background: #474747;
  width: max-content;
  height: 28px;
  border-radius: 100px;
  font-family: 'Space Grotesk';
  padding: 7px 16px;
  ${({ theme }) => `
    color: ${theme.palette.white};
    font-weight: ${theme.typography.fontWeightMedium};
  `}
`;

export const SubmissionFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 18px;
`;

export const SubmissionFormBackButton = styled(ButtonBase)`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 32px;
  align-self: flex-start;
`;

export const SubmissionFormBackIcon = styled((props) => (
  <div {...props}>
    <LeftArrowIcon />
  </div>
))`
  background: #1d1d1d;
  height: 32px;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
`;

export const SubmissionFormBackText = styled(Typography)`
  && {
    font-size: 12px;
    ${({ theme }) => `
      color: ${theme.palette.white};
      font-weight: ${theme.typography.fontWeightMedium}
    `}
  }
`;

export const SubmissionDivider = styled.div`
  height: 1px;
  border-bottom: 1px dashed ${({ theme }) => theme.palette.grey75};
  width: 100%;
`;

export const SubmissionForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const SubmissionFormTitle = styled(Typography)`
  && {
    font-size: 18px;
    ${({ theme }) => `
      color: ${theme.palette.white};
      font-weight: ${theme.typography.fontWeightMedium}
    `}
  }
`;

export const SubmissionFormDescription = styled.div``;

export const SubmissionDescriptionEditor = styled.div`
  padding: 12px;
  height: 100px;
  border-radius: 0 0 6px 6px;
  background: #1b1b1b;
  overflow: auto;
  color: white;

  &::-webkit-scrollbar {
    display: block;
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

export const SubmissionDescriptionEditorEditorToolbar = styled.div`
  && > div {
    border-radius: 6px 6px 0 0;
  }
`;

export const SubmissionFormLinksWrapper = styled.div`
  display: flex;
  column-gap: 8px;
  row-gap: 16px;
  flex-wrap: wrap;
  width: 100%;
`;

export const SubmissionFormLinkWrapper = styled.div`
  min-width: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SubmissionFormLink = styled(InputBase)`
  border-radius: 6px;
  font-size: 14px;
  flex-grow: 1;
  padding: 8px;
  height: 42px;
  ${({ theme }) => `
    color: ${theme.palette.white};
    background: #1b1b1b;
  `}
  .MuiInputBase-input {
    padding: 0;
  }
`;

export const SubmissionFormLinkStartAdornment = styled(InputAdornment)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0f0f0f;
    height: 26px;
    width: 26px;
    border-radius: 6px;
  }
`;

export const SubmissionFormLinkIcon = styled(LinkIcon)`
  transform: scale(70%);
  path {
    stroke: #ccbbff;
  }
`;

export const SubmissionFormLinkEndAdornment = styled(InputAdornment)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    width: 26px;
    border-radius: 6px;
    cursor: pointer;
    visibility: hidden;
    svg {
      path {
        stroke: #ccbbff;
      }
    }
    ${SubmissionFormLink}:hover & {
      visibility: visible;
    }
  }
`;

export const SubmissionFormLinkCloseIcon = styled(CloseModalIcon)``;

export const SubmissionFormError = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    ${({ theme }) => `
      color: ${theme.palette.red400};
    `}
  }
`;

export const SubmissionFormNewLink = styled(ButtonBase)`
  background: #282828;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: max-content;
  width: 40px;
  border-radius: 6px;
  height: 42px;
`;

export const SubmissionFormUploadFileButton = styled(ButtonBase)`
  background: #282828;
  padding: 12px;
  display: flex;
  align-items: center;
  height: 40px;
  justify-content: center;
  width: max-content;
  min-width: 40px;
  border-radius: 6px;
`;

export const SubmissionFormUploadFileButtonText = styled(Typography)`
  font-size: 14px;
  font-family: 'Space Grotesk';
  ${({ theme }) => `
    color: ${theme.palette.white}
  `};
`;

export const SubmissionFormUploadFileLoading = styled((props) => (
  <div {...props}>
    <FileLoading />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px; ;
`;

export const SubmissionFormButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  align-self: flex-end;
`;

export const SubmissionFormCancel = styled(ButtonBase)`
  height: 34px;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 30px;
  border-radius: 50px;
  font-family: 'Space Grotesk';
  font-size: 15px;
  ${({ theme }) => `
    background-color: ${theme.palette.black92};
    color: ${theme.palette.white};
    font-weight: ${theme.typography.fontWeightMedium};
  `};
`;

export const SubmissionFormSubmit = styled(Button)`
  && {
    ${GradientHighlightHorizontal}
    height: 34px;
    width: fit-content;
    min-height: 0;
    font-size: 15px;
    > button {
      font-family: 'Space Grotesk';
      font-size: 15px;
      ${({ theme }) => `
        font-weight: ${theme.typography.fontWeightMedium};
        background: ${theme.palette.black}
  `}
    }
  }
`;

export const TaskDescription = styled.p`
  color: #c4c4c4;
`;

export const TaskSectionDisplayLabel = styled.div`
  display: flex;
  align-items: center;
  min-width: 120px;
`;

export const SubmissionFormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SubmissionFormMediaItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
`;

export const SubmissionFormMediaItem = styled(MediaItem)`
  && {
    background: #282828;
    min-height: 40px;
    height: 100%;
    padding: 0;
    margin: 0;
    > * {
      font-weight: 500;
    }
  }
`;

export const SubmissionDisplayText = styled(Typography)`
  && {
    font-size: 14px;
    ${({ theme }) => `
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.palette.blue20};
 `}
  }
`;

export const TaskSectionInfoText = styled(SubmissionDisplayText)`
  && {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 12px;
    ${({ theme }) => `
    color: ${theme.palette.white};
 `}
  }
`;

export const SubmissionSection = styled.div`
  display: flex;
  align-items: center;
`;

export const TaskModalFooter = styled.div`
  margin-top: 16px;
`;

export const TaskSectionFooterTitleDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const TaskSubmissionTab = styled.div`
  flex: 1;
  margin-right: 16px;
  text-align: center;
  padding-bottom: 8px;
  cursor: pointer;
  &:last-child {
    margin-right: 0;
  }
  border-bottom: ${(props) => `2px solid ${props.isActive ? '#7427FF' : '#4B4B4B'}`};
`;

export const TaskSubmissionItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 18px;
`;

export const TaskSectionContent = styled.div`
  text-align: center;
  padding-top: 16px;
  padding-bottom: 20px;
  max-width: 630px;
`;
export const MakeSubmissionDiv = styled.div`
  background: #0f0f0f;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  align-items: center;
`;

export const SubmissionItemSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const SubmissionItemFooter = styled.div`
  width: 100%;
  display: flex;
  justify-content: right;
  align-items: center;
`;

export const SubmissionItemWrapper = styled.div`
  padding: 14px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  ${({ theme }) => `
    background: #1d1d1d;
  `}
`;

export const SubmissionItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SubmissionItemHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SubmissionItemCreator = styled(Typography)`
  && {
    font-size: 15px;
    ${({ theme }) => `
      color: ${theme.palette.white};
      font-weight: ${theme.typography.fontWeightBold};
    `}
  }
`;
export const SubmissionItemTimeText = styled(Typography)`
  && {
    font-size: 15px;
    ${({ theme }) => `
      color: ${theme.palette.grey57};
    `}
  }
`;

export const SubmissionItemSafeImage = styled(SafeImage)`
  width: 28px;
  height: 28px;
  border-radius: 50px;
`;

export const SubmissionItemStatusWrapper = styled.div`
  background: #2f2f2f;
  display: flex;
  align-items: center;
  gap: 5px;
  border-radius: 50px;
  height: 28px;
  padding: 2px 12px 2px 3px;
  svg {
    width: 24px;
    height: 24px;
  }
`;

const SubmissionItemStatusText = styled(Typography)`
  && {
    font-size: 14px;
    ${({ theme }) => `
      color: ${theme.palette.white};
      font-weight: ${theme.typography.fontWeightMedium};
    `}
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const SubmissionItemStatusTextAwaitingReview = styled(SubmissionItemStatusText)`
  background: -webkit-linear-gradient(#ffffff, #00baff);
`;

export const SubmissionItemStatusTextChangesRequested = styled(SubmissionItemStatusText)`
  background: -webkit-linear-gradient(#ffffff, #ffd653);
`;

export const SubmissionItemStatusChangesRequestedIcon = styled((props) => (
  <div {...props}>
    <ChangesRequestedIcon />
  </div>
))`
  background: #0f0f0f;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
`;

export const SubmissionItemStatusTextCompleted = styled(SubmissionItemStatusText)`
  background: -webkit-linear-gradient(#ffffff, #06ffa5);
`;

export const SubmissionItemsMedia = styled(TaskMedia)`
  ${MediaItemWrapper} {
    background: #282828;
    min-height: 40px;
    padding: 0;
    > * {
      font-weight: 500;
    }
  }
`;

export const TaskSubmissionLinkWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

export const TaskSubmissionLink = styled.a`
  && {
    color: white;
    font-size: 14px;
    font-family: Space Grotesk;
    background: #282828;
    padding: 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    height: 35px;
    width: max-content;
  }
`;

export const TaskSubmissionLinkIcon = styled(LinkIcon)``;

export const TaskMediaContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-left: 28px;
`;

export const SubmissionDescription = styled.div`
  && {
    font-size: 15px;
    line-height: 24px;
    ${({ theme }) => `
        font-weight: ${theme.typography.fontWeightRegular};
        color: ${theme.palette.white};
    `}
  }
`;
