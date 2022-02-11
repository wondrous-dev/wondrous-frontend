import { useState } from 'react';
import ArrowDropDownIcon from '../../Icons/arrowDropDown';
import { DropDownPopper } from '../DropDownPopper';
import { StyledDropDownButton } from './styles';

export const DropDownButtonDecision = (props) => {
  const { taskId, status } = props;
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };
  const id = open ? 'simple-Popper' : undefined;
  return (
    <>
      <StyledDropDownButton aria-describedby={id} onClick={handleClick} className={open ? 'active' : ''} {...props}>
        <ArrowDropDownIcon />
      </StyledDropDownButton>
      <DropDownPopper
        status={status}
        taskId={taskId}
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        disablePortal={true}
        modifiers={{
          flip: {
            enabled: false,
          },
          preventOverflow: {
            enabled: false,
            boundariesElement: 'scrollParent',
          },
        }}
      />
    </>
  );
};
