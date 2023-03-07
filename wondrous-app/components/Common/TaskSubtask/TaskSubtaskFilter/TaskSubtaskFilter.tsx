import { TASK_ICONS_LABELS } from 'components/Common/TaskSubtask/TaskSubtasks';
import keys from 'lodash/keys';
import { useState } from 'react';
import {
  TaskSubtasksFilterButtonIcon,
  TaskSubtasksFilterMenu,
  TaskSubtasksFilterMenuItem,
  TaskSubtasksFilterMenuItemIcon,
  TaskSubtasksFilterSelectButton,
  TaskSubtasksFilterSelectWrapper,
} from './styles';

function MilestoneTaskFilterSelected({ status }) {
  const { Icon, label } = TASK_ICONS_LABELS[status];
  return (
    <TaskSubtasksFilterSelectWrapper>
      <TaskSubtasksFilterMenuItemIcon>
        <Icon />
      </TaskSubtasksFilterMenuItemIcon>
      {label}
    </TaskSubtasksFilterSelectWrapper>
  );
}

const useAnchorEl = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  return { anchorEl, handleClick, handleClose, open };
};

export function TaskSubtaskFilter({ status, setStatus }) {
  const { anchorEl, handleClick, handleClose, open } = useAnchorEl();
  const handleSelect = (item) => () => {
    setStatus(item);
    handleClose();
  };
  const menuItems = keys(TASK_ICONS_LABELS);
  console.log(menuItems, 'menu items');
  return (
    <>
      <TaskSubtasksFilterSelectButton onClick={handleClick} open={open}>
        <MilestoneTaskFilterSelected status={status} />
        <TaskSubtasksFilterButtonIcon open={open} />
      </TaskSubtasksFilterSelectButton>
      <TaskSubtasksFilterMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menuItems.map((item) => {
          const { Icon, label } = TASK_ICONS_LABELS[item];
          return (
            <TaskSubtasksFilterMenuItem key={label} onClick={handleSelect(item)}>
              <TaskSubtasksFilterMenuItemIcon>
                <Icon />
              </TaskSubtasksFilterMenuItemIcon>
              {label}
            </TaskSubtasksFilterMenuItem>
          );
        })}
      </TaskSubtasksFilterMenu>
    </>
  );
}
