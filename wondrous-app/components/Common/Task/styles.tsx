import { ButtonUnstyled } from '@mui/base';
import { Button, Menu, MenuItem, Modal, Typography } from '@mui/material';
import Arrow from 'components/Icons/arrow.svg';
import CalendarIcon from 'components/Icons/calendar';
import MilestoneIcon from 'components/Icons/milestoneField.svg';
import PodIcon from 'components/Icons/podIcon';
import PointsIcon from 'components/Icons/pointsIcon.svg';
import ProposalIcon from 'components/Icons/proposalIcon';
import styled from 'styled-components';
import { GetStatusIcon } from 'utils/common';
import { CreateFormPreviewButton, SnapshotButton } from '../../CreateEntity/styles';
import { BaseCard } from '../card';
import { GradientMidnightDiagonal, GradientMidnightVertical } from '../gradients';
import { SafeImage } from '../Image';
import { MilestoneTaskBreakdown } from '../MilestoneTaskBreakdown';
import { ToggleBoardPrivacyIcon } from '../PrivateBoardIcon';
import { Share } from '../Share';

export const TaskInner = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  flex-flow: column wrap;
  align-items: stretch;

  border-radius: 5px;
  padding: 4px;
  width: 100%;
  overflow: clip;

  ${GradientMidnightVertical}
`;

export const TaskWrapper = styled.div`
  display: flex;
  margin: ${(props) => (props.wrapped ? '0' : '1em 0 0 0')};

  padding: 1px;
  background: #515151;

  cursor: grab;

  ${GradientMidnightDiagonal}

  border-radius: ${(props) => (props.wrapped ? '0px' : '6px')};

  min-width: 290px;
  width: 100%;
  flex-wrap: wrap;
`;

export const TaskHeader = styled.div`
  display: flex;
  width: 100%;
  text-align: left;
  justify-content: flex-start;
  align-items: center;
`;

export const TaskHeaderIconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  & > * {
    margin-right: 4px;
  }
  & > *:last-child {
    margin-right: 0;
  }
`;

export const TaskContent = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-self: flex-start;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.palette.white};
  white-space: pre-line;
  cursor: pointer;
  overflow-x: hidden;
`;

export const TaskSeparator = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.palette.grey80};
  margin-top: 5px;
`;

export const TaskDivider = styled(TaskSeparator)`
  margin: 12px 0;
`;

export const MilestoneProgressWrapper = styled.div`
  margin: 12px 0;
`;

export const TaskCardDescriptionText = styled.p`
  overflow: hidden;
  overflow-wrap: break-word;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 0;
`;

export const TaskTitle = styled.div`
  display: flex;
  color: white;
  font-size: 16px;
  font-weight: bold;

  a {
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const TaskDescription = styled.p`
  color: #c4c4c4;
`;

export const TaskFooter = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: center;
  z-index: 100;
  margin-top: 22px;

  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  height: 19px;
  line-height: 19px;
`;

export const TaskAction = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-content: space-between;
  align-items: center;
`;

export const TaskActionMenu = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: flex-end;
  height: 24px;
  z-index: 100;
  align-items: center;
  > * {
    margin-left: 12px;
  }
`;

export const TaskActionAmount = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  padding-left: 10px;
  color: ${({ theme }) => theme.palette.grey250};
`;

export const TaskContentFooter = styled.div`
  display: flex;
  align-items: center;
`;

export const PodWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  margin-right: 6px;
  margin-top: 12px;
`;

export const PodName = styled(Typography)`
  && {
    background: #363636;
    font-size: 13px;
    color: ${({ theme }) => theme.palette.white};
    padding: 1px 8px;
    border-radius: 190px;
  }
`;

export const SubtaskCountWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  justify-content: center;
`;

export const SubtaskCount = styled(Typography)`
  && {
    font-size: 13px;
    font-style: normal;
    color: #ffffff;
  }
`;

export const TaskModal = styled(Modal)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TaskModalCard = styled.div`
  width: 682px;
  margin: 0 auto;
  height: 95vh;
  overflow-y: scroll;
  background: #1d1d1d;
  outline: 1px solid #424242;
  border-radius: 6px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TaskModalBaseCard = styled(BaseCard)`
  width: 680px;
  position: absolute;
  left: 50%;
  top: 50%;
  height: 80%;
  transform: translate(-50%, -50%);
  overflow-y: scroll;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(20, 20, 20) !important;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  & > div {
    width: 100%;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  @media (max-width: 680px) {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    transform: none;
  }
`;

export const TaskModalHeader = styled.div`
  display: flex;
  align-items: center;
  background: #171717;
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
  background: #2d2d2d;
  border-radius: 6px;
  width: 20px;
  height: 20px;
  svg {
    width: 12px;
    path {
      stroke: ${({ theme }) => theme.palette.white};
    }
  }
`;

export const TaskModalHeaderArrow = styled((props) => {
  return (
    <div {...props}>
      <Arrow />
    </div>
  );
})`
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
`;

