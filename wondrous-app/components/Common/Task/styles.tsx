import styled from 'styled-components';
import { GradientMidnightDiagonal, GradientMidnightVertical } from '../gradients';
import { Grey80, Grey250, White, Blue20, Background, Grey85 } from '../../../theme/colors';
import { Typography } from '@material-ui/core';
import { BaseCard } from '../card';
import RightArrowIcon from '../../Icons/rightArrow';
import { CreateFormPreviewButton } from '../../CreateEntity/styles';
import ProposalIcon from 'components/Icons/proposalIcon';
export const TaskInner = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  flex-flow: column wrap;
  align-items: stretch;

  border-radius: 5px;
  padding: 14px;

  padding-bottom: 18px;
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

  margin: 0 0 17px 0;
`;

export const TaskHeaderIconWrapper = styled.div`
  display: flex;
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
  color: ${White};
  white-space: pre-line;
  cursor: pointer;
  overflow-x: hidden;
`;

export const TaskSeparator = styled.div`
  display: flex;
  border-bottom: 1px solid ${Grey80};
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
`;

export const TaskDescription = styled.p`
  color: #c4c4c4;
`;

export const TaskFooter = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: center;

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
  flext-content: flex-start;
  align-content: space-between;
  margin-right: 30px;
`;

export const TaskActionMenu = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: flex-end;
  height: 24px;
`;

export const TaskActionAmount = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-start;
  padding-left: 10px;
  color: ${Grey250};
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
  margin-top: 24px;
`;

export const PodName = styled(Typography)`
  && {
    background: #363636;
    font-size: 13px;
    color: ${White};
    padding: 1px 8px;
    border-radius: 190px;
  }
`;

export const SubtaskCountWrapper = styled.div`
  background: #0f0f0f;
  display: flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  justify-content: center;
`;

export const SubtaskCount = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-style: normal;
    color: #ffffff;
  }
`;

export const TaskModal = styled(BaseCard)`
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
  margin-bottom: 24px !important;
`;

export const RightArrowWrapper = styled.div`
  margin-left: 12px;
`;

export const RightArrow = styled(RightArrowIcon)``;

export const PodNameTypography = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
    color: ${White};
  }
`;

export const TaskIconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  cursor: pointer;
`;

export const TaskIconLabel = styled(Typography)`
  && {
    font-size: 13px;
    margin-left: 8px;
    color: #fff;
  }
`;

export const SubtaskIconWrapper = styled(TaskIconWrapper)`
  cursor: auto;
`;

export const SubtaskIconLabel = styled(TaskIconLabel)``;

export const TaskTitleDiv = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const TaskTitleTextDiv = styled.div``;

export const TaskTitleText = styled(Typography)`
  && {
    color: ${White};
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 32px;
    margin-bottom: 8px;
  }
`;

export const TaskDescriptionText = styled(Typography)`
  && {
    color: #828282;
    font-weight: 500;
    font-size: 15px;
    line-height: 19px;
    white-space: pre-line;
    max-width: 600px;
    overflow-x: scroll;
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

export const TaskSectionDisplayDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  & > *:not:first-child {
    margin-top: -8px;
  }
`;

export const TaskSectionDisplayLabel = styled.div`
  background: #0f0f0f;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 4px 12px;
  margin-top: 8px;
`;

export const TaskSectionDisplayText = styled(Typography)`
  && {
    font-family: Space Grotesk;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    color: #ccbbff;
    margin-left: 8px;
  }
`;

export const TaskSectionInfoText = styled(TaskSectionDisplayText)`
  && {
    color: #c4c4c4;
  }
`;

export const TaskSectionInfoDiv = styled.div`
  margin-right: 12px;
  margin-left: 12px;
  display: flex;
  align-items: center;
  text-align: left;
  margin-top: 8px;
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
    color: ${White};
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
    color: ${White};
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
    color: ${White};
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

export const ClaimButton = styled(CreateFormPreviewButton)`
  && {
    padding: 4px 8px;
    margin-left: 0;
    margin-right: 12px;
    height: auto;

    :hover {
      background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
      border: 1px solid #7427ff;
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
  color: ${White};
  padding: 10px;
  margin: ${(props) => (props.wrapped ? '0' : '1em 0 0 0')};
  border-radius: 3px;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  gap: 14px;
  border: 1px solid transparent;
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
  }
`;

export const ProposalCardType = styled.div`
  color: ${Blue20};
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  line-height: 17px;
`;

export const ProposalIconBackground = styled.div`
  background: ${Background};
  padding: 5px;
  border-radius: 180px;
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
  font-family: 'Space Grotesk';
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
    color: ${color || White};
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
  border-top: 1px solid ${Grey85};
  padding-bottom: 15px;
`;
