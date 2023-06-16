import { ButtonBase, ClickAwayListener, Grid, Popper } from "@mui/material";
import React, { useState } from "react";

export default function Dropdown(props) {
  const {
    DropdownHandler,
    children,
    divStyle,
    dropDownStyle = {},
    placement = "bottom-end",
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
      <ButtonBase
        onClick={handleOnClick}
        style={divStyle}
        disableRipple
        sx={{
          width: "fit-content",
          height: "fit-content",
          "background-color": "transparent",
        }}
      >
        <DropdownHandler {...props} />
      </ButtonBase>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          open={Boolean(selectedAnchorEl)}
          anchorEl={selectedAnchorEl}
          placement={placement}
          onClick={handleDefault}
          disablePortal={disablePortal}
          sx={{
            zIndex: "1000",
          }}
        >
          <Grid
            container
            maxWidth="fit-content"
            bgcolor={"white"}
            color={"black"}
            borderRadius="6px"
            border={`1px solid #4B4B4B`}
            display="flex"
            flexDirection="column"
            gap="6px"
            justifyContent="center"
            marginTop="4px"
            minHeight="30px"
            minWidth="185px"
            padding="0"
            width="fit-content"
            style={{ ...dropDownStyle }}
          >
            {children}
          </Grid>
        </Popper>
      </ClickAwayListener>
    </>
  );
}