export const TaskModalHeaderBackToList = styled(TaskModalHeaderTypography)`
  && {
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const TaskModalHeaderIconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const TaskModalIconTypeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const TaskCardOrgPhoto = styled(SafeImage)`
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

export const TaskIconLabel = styled(Typography)`
  && {
    font-size: 13px;
    margin-left: 8px;
    color: #fff;
  }
`;

export const SubtaskIconWrapper = styled(TaskModalHeaderIconWrapper)`
  cursor: auto;
`;

export const SubtaskIconLabel = styled(TaskIconLabel)``;

export const TaskModalHeaderShare = styled(Share)`
  && {
    width: 32px;
    height: 32px;
  }
`;

export const TaskModalHeaderMenuButton = styled(ButtonUnstyled)`
  && {
    align-items: center;
    background: #3131314d;
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
      background: ${({ theme }) => theme.palette.black98};
    }
    svg {
      circle {
        fill: transparent;
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
    display: flex;
    justify-content: flex-start;
    color: ${({ theme }) => theme.palette.white};
    height: 32px;
    font-size: 13px;
    padding: 12px;
    :hover {
      background: ${({ theme }) => theme.palette.black98};
    }
  }
`;

export const TaskModalHeaderMenuItemRed = styled(TaskModalHeaderMenuItem)`
  && {
    color: ${({ theme }) => theme.palette.red800};
  }
`;

export const TaskModalTaskData = styled.div`
  padding: 24px;
`;

export const TaskModalTitle = styled(Typography)`
  && {
    font-size: 24px;
    ${({ theme }) => `
    color: ${theme.palette.white};
    font-weight: ${theme.typography.fontWeightBold};
  `}
  }
`;

export const TaskModalStatusSnapshotWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
`;

export const TaskModalStatus = styled.div`
  background-color: #141414;
  max-width: fit-content;
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 8px 6px;
  gap: 8px;
  height: 35px;
`;

export const TaskModalStatusIcon = styled((props) => (
  <GetStatusIcon style={{ width: '18px', height: '18px' }} {...props} />
))``;

export const TaskModalStatusLabel = styled(Typography)`
  && {
    font-size: 14px;
    ${({ theme }) => `
    font-weight: ${theme.typography.fontWeightRegular};
    color: ${theme.palette.white};
  `}
  }
