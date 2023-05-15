import IosShareIcon from "@mui/icons-material/IosShare";
import { ButtonBase } from "@mui/material";
import useAlerts from "utils/hooks";

const ShareComponent = () => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const onClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setSnackbarAlertMessage("Link copied to clipboard");
    setSnackbarAlertOpen(true);
  };
  return (
    <ButtonBase onClick={onClick}>
      <IosShareIcon
        sx={{
          color: "black",
          "&:hover": {
            opacity: 0.6,
          },
        }}
      />
    </ButtonBase>
  );
};

export default ShareComponent;
