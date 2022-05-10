import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE } from 'graphql/queries';
import {
  StyledBox,
  StyledProgressBar,
  StyledProgressBarWrapper,
  StyledTasksCount,
  StyledTasksLabel,
  StyledTextWrapper,
} from './styles';

export const MilestoneProgress = (props) => {
  const { milestoneId, color = '#396CFF' } = props;
  const [tasksTotal, setTaskTotal] = useState(null);
  const [tasksCompleted, setTaskCompleted] = useState(null);
  const [getPerStatusTaskCountForMilestone, { data }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE);

  useEffect(() => {
    getPerStatusTaskCountForMilestone({
      variables: {
        milestoneId: milestoneId,
      },
    });

    if (data?.getPerStatusTaskCountForMilestone) {
      const { getPerStatusTaskCountForMilestone: getPerStatusTaskCountForMilestoneData } = data;
      setTaskTotal(
        Object.values(getPerStatusTaskCountForMilestoneData)
          ?.filter((i) => typeof i === 'number')
          ?.reduce((a: number, b: number) => a + b, 0) ?? 0
      );
      setTaskCompleted(
        getPerStatusTaskCountForMilestoneData?.completed + getPerStatusTaskCountForMilestoneData?.archived
      );
    }

    if (!data?.getPerStatusTaskCountForMilestone) {
      setTaskTotal(0);
      setTaskCompleted(0);
    }
  }, [getPerStatusTaskCountForMilestone, milestoneId, data]);

  return (
    <StyledBox>
      <StyledTextWrapper>
        <StyledTasksLabel>Tasks</StyledTasksLabel>
        <StyledTasksCount>
          {tasksCompleted}/{tasksTotal}
        </StyledTasksCount>
      </StyledTextWrapper>
      <StyledProgressBarWrapper>
        <StyledProgressBar value={tasksCompleted} total={tasksTotal} color={color} />
      </StyledProgressBarWrapper>
    </StyledBox>
  );
};
