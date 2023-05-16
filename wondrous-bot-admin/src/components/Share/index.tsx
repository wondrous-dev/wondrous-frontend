import ShareIcon from "components/Icons/Share";
import { ButtonIconWrapper } from "components/Shared/styles";
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
    <ButtonIconWrapper onClick={onClick}>
      <ShareIcon />
    </ButtonIconWrapper>
  );
};

export default ShareComponent;
