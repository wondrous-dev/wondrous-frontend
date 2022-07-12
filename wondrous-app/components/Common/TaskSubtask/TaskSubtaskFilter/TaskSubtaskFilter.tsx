import { keys } from 'lodash';
import { useState } from 'react';
import { TASK_ICONS_LABELS } from '../TaskSubtasks';
import {
  TaskSubtasksFilterButtonIcon,
  TaskSubtasksFilterMenu,
  TaskSubtasksFilterMenuItem,
  TaskSubtasksFilterMenuItemIcon,
  TaskSubtasksFilterSelectButton,
  TaskSubtasksFilterSelectWrapper,
} from './styles';

const MilestoneTaskFilterSelected = ({ status }) => {
  const { Icon, label } = TASK_ICONS_LABELS[status];
  return (
    <TaskSubtasksFilterSelectWrapper>
      <TaskSubtasksFilterMenuItemIcon>
        <Icon />
      </TaskSubtasksFilterMenuItemIcon>
      {label}
    </TaskSubtasksFilterSelectWrapper>
  );
};

export const TaskSubtaskFilter = ({ status, setStatus }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (item) => () => {
    setStatus(item);
    handleClose();
  };
  const menuItems = keys(TASK_ICONS_LABELS);
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
};
