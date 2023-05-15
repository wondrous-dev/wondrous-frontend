import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ButtonBase, Box } from "@mui/material";
import { useState } from "react";
const QuestCardMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (e) => {
    e.stopPropagation();
  };
  return (
    <Box
      sx={{
        zIndex: 1,
        display: "flex",
        justifyContent: "flex-end",
        width: "100%",
        position: "absolute",
        right: '2%',
        bottom: '5%'
      }}
    >
      <ButtonBase
        onClick={handleClick}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "100%",
          padding: "4px",
          transition: "background 0.1s ease-in-out",
          ":hover": {
            background: "#F5F5F5",
          },
        }}
      >
        <MoreVertIcon
          sx={{
            color: "black",
            opacity: 0.6,
          }}
        />
      </ButtonBase>
    </Box>
  );
};

export default QuestCardMenu;
