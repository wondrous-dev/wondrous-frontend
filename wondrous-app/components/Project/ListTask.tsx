import PodIcon from 'components/Icons/podIcon';
import ListWrapper from './ListWrapper';
import ListItemTask from './ListItemTask';

const ListTask = () => (
  <ListWrapper
    HeaderTitleProps={{
      text: 'Task',
      IconComponent: PodIcon,
    }}
    CreateButtonProps={{
      onClick: () => null,
      text: 'Task',
    }}
    backgroundImageUrl="/images/project/task-empty-bg.svg"
    showAllOnClick={() => null}
    ListItemComponent={ListItemTask}
    // data={[
    //   {
    //     title: 'test task',
    //     date: new Date(),
    //     type: 'task',
    //     id: 1,
    //   },
    //   {
    //     title: 'test task',
    //     date: new Date(),
    //     type: 'task',
    //     id: 2,
    //   },
    //   {
    //     title: 'test task',
    //     date: new Date(),
    //     type: 'task',
    //     id: 3,
    //   },
    // ]}
  />
);

export default ListTask;
