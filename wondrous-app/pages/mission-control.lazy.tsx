import MissionControl from 'components/MissionControl';
import TaskActionsProvider from 'utils/providers/TaskActionsProvider';

const MissionControlPage = () => (
  <TaskActionsProvider>
    <MissionControl />
  </TaskActionsProvider>
);

export default MissionControlPage;
