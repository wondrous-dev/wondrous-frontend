import { ButtonBase } from "@mui/material";
import EmptyState from "components/EmptyState";

interface IShowMoreButtonProps {
  onClick: () => void;
  label?: string;
}

export const SharedShowMoreButton = ({ onClick, label = "Show more" }) => {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: "100%",
        padding: "8px 24px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "6px",
        border: "1px solid #D9D9D9",
        background: "#F7F7F7",
        fontFamily: "Poppins",
        color: "black",
        textAlign: "center",
        fontSize: "15px",
        fontWeight: 600,
        transition: "all 0.2s ease-in-out",
        lineHeight: "15px",
        "&:hover": {
          background: "#F7F7F7",
          border: "1px solid #D9D9D9",
          boxShadow: "0px 4px 12px 0px rgba(0,0,0,0.15)",
          transform: "translateY(-1px)",
        },
      }}
    >
      {label}
    </ButtonBase>
  );
};

export const CmtyActivityEmptyState = ({ Image, title, sx = {} }) => {
  return (
    <EmptyState
      labelColor={"#828282"}
      sx={{
        bgcolor: "#F6F6F6",
        border: "1px solid #CDCDCD",
        borderRadius: "6px",
        ...sx
      }}
      customType={{
        Image,
        title,
      }}
    />
  );
};
