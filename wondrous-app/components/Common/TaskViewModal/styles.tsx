import { ButtonUnstyled } from '@mui/base';
import { Button, Grid, Menu, MenuItem, Modal, Tooltip, Typography } from '@mui/material';
import { Button as GradientButton } from 'components/Common/button';
import { Button as ComponentButton } from 'components/Button';
import { SafeImage } from 'components/Common/Image';
import { ToggleBoardPrivacyIcon } from 'components/Common/PrivateBoardIcon';
import Share from 'components/Common/Share';
import { CreateFormPreviewButton } from 'components/CreateEntity/styles';
import { EmptyStateGenericWrapper } from 'components/EmptyStateGeneric/styles';
import Arrow from 'components/Icons/arrow.svg';
import CalendarIcon from 'components/Icons/calendar';
import CloseModalIcon from 'components/Icons/closeModal';
import MilestoneIcon from 'components/Icons/milestoneField.svg';
import OpenInFullIcon from 'components/Icons/openInFull.svg';
import OpenInMinimizedViewIcon from 'components/Icons/openInMinimizedView.svg';
import PodIcon from 'components/Icons/podIcon';
import PointsIcon from 'components/Icons/pointsIcon2.svg';
import SnapshotLogoIcon from 'components/Icons/snapshotLogo.svg';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';
import { GradientHighlightHorizontal } from '../gradients';
import TaskMedia from '../TaskMedia';

export const TaskModal = styled(Modal)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 500;
  padding: 0 24px;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    padding: 0;
  }
`;

export const TaskModalCard = styled.div`
  width: 682px;
  margin: 0 auto;
  height: 95vh;
  overflow-y: scroll;
  background: #1d1d1d;
  outline: 1px solid #424242;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  &::-webkit-scrollbar {
    display: none;
  }
  ${({ fullScreen }) =>
    fullScreen &&
    `
    width: 1195px;
    gap: 0;
  `}

  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 100vh;
  }
`;

export const TaskModalHeader = styled.div`
  display: flex;
  align-items: center;
  background: ${palette.grey920};
  height: 56px;
  padding: 12px;
  justify-content: space-between;
`;

export const TaskModalHeaderWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const TaskModalHeaderWrapperRight = styled(TaskModalHeaderWrapper)`
  justify-content: flex-end;
`;

export const TaskModalHeaderPrivacyIcon = styled(ToggleBoardPrivacyIcon)`
  background: #212121;
  border-radius: 6px;
  width: 20px;
  height: 20px;
  svg {
    width: 13px;
    path {
      stroke: ${({ theme }) => theme.palette.white};
    }
  }
`;

export const TaskModalHeaderArrow = styled((props) => (
  <div {...props}>
    <Arrow />
  </div>
))`
  && {
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: center;
  }
