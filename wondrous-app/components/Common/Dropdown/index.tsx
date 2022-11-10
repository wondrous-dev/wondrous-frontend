import { ClickAwayListener, Popper } from '@mui/material';
import { DropdownButton, DropdownWrapper } from 'components/Common/Dropdown/styles';
import React, { useState } from 'react';

export default function Dropdown(props) {
  const {
    DropdownHandler,
    children,
    divStyle,
    dropDownStyle = {},
    placement = 'bottom-end',
    disablePortal = false,
    setAnchorEl,
    anchorEl,
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
