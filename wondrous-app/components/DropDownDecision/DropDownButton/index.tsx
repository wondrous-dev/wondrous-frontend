import { useState } from 'react';
import ArrowDropDownIcon from '../../Icons/arrowDropDown';
import { DropDownPopper } from '../DropDownPopper';
import { StyledClickAwayListener, StyledDropDownButton, StyledDropDownButtonWrapper } from './styles';

export function DropDownButtonDecision(props) {
  const { task, status, openKudos, setKudosTask } = props;
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };
  const handleOnClickAway = () => {
    setOpen(false);
    setAnchorEl(null);
  };
  const id = open ? 'simple-Popper' : undefined;
  return (
    <StyledClickAwayListener onClickAway={handleOnClickAway}>
      <StyledDropDownButtonWrapper>
        <StyledDropDownButton aria-describedby={id} onClick={handleClick} className={open ? 'active' : ''} {...props}>
          <ArrowDropDownIcon />
        </StyledDropDownButton>
        <DropDownPopper
          onClose={() => setOpen(false)}
          status={status}
          task={task}
          id={id}
          open={open}
          openKudos={openKudos}
          setKudosTask={setKudosTask}
          anchorEl={anchorEl}
          placement="bottom-start"
          disablePortal
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
      </StyledDropDownButtonWrapper>
    </StyledClickAwayListener>
  );
}
