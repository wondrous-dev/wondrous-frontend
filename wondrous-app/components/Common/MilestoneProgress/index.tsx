import useGetMilestoneTasksProgress from 'hooks/useGetMilestoneTasksProgress';

import {
  MilestoneProgressBarWrapper,
  MilestoneProgressLabel,
  MilestoneProgressViewModalWrapper,
  StyledBox,
  StyledProgressBar,
  StyledProgressBarWrapper,
  StyledTasksCount,
  StyledTasksLabel,
  StyledTextWrapper,
} from './styles';

export function MilestoneProgress(props) {
  const { milestoneId } = props;
  const { tasksTotal, tasksCompleted, progress } = useGetMilestoneTasksProgress({ milestoneId });
  if (!tasksTotal) return <StyledTasksCount>No tasks</StyledTasksCount>;
  return (
    <StyledBox>
      <StyledTextWrapper>
        <StyledTasksLabel>Task progress</StyledTasksLabel>
        <StyledTasksCount>{progress}%</StyledTasksCount>
      </StyledTextWrapper>
      <StyledProgressBarWrapper>
        <StyledProgressBar value={tasksCompleted} total={tasksTotal} />
      </StyledProgressBarWrapper>
    </StyledBox>
  );
}

export function MilestoneProgressViewModal({ milestoneId, isMilestone }) {
  const { tasksTotal, tasksCompleted, progress } = useGetMilestoneTasksProgress({ milestoneId });
  if (!isMilestone) return null;
  return (
    <MilestoneProgressViewModalWrapper>
      <MilestoneProgressLabel>{progress}% complete</MilestoneProgressLabel>
      <MilestoneProgressBarWrapper>
        <StyledProgressBar value={tasksCompleted} total={tasksTotal} />
      </MilestoneProgressBarWrapper>
    </MilestoneProgressViewModalWrapper>
  );
}
