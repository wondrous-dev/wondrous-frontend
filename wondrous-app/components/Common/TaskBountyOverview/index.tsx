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
  const { totalSubmissionsCount = 0, approvedSubmissionsCount = 0 } = props;
  const pluralizeSubmission = pluralize('submission', totalSubmissionsCount, true);
  const approvedSubmissionsPercentage = (approvedSubmissionsCount / totalSubmissionsCount) * 100 || 0;
  return (
    <TaskContentBountyWrapper>
      <TaskContentBountyCard>
        <TaskContentHeader>
          <TaskContentHeaderEntriesCount>{pluralizeSubmission}</TaskContentHeaderEntriesCount>
          <TaskContentHeaderPaidSubmissions>{approvedSubmissionsCount} approved</TaskContentHeaderPaidSubmissions>
        </TaskContentHeader>
        <TaskContentPaidOutWrapper>
          <TaskContentPaidOutPercentage>{approvedSubmissionsPercentage.toFixed(0)}%</TaskContentPaidOutPercentage>
          <TaskContentPaidOut variant="determinate" value={approvedSubmissionsPercentage} />
        </TaskContentPaidOutWrapper>
      </TaskContentBountyCard>
    </TaskContentBountyWrapper>
  );
};
