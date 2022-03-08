import pluralize from 'pluralize';
import {
  TaskContentBountyCard,
  TaskContentBountyWrapper,
  TaskContentHeader,
  TaskContentHeaderEntriesCount,
  TaskContentHeaderPaidSubmissions,
  TaskContentPaidOut,
  TaskContentPaidOutPercentage,
  TaskContentPaidOutWrapper,
} from './styles';

export const TaskBountyOverview = (props) => {
  const { totalSubmissionsCount = 0, totalSubmissionsPaidCount = 0 } = props;
  const pluralizeSubmission = pluralize('submission', totalSubmissionsCount, true);
  const taskPaidPercentage = (totalSubmissionsPaidCount / totalSubmissionsCount) * 100 || 0;
  return (
    <TaskContentBountyWrapper>
      <TaskContentBountyCard>
        <TaskContentHeader>
          <TaskContentHeaderEntriesCount>{pluralizeSubmission}</TaskContentHeaderEntriesCount>
          <TaskContentHeaderPaidSubmissions>{totalSubmissionsPaidCount} paid out</TaskContentHeaderPaidSubmissions>
        </TaskContentHeader>
        <TaskContentPaidOutWrapper>
          <TaskContentPaidOutPercentage>{taskPaidPercentage.toFixed(0)}%</TaskContentPaidOutPercentage>
          <TaskContentPaidOut variant="determinate" value={taskPaidPercentage} />
        </TaskContentPaidOutWrapper>
      </TaskContentBountyCard>
    </TaskContentBountyWrapper>
  );
};
