import { isEmpty, keys } from 'lodash';
import { useState } from 'react';
import { TASK_ICONS_LABELS } from '../MilestoneTasks';
import {
  MilestoneTaskFilterButtonIcon,
  MilestoneTaskFilterMenu,
  MilestoneTaskFilterMenuItem,
  MilestoneTaskFilterSelectButton,
  MilestoneTaskFilterSelectWrapper,
  MilestoneTaskFilterStatusIcon,
} from './styles';

const MilestoneTaskFilterSelected = ({ status }) => {
  if (isEmpty(status)) {
    return (
      <MilestoneTaskFilterSelectWrapper>
        <MilestoneTaskFilterStatusIcon /> Status
      </MilestoneTaskFilterSelectWrapper>
    );
  }
  const { Icon, label } = TASK_ICONS_LABELS[status];
  return (
    <MilestoneTaskFilterSelectWrapper>
      <Icon /> {label}
    </MilestoneTaskFilterSelectWrapper>
  );
};

export const MilestoneTaskFilter = ({ status, setStatus }) => {
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
      <MilestoneTaskFilterSelectButton onClick={handleClick} open={open}>
        <MilestoneTaskFilterSelected status={status} />
        <MilestoneTaskFilterButtonIcon open={open} />
      </MilestoneTaskFilterSelectButton>
      <MilestoneTaskFilterMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {menuItems.map((item) => {
          const { Icon, label } = TASK_ICONS_LABELS[item];
          return (
            <MilestoneTaskFilterMenuItem key={label} onClick={handleSelect(item)}>
              <Icon /> {label}
            </MilestoneTaskFilterMenuItem>
          );
        })}
      </MilestoneTaskFilterMenu>
    </>
  );
};
