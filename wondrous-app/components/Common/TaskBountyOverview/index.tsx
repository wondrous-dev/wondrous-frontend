import { AvatarList } from '../AvatarList';
import {
  TaskContentBountyCard,
  TaskContentBountyWrapper,
  TaskContentHeader,
  TaskContentPaidOut,
  TaskContentPaidOutPercentage,
  TaskContentPaidOutWrapper,
} from './styles';
import pluralize from 'pluralize';

export const TaskBountyOverview = (props) => {
  const { totalSubmissionsCount = 0, totalSubmissionsPaidCount = 0 } = props;
  const entriesText = pluralize('entry', totalSubmissionsCount, true);
  const taskPaidPercentage = (totalSubmissionsPaidCount / totalSubmissionsCount) * 100;
  return (
    <TaskContentBountyWrapper>
      <TaskContentBountyCard>
        <TaskContentHeader>{entriesText}</TaskContentHeader>
        <AvatarList />
      </TaskContentBountyCard>
      <TaskContentBountyCard>
        <TaskContentHeader>{totalSubmissionsPaidCount} paid out</TaskContentHeader>
        <TaskContentPaidOutWrapper>
          <TaskContentPaidOutPercentage>{taskPaidPercentage.toFixed(0)}%</TaskContentPaidOutPercentage>
          <TaskContentPaidOut variant="determinate" value={taskPaidPercentage} />
        </TaskContentPaidOutWrapper>
      </TaskContentBountyCard>
    </TaskContentBountyWrapper>
  );
};
