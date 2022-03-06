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

export const TaskContentBounty = (props) => {
  const {} = props;
  const taskContentPaid = (50 / 100) * 100;
  const entriesText = pluralize('entry', 100, true);
  return (
    <TaskContentBountyWrapper>
      <TaskContentBountyCard>
        <TaskContentHeader>{entriesText}</TaskContentHeader>
        <AvatarList />
      </TaskContentBountyCard>
      <TaskContentBountyCard>
        <TaskContentHeader>500 paid out</TaskContentHeader>
        <TaskContentPaidOutWrapper>
          <TaskContentPaidOutPercentage>{taskContentPaid}%</TaskContentPaidOutPercentage>
          <TaskContentPaidOut variant="determinate" value={taskContentPaid} />
        </TaskContentPaidOutWrapper>
      </TaskContentBountyCard>
    </TaskContentBountyWrapper>
  );
};