`;

export const TaskModalHeaderTypography = styled(Typography)`
  && {
    ${({ theme }) =>
      `
    font-weight: ${theme.typography.fontWeightMedium};
    font-size: 13px;
    color: ${theme.palette.white};
  `}
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`;

export const TaskModalHeaderBackToList = styled(TaskModalHeaderTypography)`
  && {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const TaskModalHeaderOpenInFullIcon = styled((props) => (
  <div {...props}>{props.isFullScreen ? <OpenInMinimizedViewIcon /> : <OpenInFullIcon />}</div>
))`
  width: 32px;
  height: 32px;
  background: #171717;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    transform: scale(88%);
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    display: none;
  }
`;

export const TaskModalHeaderCloseModal = styled((props) => (
  <div {...props}>
    <CloseModalIcon />
  </div>
))`
  width: 32px;
  height: 32px;
  background: #171717;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  svg {
    transform: scale(88%);
  }
`;

export const TaskModalHeaderIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const TaskCardOrgPhoto = styled(SafeImage).attrs({ useNextImage: false })`
  width: 20px;
  height: 20px;
  border-radius: 4px;
`;

export const TaskCardOrgNoLogo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

export const TaskCardPodIcon = styled(PodIcon)`
  width: 20px;
  height: 20px;
`;

export const SubtaskIconWrapper = styled(TaskModalHeaderIconWrapper)`
  cursor: auto;
`;

export const SubtaskTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
`;

export const TaskModalHeaderShare = styled((props) => <Share {...props} />)`
  && {
    width: 32px;
    height: 32px;
    background: #171717;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    svg {
      width: 13px;
      path {
        stroke: ${({ theme }) => theme.palette.white};
      }
    }
  }
`;

export const TaskModalHeaderMenuButton = styled(ButtonUnstyled)`
  && {
    align-items: center;
    background: #171717;
    border-radius: 6px;
    border: none;
    display: flex;
    height: 32px;
    justify-content: center;
    outline: ${({ open }) => open && `1px solid #424242`};
    width: 32px;
    :hover,
    :active {
      cursor: pointer;
      background: #171717;
    }
    svg {
      circle {
        display: none;
      }
      path {
        stroke: #ffffff;
      }
    }
  }
`;

export const TaskModalHeaderMenu = styled(Menu)`
  && {
    .MuiMenu-paper {
      background: transparent;
      outline: 1px solid #424242;
    }
    .MuiMenu-list {
      min-width: fit-content;
      width: 150px;
      background: #1d1d1d;
      display: flex;
      padding: 0;
      flex-direction: column;
    }
  }
`;

export const TaskModalHeaderMenuItem = styled(MenuItem)`
  && {
    z-index: 1000;
    display: flex;
    justify-content: flex-start;
    color: ${({ theme, warning }) => (warning ? theme.palette.red800 : theme.palette.white)};
    height: 32px;
    font-size: 13px;
    padding: 12px;
    :hover {
      background: ${({ theme }) => theme.palette.black98};
    }
  }
`;

const TaskModalTaskDataFullScreen = css`
  display: grid;
  grid-template-columns: minmax(0, 6fr) 4fr;
  grid-template-rows: auto 1fr;
  row-gap: 36px;

  ${({ theme }) => theme.breakpoints.down('md')} {
    display: block;
  }
`;

export const TaskModalTaskDataMinimized = css`
  display: flex;
  flex-direction: column;
`;

export const TaskModalTaskData = styled.div`
  flex-grow: 1;
  ${({ fullScreen }) => (fullScreen ? TaskModalTaskDataFullScreen : TaskModalTaskDataMinimized)};
  ${({ hideRowGap }) => (hideRowGap ? 'row-gap: 0 !important' : '')};
`;

export const TaskModalTitleDescriptionMedia = styled.div`
  padding: 0 24px;
  ${({ fullScreen }) =>
    fullScreen &&
    `
    padding-top: 24px;
  `}
`;

export const TaskModalTitle = styled(Typography)`
  && {
    font-size: 24px;
    word-break: break-word;
    ${({ theme }) => `
    color: ${theme.palette.white};
    font-weight: ${theme.typography.fontWeightBold};
  `}
  }
`;

export const TaskModalTaskStatusMoreInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

export const TaskModalSnapshot = styled(Button)`
  && {
    align-items: center;
    background: transparent;
    display: flex;
    gap: 8px;
    height: 35px;
    margin: 0;
    border: 1px solid #ffa700;
  }
`;

export const TaskModalSnapshotLogo = styled(SnapshotLogoIcon)``;

export const TaskModalSnapshotText = styled(Typography)`
  && {
    font-size: 14px;
    ${({ theme }) => `
      font-weight: ${theme.typography.fontWeightRegular};
      color: ${theme.palette.white};
    `}
  }
`;

export const TaskDescriptionText = styled(Typography)`
  && {
    font-size: 15px;
    line-height: 24px;
    margin-top: 12px;
    overflow: hidden;
    position: relative;
    width: 100%;
    ${(props) => {
      const { isExpanded, initialHeight, theme } = props;
      return `
      font-weight: ${theme.typography.fontWeightRegular};
      height: ${isExpanded ? 'fit-content' : `${initialHeight}px`};
      color: inherit;
    ${
      !isExpanded &&
      `
      :after {
      background-image: linear-gradient(to bottom, rgba(29, 29, 29, 0.3), rgba(29, 29, 29, 1) 90%);
      bottom: 0;
      content: '';
      height: 50%;
      left: 0;
      pointer-events: none;
      position: absolute;
      width: 100%;
      z-index: 1;
    }
      `
    }
  `;
    }}
  }
`;

export const TaskDescriptionTextShowAllText = styled(Typography)`
  && {
    font-size: 14px;
    cursor: pointer;
    ${({ theme }) => `
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.palette.highlightBlue};
`};
  }
`;

export const TaskMediaWrapper = styled(TaskMedia)`
  margin-top: 18px;
`;

export const TaskSectionDisplayDivWrapper = styled.div`
  margin-top: 18px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  ${({ fullScreen }) =>
    fullScreen &&
    `
    background: #171717;
    grid-column-start: 2;
    grid-row-start: 1;
    grid-row-end: 3;
    padding-top: 24px;
    gap: 24px;
    margin-top: 0;
  `}
`;

export const TaskSectionDisplayData = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const TaskSectionDisplayDiv = styled.div`
  display: flex;
  align-items: ${({ alignItems }) => alignItems || 'center'};
`;

export const TaskSectionDisplayLabel = styled.div`
  display: flex;
  align-items: center;
  min-width: 120px;
`;

export const TaskSectionDisplayCreator = styled.div``;

export const TaskSectionDisplayContentWrapper = styled.div`
  display: flex;
  align-items: center;
  row-gap: 12px;
  column-gap: 36px;
  flex-flow: row wrap;
  width: 100%;
`;

export const TaskSectionTagWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-flow: row wrap;
`;

export const TaskSectionDisplayLabelText = styled(Typography)`
  && {
    background: #282828;
    padding: 4px 8px;
    font-size: 14px;
    height: 28px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    ${({ theme }) => `
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.palette.blue20};
 `}
  }
`;

