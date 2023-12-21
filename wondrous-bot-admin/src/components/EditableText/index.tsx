import { Edit } from "@mui/icons-material";
import { Box, ClickAwayListener, Typography } from "@mui/material";
import { useRef, useState } from "react";
import { Input } from "./styles";

const EditableText = ({ canEdit = false, value, onEdit }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const ref = useRef(null);

  const toggleEditMode = () => {
    if (!canEdit) return;
    if (isEditMode) {
      onEdit(ref.current);
    }
    setIsEditMode((prev) => !prev);
  };

  if (!isEditMode) {
    return (
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography
          onClick={toggleEditMode}
          fontFamily="Poppins"
          fontWeight={700}
          fontSize="13px"
          lineHeight="17px"
          color="black"
          whiteSpace={{
            xs: "nowrap",
            md: "inherit",
          }}
        >
          {value}
        </Typography>
        <Edit
          id="display-edit-icon"
          sx={{
            color: "#333333",
            position: "absolute",
            right: "0",
            opacity: 0.2,
            fontSize: "16px",
            visibility: "hidden",
          }}
        />
      </Box>
    );
  }
  if (isEditMode) {
    return (
      <ClickAwayListener onClickAway={toggleEditMode} mouseEvent="onMouseDown">
        <Box display="flex" gap="10px" alignItems="center">
          <Input defaultValue={value} autoFocus onChange={(e) => (ref.current = e.target.value)} />
        </Box>
      </ClickAwayListener>
    );
  }
};

export default EditableText;
