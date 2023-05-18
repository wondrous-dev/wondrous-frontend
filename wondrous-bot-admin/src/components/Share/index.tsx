import ShareIcon from "components/Icons/Share";
import { ButtonIconWrapper } from "components/Shared/styles";
import useAlerts from "utils/hooks";

const ShareComponent = ({link = ''}) => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const onClick = (e) => {
    e.stopPropagation();
    const linkToCopy = link || window.location.href;
    navigator.clipboard.writeText(linkToCopy);
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