export const TaskSectionImageContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

export const TaskSectionImageContentSafeImage = styled(SafeImage).attrs({ useNextImage: false })``;

export const TaskSectionImageContentImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  > * {
    width: 26px;
    height: 26px;
    border-radius: 50%;
  }
`;

const TaskSectionDisplayText = styled(Typography)`
  && {
    font-size: 14px;
    border-radius: 4px;
    ${({ theme }) => `
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.palette.blue20};
 `}
  }
`;

export const TaskSectionInfoText = styled(TaskSectionDisplayText)`
  && {
    font-size: 13px;
    display: flex;
    white-space: nowrap;
    align-items: center;
    gap: 12px;
    ${({ theme }) => `
    color: ${theme.palette.white};
 `}
  }
`;

export const TaskSectionInfoTextMilestone = styled(TaskSectionInfoText)`
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
`;

export const TaskSectionInfoTextUnderlined = styled(TaskSectionDisplayText)`
  && {
    text-decoration: underline;
    cursor: pointer;
    ${({ theme }) => `
    color: ${theme.palette.white};
 `}
  }
`;

export const TaskSectionInfoClose = styled.div`
  :hover {
    cursor: pointer;
  }
`;

export const WalletError = styled.div`
  && {
    background: #282828;
    height: 28px;
    width: fit-content;
    border-radius: 6px;
    padding: 12px 6px 12px 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
`;

export const WalletErrorText = styled(Typography)`
  && {
    font-size: 13px;
    line-height: 0;
    ${({ theme }) => `
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.palette.white};
 `}
  }
`;

export const TaskSectionInfoTakeTask = styled(GradientButton)`
  && {
    ${GradientHighlightHorizontal}
    min-height: 0;
    height: 26px;
    line-height: 0;
    button {
      padding: 0 8px 0 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
`;

export const TaskSectionInfoTakeTaskText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-weight: 500;
    line-height: 0;
    ${({ theme }) => `
        color: ${theme.palette.white};
      `}
  }
`;

export const TaskSectionInfoRecurringIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #282828;
  height: 26px;
  width: 26px;
  border-radius: 26px;
  svg {
    transform: scale(80%);
    path {
      stroke: #ccbbff;
    }
  }
`;

export const TaskSectionInfoCalendar = styled(({ className }) => (
  <div className={className}>
    <CalendarIcon />
  </div>
))`
  background-color: #282828;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 12px;
    height: 12px;
  }
`;

export const TaskSectionInfoPointsIcon = styled(({ className }) => (
  <div className={className}>
    <PointsIcon />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 12px;
    height: 12px;
  }
`;

export const ConnectToWalletButton = styled(GradientButton)`
  && {
    ${GradientHighlightHorizontal}
    min-height: 0;
    height: 26px;
    line-height: 0;
    button {
      padding: 0 14px;
      display: flex;
      align-items: center;
      font-family: 'Space Grotesk';
      font-size: 14px;
      font-weight: 500;
      line-height: 0;
      ${({ theme }) => `
        color: ${theme.palette.highlightBlue};
        background: #1d1d1d;
      `}
    }
  }
`;

export const TaskSectionInfoPoints = styled(TaskSectionInfoText)`
  && {
    background: -webkit-linear-gradient(#ffffff, #ffd653);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const TaskSectionInfoMilestoneIcon = styled(({ className }) => (
  <div className={className}>
    <MilestoneIcon />
  </div>
))`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    rect {
      fill: transparent;
    }
    path {
      stroke: ${palette.blue20};
    }
  }
`;

export const TaskSectionInfoPaymentMethodIcon = styled(SafeImage).attrs({ useNextImage: false })`
  && {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    img[style] {
      width: 100% !important;
      height: 100% !important;
    }
  }
`;

export const TaskSectionInfoPaymentMethodChain = styled(TaskSectionInfoText)`
  && {
    text-transform: capitalize;
    ${({ theme }) => `
      color: ${theme.palette.grey250};
    `}
  }
`;

export const TaskSectionInfoPaymentWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TaskSectionInfoPaymentAmount = styled(TaskSectionInfoText)`
  && {
    text-transform: capitalize;
    color: ${palette.white};
  }
`;

export const TaskSectionInfoTextCreator = styled(Typography)`
  && {
    font-size: 12px;
    ${({ theme }) => `
    color: ${theme.palette.white};
    font-weight: ${theme.typography.fontWeightBold};
 `}
  }
`;

export const TaskSectionInfoCreatorTask = styled.span`
  color: ${({ theme }) => theme.palette.grey250};
`;

export const TaskSectionInfoCreatorDaysAgo = styled.span`
  color: #848484;
  font-weight: 300;
`;

export const TaskSectionInfoDiv = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const TaskModalFooter = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  margin-top: ${({ fullScreen }) => (fullScreen ? 36 : 32)}px;
`;

export const TaskSectionFooterTitleDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 24px;
  overflow-x: auto;

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const TaskSubmissionTab = styled.div`
  text-align: center;
  cursor: pointer;
  position: relative;
  padding-bottom: 8px;
  ${({ isActive }) => `
    ${
      isActive &&
      `&::after {
        background-image: linear-gradient(270deg, #ccbbff 2.13%, #7427ff 48.52%, #00baff 100%);
        bottom: 0;
        content: '';
        height: 2px;
        left: 0;
        position: absolute;
        right: 0;
        width: 100%;
        z-index: 1;
    `
    }
  }
  `}
`;

