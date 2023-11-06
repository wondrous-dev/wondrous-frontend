import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { ButtonBase, ClickAwayListener, Grid, Popper } from "@mui/material";

const ContextMenu = ({ renderButtons }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
      <div>
        <ButtonBase
          onClick={(e) => setAnchorEl(anchorEl ? null : e.currentTarget)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "100%",
            padding: "4px",
            transition: "background 0.1s ease-in-out",
            ":hover": {
              background: "#E8E8E8",
            },
          }}
        >
          <MoreVertIcon
            sx={{
              color: "black",
            }}
          />
        </ButtonBase>

        <Popper
          open={!!anchorEl}
          anchorEl={anchorEl}
          placement="bottom"
          sx={{
            zIndex: 9999,
          }}
        >
          <Grid
            bgcolor="white"
            zIndex="100"
            border="1px solid #000000"
            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
            borderRadius="6px"
            container
            width="100%"
            direction={"column"}
            gap="10px"
            maxHeight="500px"
            overflow="scroll"
            flexWrap="nowrap"
            padding="14px"
          >
            {renderButtons?.({ setAnchorEl })}
          </Grid>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default ContextMenu;
