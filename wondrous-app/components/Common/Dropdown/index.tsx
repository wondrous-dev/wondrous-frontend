import React, { useState } from 'react';
import { ClickAwayListener, Popper } from '@mui/material';
import { DropdownButton, DropdownWrapper } from './styles';

function Dropdown(props) {
  const {
    children,
    divStyle,
    dropDownStyle = {},
    placement = 'bottom-end',
    disablePortal = false,
    setAnchorEl,
    anchorEl,
    DropdownHandler,
  } = props;
  const [defaultAnchorEl, setDefaultAnchorEl] = useState(null);
  const selectedAnchorEl = setAnchorEl ? anchorEl : defaultAnchorEl;
  const selectedSetAnchorEl = setAnchorEl ?? setDefaultAnchorEl;

  const handleDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleOnClick = (e) => {
    handleDefault(e);
    selectedSetAnchorEl(selectedAnchorEl ? null : e.currentTarget);
  };

  const handleClickAway = (e) => {
    handleDefault(e);
    selectedSetAnchorEl(null);
  };

  return (
    <>
      <DropdownButton onClick={handleOnClick} style={divStyle} disableRipple>
        <DropdownHandler {...props} />
      </DropdownButton>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          open={Boolean(selectedAnchorEl)}
          anchorEl={selectedAnchorEl}
          placement={placement}
          onClick={handleDefault}
          disablePortal={disablePortal}
        >
          <DropdownWrapper style={{ ...dropDownStyle }}>{children}</DropdownWrapper>
        </Popper>
      </ClickAwayListener>
    </>
  );
}

export default Dropdown;
