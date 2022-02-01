import styled from 'styled-components';
import { GradientMidnightDiagonal, GradientMidnightVertical } from '../gradients';
import { Grey80, White } from '../../../theme/colors';
import { Typography } from '@material-ui/core';
import { BaseCard } from '../card';

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
  min-height: 216px;
`;

export const TaskHeader = styled.div`
  display: flex;
  width: 100%;
  text-align: left;

  margin: 0 0 17px 0;
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
`;

export const TaskSeparator = styled.div`
  display: flex;
  border-bottom: 1px solid ${Grey80};
  margin-top: 5px;
`;

export const MilestoneIconWrapper = styled.div`
  margin-left: ${(props) => (props.withProfile ? '6px' : '0')};
`

export const MilestoneSeparator = styled(TaskSeparator)`
  margin: 12px 0;
`

export const MilestoneProgressWrapper = styled.div`
  margin-bottom: 12px;
`

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
`;

export const PodWrapper = styled.div`
  background: #363636;
  padding: 1px 8px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 16px;
  width: fit-content;
`;

export const PodName = styled(Typography)`
  && {
    font-size: 13px;
    color: ${White};
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

  &:-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const TaskModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px !important;
`;
export const PodNameTypography = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
    color: ${White};
  }
`;

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
  margin-top: 24px;
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
`;

export const TaskOverviewTab = styled.div`
  flex: 1;
  text-align: center;
`;
export const TaskTabText = styled(Typography)`
  && {
    font-size: 16px;
    line-height: 24px;
    color: ${White};
  }
`;

export const TaskSectionContent = styled.div`
  text-align: center;
  padding-top: 16px;
  padding-bottom: 20px;
`;
export const MakeSubmissionDiv = styled.div`
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
    margin-left: 8px;
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

