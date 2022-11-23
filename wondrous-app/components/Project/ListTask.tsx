import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import ListItemTask from './ListItemTask';
import ListWrapper from './ListWrapper';

const ListTask = () => (
  <ListWrapper
    HeaderTitleProps={{
      text: 'Task',
      IconComponent: CheckBoxIcon,
    }}
    CreateButtonProps={{
      onClick: () => null,
      text: 'Task',
    }}
    backgroundImageUrl="/images/project/task-empty-bg.svg"
    showAllUrl="boards?entity=task"
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
