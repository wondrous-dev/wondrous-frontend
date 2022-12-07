import { GreyButton } from 'components/Common/SidebarStyles';
import { useRouter } from 'next/router';
import useCanManage from "../../../hooks/useCanManage";

const SettingsButton = ({ board, id }) => {
  const router = useRouter();
  const canManage = useCanManage();

  const handleOnClickSettings = () =>
    router.push(board.orgData ? `/organization/settings/${id}/general` : `/pod/settings/${id}/general`);

  if (!canManage) {
    return null;
  }

  return <GreyButton onClick={handleOnClickSettings}>Settings</GreyButton>;
};

export default SettingsButton;
