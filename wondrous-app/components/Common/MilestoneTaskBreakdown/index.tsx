import { useLazyQuery } from '@apollo/client';
import * as _ from 'lodash';
import { useEffect } from 'react';
import { GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE } from 'graphql/queries';
import * as Constants from 'utils/constants';
import { AwaitingPayment, Done, InProgress, InReview, ToDo } from '../../Icons';
import { ArchivedIcon } from '../../Icons/statusIcons';
import { StyledBox, StyledBoxWrapper } from './styles';

export const TASK_ICONS_LABELS = {
  [Constants.TASK_STATUS_TODO]: { icon: ToDo, label: 'To Do' },
  inProgress: { icon: InProgress, label: 'In Progress' },
  inReview: { icon: InReview, label: 'In Review' },
  [Constants.TASK_STATUS_DONE]: { icon: Done, label: 'Done' },
  awaitingPayment: { icon: AwaitingPayment, label: 'Awaiting Payment' },
  [Constants.TASK_STATUS_ARCHIVED]: { icon: ArchivedIcon, label: 'Archived' },
};

export const MilestoneTaskBreakdown = (props) => {
  const { milestoneId, open, className } = props;
  const [getPerStatusTaskCountForMilestone, { data }] = useLazyQuery(GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE);

  useEffect(() => {
    if (open || !data) {
      getPerStatusTaskCountForMilestone({
        variables: {
          milestoneId: milestoneId,
        },
      });
    }
  }, [getPerStatusTaskCountForMilestone, milestoneId, open, data]);

  return (
    <StyledBoxWrapper className={className}>
      {Object.keys(TASK_ICONS_LABELS).map((key, index) => {
        const { icon: StatusIcon, label } = TASK_ICONS_LABELS[key];
        const taskCount = data?.getPerStatusTaskCountForMilestone?.[key] || 0;
        return (
          <StyledBox key={index}>
            <StatusIcon /> {taskCount} {label}
          </StyledBox>
        );
      })}
    </StyledBoxWrapper>
  );
};