export const TaskTabText = styled(Typography)`
  display: inline-flex;
  && {
    font-size: 14px;
    ${({ theme, isActive }) => `
      font-weight: ${isActive ? theme.typography.fontWeightMedium : theme.typography.fontWeightRegular};
      color: ${isActive ? `${theme.palette.white}` : '#828282'};
    `}
  }
`;

export const TabItemCount = styled.span`
  background: ${({ isActive }) => (isActive ? '#282828' : '#282828')};
  padding: 2px 8px;
  border-radius: 200px;
  margin-left: 4px;
`;

export const TaskSectionContent = styled.div`
  padding: 20px 24px;
  background-color: ${palette.grey125};
  flex-grow: 1;
`;

export const TaskStatusHeaderText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 14px;
  }
`;

export const TaskBorder = styled.div`
  margin-top: 18px;
  height: 1px;
  border-bottom: 1px dashed ${({ theme }) => theme.palette.grey75};
`;

export const ArchivedTaskUndo = styled.span`
  text-decoration: underline;
  :hover {
    cursor: pointer;
  }
`;

export const Tag = styled.div`
  background: rgba(64, 0, 181, 0.3);
  border-radius: 6px;
  padding: 1px 6px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => `
    color: ${theme.palette.white};
    border: 1px solid ${theme.palette.highlightPurple};
    font-weight: ${theme.typography.fontWeightMedium};
  `}
