import { useState } from 'react';
import ArrowDropDownIcon from '../../Icons/arrowDropDown';
import { DropDownPopper } from '../DropDownPopper/MembershipRequest';
import { StyledDropDownButton } from './styles';

export const DropDownButtonDecision = (props) => {
  const { userId, orgId, status } = props;
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
        onClose={() => setOpen(false)}
        id={id}
        open={open}
        userId={userId}
        orgId={orgId}
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