`;

export const TaskModalSnapshot = styled(SnapshotButton)`
  && {
    margin: 0;
    height: 35px;
    font-weight: ${({ theme }) => theme.typography.fontWeightRegular};
    font-size: 14px;
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
      color: #828282;
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

export const TaskDescriptionTextShowAll = styled(Button)`
  && {
    border-radius: 6px;
    max-width: fit-content;
    display: flex;
    gap: 12px;
    height: 35px;
    margin-top: 8px;
    ${({ theme }) => `
    background: #282828;
    :hover {
      background: #474747;
    }
`}
  }
`;

export const TaskDescriptionTextShowAllText = styled(Typography)`
  && {
    font-size: 14px;
    ${({ theme }) => `
    font-weight: ${theme.typography.fontWeightMedium};
    color: ${theme.palette.white};
`};
  }
`;

export const TaskDescriptionTextShowAllArrow = styled((props) => {
  return (
    <div {...props}>
      <Arrow />
    </div>
  );
})`
  && {
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: center;
    transform: ${({ isExpanded }) => (isExpanded ? `rotate(-90deg)` : `rotate(90deg)`)};
    svg {
      path {
        fill: ${({ theme }) => theme.palette.white};
      }
    }
  }
`;

export const TaskSectionDisplayDivWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 18px;
`;

export const TaskSectionDisplayDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const TaskSectionDisplayLabel = styled.div`
  display: flex;
  align-items: center;
  min-width: 120px;
`;

export const TaskSectionDisplayContentWrapper = styled.div`
  display: flex;
  align-items: center;
  row-gap: 12px;
  column-gap: 36px;
  flex-flow: row wrap;
`;

export const TaskSectionDisplayLabelText = styled(Typography)`
  && {
    background: #282828;
    padding: 4px 8px;
    font-size: 14px;
    height: 26px;
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
`;

export const TaskSectionImageContentSafeImage = styled(SafeImage)``;

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

export const TaskSectionDisplayText = styled(Typography)`
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
    align-items: center;
    gap: 12px;
    ${({ theme }) => `
    color: ${theme.palette.white};
 `}
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

export const TaskSectionInfoTextError = styled(TaskSectionDisplayText)`
  && {
    font-size: 13px;
    margin-top: 12px;
    ${({ theme }) => `
    font-weight: ${theme.typography.fontWeightRegular};
    color: ${theme.palette.red400};
 `}
  }
`;

export const TaskSectionInfoTakeTask = styled(Button)`
  && {
    font-size: 14px;
    height: 26px;
    padding: 8px 12px;
    ${({ theme }) => `
      background: ${theme.palette.background};
      border: 1px solid deepskyblue;
      color: ${theme.palette.white};
      font-weight: ${theme.typography.fontWeightMedium};
    `}
    &:disabled {
      color: #7a7a7a;
      border-color: #7a7a7a;
      cursor: not-allowed;
    }
  }
`;

export const TaskSectionInfoRecurringIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
  background-color: #282828;
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 12px;
    height: 12px;
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
  background-color: #b8255f;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const TaskSectionInfoPaymentMethodIcon = styled(SafeImage)`
  && {
    width: 26px;
    height: 26px;
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

export const TaskSectionMilestoneTaskBreakdown = styled(MilestoneTaskBreakdown)`
  margin-top: 12px;
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

export const TaskOverviewTab = styled.div`
  flex: 1;
  text-align: center;
`;
export const TaskTabText = styled(Typography)`
  && {
    font-weight: ${(props) => (props.isActive ? '500' : '400')};
    font-size: 16px;
    line-height: 24px;
    color: ${({ theme }) => theme.palette.white};
  }
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

export const MakePaymentDiv = styled.div`
  background: #0f0f0f;
  border-radius: 184px;
  padding: 12px;
  display: flex;
  align-items: center;
`;

export const TaskSubmissionItemDiv = styled.div`
  padding: 30px;
  &:not(:last-child) {
    border-bottom: 1px solid #363636;
  }

  & > :last-child {
    margin-bottom: 32px;
  }
`;

export const TaskSubmissionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

export const TaskSubmissionHeaderTextDiv = styled.div``;

export const TaskSubmissionHeaderCreatorText = styled(Typography)`
  && {
    color: ${({ theme }) => theme.palette.white};
    font-size: 13px;
    line-height: 20px;
    font-weight: bold;
    margin-right: 8px;
  }
`;
export const TaskSubmissionHeaderTimeText = styled(Typography)`
  && {
    color: #828282;
    font-size: 13px;
    line-height: 20px;
  }
`;

export const TaskStatusHeaderText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 14px;
  }
`;

export const TaskLink = styled.a`
  && {
    color: #00baff;
    font-size: 14px;
    font-family: Space Grotesk;
  }
`;

export const TaskSubmissionLink = styled(TaskLink)`
  && {
    margin-top: 8px;
    margin-right: 8px;
    max-width: 500px;
    overflow-x: scroll;
    text-align: left;
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

export const TaskMediaContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  margin-left: 28px;
`;

export const TaskListModalHeader = styled(Typography)`
  && {
    font-size: 18px;
    line-height: 26px;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.palette.white};
  }
`;

export const TaskListModalContentWrapper = styled.div`
  padding-bottom: 30px;
`;

export const TaskListCardWrapper = styled.div`
  background: #0f0f0f;
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 20px;
`;

export const ArchivedTaskUndo = styled.span`
  text-decoration: underline;
  :hover {
    cursor: pointer;
  }
`;

export const ActionButton = styled(CreateFormPreviewButton)`
  && {
    padding: 4px 16px;
    margin-left: 0;
    margin-right: 12px;
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
  }
`;

export const TaskUserDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const ProposalCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.palette.white};
  padding: 14px;
  margin: ${(props) => (props.wrapped ? '0' : '1em 0 0 0')};
  border-radius: 3px;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  gap: 14px;
  border: 0px solid transparent;
  border-radius: 5px;
  position: relative;
  height: fit-content;
  align-items: flex-start;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 5px;
    background: linear-gradient(169.47deg, rgba(75, 75, 75, 0.6) 7.84%, rgba(35, 35, 35, 0.6) 108.71%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
    pointer-events: none;
  }
`;

export const ProposalCardType = styled.div`
  color: ${({ theme }) => theme.palette.blue20};
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 17px;
`;

export const ProposalIconBackground = styled.div`
  background: ${({ theme }) => theme.palette.background.default};
  padding: 5px;
  border-radius: 180px;
`;

export const CheckedIconWrapper = styled.div`
  display: flex;
  background: ${({ theme }) => theme.palette.grey85};
  border-radius: 6px;
`;
const IconWrapper = styled.div`
  border-radius: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background: linear-gradient(196.76deg, #474747 -48.71%, #181818 90.48%);
`;
export const ProposalCardIcon = () => (
  <ProposalIconBackground>
    <IconWrapper>
      <ProposalIcon />
    </IconWrapper>
  </ProposalIconBackground>
);

export const ProposalFooterButton = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 7px 16px;
  position: relative;
  border-radius: 180px;
  ${({ isAction, borderColor, color }) => {
    if (isAction) {
      return `
      cursor: pointer;
      z-index: 100;
      background:#363636;
      `;
    } else {
      return `border: 1px solid ${borderColor || 'transparent'};
    color: ${({ theme }) => color || theme.palette.white};
     ${
       !borderColor &&
       `&::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 1px;
          border-radius: 180px;
      }`
     }`;
    }
  }};
`;

export const ProposalCardFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.palette.grey85};
  padding-bottom: 15px;
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

export const DueDateText = styled(Typography)`
  && {
    font-family: Space Grotesk;
    color: #c4c4c4;
    font-size: 13px;
    margin-right: 4px;
  }
`;

export const GithubBlock = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;
