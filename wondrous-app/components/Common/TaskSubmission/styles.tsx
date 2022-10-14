import { ButtonBase, InputAdornment, InputBase, Menu, MenuItem, Typography } from '@mui/material';
import Button from 'components/Button';
import { Button as ButtonGradient } from 'components/Common/button';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import { GradientHighlightHorizontal } from 'components/Common/gradients';
import { SafeImage } from 'components/Common/Image';
import TaskMedia from 'components/Common/TaskMedia';
import { MediaItem } from 'components/CreateEntity/MediaItem';
import { MediaItemWrapper } from 'components/CreateEntity/MediaItem/styles';
import Arrow from 'components/Icons/arrow.svg';
import ChangesRequestedIcon from 'components/Icons/changesRequestedIcon.svg';
import CloseModalIcon from 'components/Icons/closeModal';
import { EmptyStateSubmissionsIcon } from 'components/Icons/emptyStates';
import FilterStatusIcon from 'components/Icons/filterStatusIcon.svg';
import LeftArrowIcon from 'components/Icons/leftArrow';
import LinkIcon from 'components/Icons/linkSubmissionIcon.svg';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const TaskSubmissionEmptyStateContainer = styled.div`
  width: 100%;
  padding: 14px 0;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
`;

export const TaskSubmissionEmptyStateIcon = styled(EmptyStateSubmissionsIcon)``;

export const TaskSubmissionEmptyStateText = styled(Typography)`
  && {
    font-size: 13px;
    font-weight: 400;
    color: ${({ theme }) => theme.palette.grey57};
    text-align: center;
  }
`;

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

export const SubmissionButtonCreate = styled(ButtonGradient)`
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
  && {
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
  }
`;

const ButtonStyle = css`
  && {
    border-radius: 100px;
    color: ${palette.white};
    font-family: ${typography.fontFamily};
    font-weight: 500;
    height: 30px;
    min-height: fit-content;
    width: fit-content;
    z-index: 1;
    > button {
      background: ${palette.background.default};
      height: 28px;
      font-size: 14px;
      line-height: 0;
      font-family: ${typography.fontFamily};
      font-weight: 500;
      padding: 0 16px;
      :hover {
        background: ${palette.background.default};
      }
    }
  }
`;

export const SubmissionButtonRequestChange = styled(Button)`
  && {
    ${ButtonStyle}
    background: linear-gradient(270deg, #ffd653 -5.62%, #7427ff 103.12%);
  }
`;

export const SubmissionButtonReject = styled(Button)`
  && {
    ${ButtonStyle}
    background: linear-gradient(270deg, #f93701 -5.62%, #7427ff 103.12%);
  }
`;

export const SubmissionButtonApprove = styled(Button)`
  && {
    ${ButtonStyle}
    background: linear-gradient(270deg, #06ffa5 -5.62%, #7427ff 103.12%);
  }
`;

export const SubmissionFilterCreateWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SubmissionFilterSelectButton = styled(ButtonBase)`
  && {
    align-items: center;
    background: #1b1b1b;
    border-radius: 6px;
    border: 1px solid ${({ open }) => (open ? `#424242` : '#1b1b1b')};
    color: white;
    display: flex;
    font-family: 'Space Grotesk';
    font-size: 15px;
    gap: 8px;
    height: 40px;
    justify-content: space-between;
    max-width: fit-content;
    min-width: 245px;
    padding: 8px;
  }
`;

export const SubmissionFilterButtonIcon = styled((props) => (
  <div {...props}>
    <Arrow />
  </div>
))`
  && {
    transform: rotate(${({ open }) => (open ? `-90` : `90`)}deg);
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: center;
  }
`;

export const SubmissionFilterSelectMenu = styled(Menu)`
  && {
    .MuiMenu-list,
    .MuiMenu-paper {
      padding: 0;
      background-color: #1b1b1b;
      min-width: 245px;
      outline: 1px solid #424242;
    }
  }
`;

export const SubmissionFilterSelectItem = styled(MenuItem)`
  && {
    background: #1b1b1b;
    color: white;
    padding: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    cursor: pointer;
    :hover {
      background: ${({ theme }) => theme.palette.black98};
    }
    > svg {
      width: 26px;
      height: 26px;
    }
  }
`;

export const SubmissionFilterSelectRender = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  > svg {
    width: 26px;
    height: 26px;
  }
`;

export const SubmissionFilterStatusIcon = styled(({ className }) => (
  <div className={className}>
    <FilterStatusIcon />
  </div>
))`
  && {
    background: #0f0f0f;
    height: 26px;
    width: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
  }
`;

export const TaskSubmissionsFormInactiveWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const SubmissionFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 18px;
`;

export const SubmissionFormBackButton = styled(ButtonBase)`
  && {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 32px;
    align-self: flex-start;
  }
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
  && {
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
      ::placeholder {
        ${({ theme }) => `
        color: ${theme.palette.white};
      `}
        opacity: 0.33;
      }
    }
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
  && {
    align-items: center;
    background: #282828;
    border-radius: 6px;
    display: flex;
    height: 42px;
    justify-content: center;
    padding: 12px;
    width: 40px;
  }
`;

export const SubmissionFormUploadFileButton = styled(ButtonBase)`
  && {
    background: #282828;
    padding: 12px;
    display: flex;
    align-items: center;
    height: 40px;
    justify-content: center;
    width: max-content;
    min-width: 40px;
    border-radius: 6px;
  }
`;

export const SubmissionFormUploadFileButtonText = styled(Typography)`
  && {
    font-size: 14px;
    font-family: 'Space Grotesk';
    ${({ theme }) => `
    color: ${theme.palette.white}
  `};
  }
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
  && {
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
  }
`;

export const HideSubmissionsCheckBoxDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-top: -12px;
`;

export const HideSubmissionsHelperText = styled(Typography)`
  && {
    font-size: 12px;
    ${({ theme }) => `
      color: ${theme.palette.white};
      font-weight: ${theme.typography.fontWeightMedium};
    `}
  }
`;
export const SubmissionFormSubmit = styled(ButtonGradient)`
  && {
    ${GradientHighlightHorizontal}
    height: 34px;
    width: fit-content;
    min-height: 0;
    font-size: 15px;
    > button {
      font-family: 'Space Grotesk';
      font-size: 15px;
      padding: 8px 30px;
      ${({ theme }) => `
        font-weight: ${theme.typography.fontWeightMedium};
        background: ${theme.palette.black}
  `}
    }
  }
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

export const TaskSubmissionItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 18px;
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
  background: #1d1d1d;
  ${({ highlight }) =>
    highlight &&
    `
  @keyframes highlightSubmission {
  from {
    background: ${palette.grey250};
 }
  to {
    background: transparent;
  }
}
  animation-name: highlightSubmission;
  animation-duration: 2s;
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

export const SubmissionItemUserLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
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

export const SubmissionItemSafeImage = styled(SafeImage).attrs({ useNextImage: false })`
  width: 28px;
  height: 28px;
  border-radius: 50px;
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

export const TaskSubmissionLinkText = styled.p`
  max-width: 580px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

export const GiveKudosButton = styled(ButtonBase)`
  && {
    background: #313131;
    color: #ccbbff;
    height: 40px;
    width: fit-content;
    font-family: ${typography.fontFamily};
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 10px;
    border-radius: 6px;
    margin-top: 12px;
    gap: 8px;
    svg {
      path {
        fill: #00baff;
      }
    }
  }
`;
