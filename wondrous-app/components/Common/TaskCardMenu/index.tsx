import { Grid } from '@mui/material';
import Dropdown from 'components/Common/Dropdown';
import MoreIcon from 'components/Icons/more';
import keys from 'lodash/keys';
import { Item } from './styles';

const TaskCardMenu = ({
  canArchive = false,
  canDelete = false,
  canEdit = false,
  isTaskProposal = false,
  setArchiveTask = null,
  setCompleteModal = null,
  setDeleteTask = null,
  setDuplicate = null,
  setEditTask = null,
  taskType = null,
  setAnchorElParent = null,
  anchorElParent = null,
  open = false,
}) => {
  const menuItems = {
    Complete: {
      condition: setCompleteModal && canEdit,
      onClick: setCompleteModal,
    },
    Edit: {
      condition: setEditTask && canEdit,
      onClick: setEditTask,
    },
    Archive: {
      condition: setArchiveTask && canArchive && !isTaskProposal,
      onClick: setArchiveTask,
    },
    Duplicate: {
      condition: setDuplicate && canEdit,
      onClick: setDuplicate,
    },
    Delete: {
      condition: setDeleteTask && canDelete,
      onClick: setDeleteTask,
      warning: true,
    },
  };
  return (
    <Grid item container width="fit-content" display={open ? 'block' : 'none'} zIndex="1000">
      <Dropdown
        DropdownHandler={() => <MoreIcon stroke="white" />}
        setAnchorEl={setAnchorElParent}
        anchorEl={anchorElParent}
      >
        {keys(menuItems).map((item) => {
          const { onClick, ...props } = menuItems[item];

          return onClick ? (
            <Item
              key={item}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick(true);
                setAnchorElParent?.(null);
              }}
              data-cy={`task-header-option-${item}`}
              {...props}
            >
              {item} {taskType}
            </Item>
          ) : null;
        })}
      </Dropdown>
    </Grid>
  );
};

export default TaskCardMenu;
