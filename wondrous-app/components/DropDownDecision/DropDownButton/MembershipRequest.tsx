import { useState } from 'react';
import ArrowDropDownIcon from '../../Icons/arrowDropDown';
import { DropDownPopper } from '../DropDownPopper/MembershipRequest';
import { StyledClickAwayListener, StyledDropDownButton, StyledDropDownButtonWrapper } from './styles';

export function DropDownButtonDecision(props) {
  const { requestId, orgId, podId, status } = props;
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
          <ArrowDropDownIcon style={{ height: '7px', width: '7px' }} />
        </StyledDropDownButton>
        <DropDownPopper
          onClose={() => setOpen(false)}
          id={id}
          requestId={requestId}
          open={open}
          orgId={orgId}
          podId={podId}
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
