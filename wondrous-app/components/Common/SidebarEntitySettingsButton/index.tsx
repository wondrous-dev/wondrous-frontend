import { GreyButton } from 'components/Common/SidebarStyles';

const SettingsButton = ({ router, board, id, canManage }) => {
  const handleOnClickSettings = () =>
    router.push(board.orgData ? `/organization/settings/${id}/general` : `/pod/settings/${id}/general`);
  if (!canManage) return null;
  return <GreyButton onClick={handleOnClickSettings}>Settings</GreyButton>;
};

export default SettingsButton;
