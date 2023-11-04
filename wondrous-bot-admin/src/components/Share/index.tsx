import { Link } from "@mui/icons-material";
import { ExternalLinkIcon } from "components/Icons/ExternalLink";
import LinkIcon from "components/Icons/LinkIcon";
import ShareIcon from "components/Icons/Share";
import CopyIcon from "components/Icons/copy";
import { ButtonIconWrapper } from "components/Shared/styles";
import useAlerts from "utils/hooks";

const ShareComponent = ({ link = "" }) => {
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
      <LinkIcon />
    </ButtonIconWrapper>
  );
};

export default ShareComponent;
