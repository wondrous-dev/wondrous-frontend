import pluralize from 'pluralize';
import {
  TaskContentBountyCard,
  TaskContentBountyWrapper,
  TaskContentHeader,
  TaskContentPaidOut,
  TaskContentPaidOutPercentage,
  TaskContentPaidOutWrapper,
} from './styles';

export const TaskBountyOverview = (props) => {
  const { totalSubmissionsCount = 0, totalSubmissionsPaidCount = 0 } = props;
  const pluralizeSubmission = pluralize('submission', totalSubmissionsPaidCount);
  const taskPaidPercentage = (totalSubmissionsPaidCount / totalSubmissionsCount) * 100 || 0;
  return (
    <TaskContentBountyWrapper>
      <TaskContentBountyCard>
        <TaskContentHeader>
          {totalSubmissionsPaidCount} of {totalSubmissionsCount} {pluralizeSubmission} paid
        </TaskContentHeader>
        <TaskContentPaidOutWrapper>
          <TaskContentPaidOutPercentage>{taskPaidPercentage.toFixed(0)}%</TaskContentPaidOutPercentage>
          <TaskContentPaidOut variant="determinate" value={taskPaidPercentage} />
        </TaskContentPaidOutWrapper>
      </TaskContentBountyCard>
    </TaskContentBountyWrapper>
  );
};