`;

export const GithubBlock = styled.div`
  display: flex;
  align-items: center;
`;

export const ActionButton = styled(CreateFormPreviewButton)`
  && {
    padding: 4px 16px;
    margin-left: 0;
    margin-right: 12px;
    display: flex;
    justify-content: space-between;
    gap: 4px;
    height: auto;
    z-index: 10;
    border: 1px solid transparent;
    :hover {
      background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    }
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      padding: 1px;
      border-radius: 180px;
    }

    ${({ theme }) => theme.breakpoints.down('sm')} {
      font-size: 15px;
    }
  }
  &.Mui-disabled {
    &::before {
      background: transparent;
    }
  }
`;

export const InfoPoint = styled(TaskSectionInfoCreatorDaysAgo)`
  && {
    padding-top: 6px;
    display: block;
    color: ${palette.grey57};
    font-size: 13px;
    font-weight: 500;
    line-height: 13px;
  }
`;

export const LockedTask = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  color: ${palette.white};
  font-weight: 600;
  flex-direction: column;
  gap: 15px;
  ${EmptyStateGenericWrapper} {
    width: 100%;
    height: 100%;
  }
`;

export const TaskIntiativesContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const AddReviewerButton = styled(ComponentButton)`
  && {
    width: 26px;
    min-height: 0;
    height: 26px;
    background: ${palette.grey920};
    border-radius: 4px;
    padding: 0;
    & > button {
      background: ${palette.grey920};
      width: 26px;
      height: 26px;
      &:hover {
        background: ${palette.grey920};
      }
    }
  }
`;

export const AddButtonGrid = styled(Grid)`
  && {
    display: none;
  }
`;

const EditIconCss = css`
  &:hover {
    .edit-icon-field {
      display: block;
    }
  }
`;

export const ViewFieldHoverWrapper = styled.div`
  display: flex;
  gap: 8px;
  padding: 2px 6px 2px 2px;
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: ${({ height }) => height ?? '28px'};
  cursor: pointer;
  .edit-icon-field {
    display: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.palette.grey87};
    width: ${({ $canEdit }) => ($canEdit ? '100%' : 'fit-content')};
  }
  ${({ $canEdit }) => ($canEdit ? EditIconCss : `pointer-events: none;`)};
`;

export const AssigneeReviewerContentWrapper = styled(Grid)`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 6px;
  &:hover {
    ${AddButtonGrid} {
      display: flex;
    }
    ${ViewFieldHoverWrapper} {
      background-color: ${({ $canEdit }) => $canEdit && palette.grey87};
      width: ${({ $canEdit }) => ($canEdit ? '100%' : 'fit-content')};
    }
  }
`;
export const ViewFieldWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 2px 4px 2px 4px;
  gap: 6px;
  height: 28px;
  border-radius: 4px;
  width: fit-content;
  background-color: ${({ theme, $background = '' }) => $background || theme.palette.grey920};
  ${ViewFieldHoverWrapper}:hover & {
    background: ${palette.grey87};
  }
`;

export const ViewFieldContainer = styled.div`
  width: 100%;
`;

export const UserSelectWrapper = styled(Grid)`
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  &:hover {
    ${AssigneeReviewerContentWrapper} {
      width: ${({ canEdit }) => canEdit && '100%'};
    }
  }
`;

export const ReviewerTooltip = styled(({ className, children, title, ...props }) => (
  <Tooltip {...props} title={title} classes={{ popper: className }}>
    {children}
  </Tooltip>
))`
  && {
    & .MuiTooltip-tooltipArrow {
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${palette.blue150};
      height: 28px;
      min-height: 0;
      color: ${palette.white};
      font-weight: 500;
      padding: 4px;
    }
    & .MuiTooltip-arrow {
      &:before {
        background: ${palette.blue150};
      }
    }
  }
`;
