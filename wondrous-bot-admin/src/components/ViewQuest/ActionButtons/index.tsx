import { SharedSecondaryButton } from "components/Shared/styles";

export const ConnectPlatformButton = ({ authUrl, label, buttonProps = {} }) => {
  const handleOnClick = () => {
    window.open(authUrl);
  };

  return <SharedSecondaryButton onClick={handleOnClick}
  {...buttonProps}
  >{label}</SharedSecondaryButton>;
};


const StartQuestButton = () => {};
