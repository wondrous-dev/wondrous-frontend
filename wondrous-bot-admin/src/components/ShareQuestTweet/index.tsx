import TwitterIcon from "components/Icons/Twitter";
import { ButtonIconWrapper } from "components/Shared/styles";
import useAlerts from "utils/hooks";
const ShareQuestTweet = ({ link = "" }) => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const onClick = (e) => {
    e.stopPropagation();
    window.open(`https://twitter.com/intent/tweet?text=Complete this quest to earn a reward!&url=${link}`, "_blank");
  };
  return (
    <ButtonIconWrapper onClick={onClick}>
      <TwitterIcon height="18px" />
    </ButtonIconWrapper>
  );
};

export default ShareQuestTweet;
