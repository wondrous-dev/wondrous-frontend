import { ButtonBase } from '@mui/material';
import styled from 'styled-components';

const Settings = styled(ButtonBase)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px;
    width: 70px;
    height: 28px;
    background: #313131;
    border-radius: 6px;
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    :hover {
      background: #707070;
      filter: drop-shadow(0px 6px 14px rgba(0, 0, 0, 0.5));
    }
  }
`;
const SettingsButton = ({ router, board, id, canManage }) => {
  const handleOnClickSettings = () =>
    router.push(board.orgData ? `/organization/settings/${id}/general` : `/pod/settings/${id}/general`);
  if (!canManage) return null;
  return <Settings onClick={handleOnClickSettings}>Settings</Settings>;
};

export default SettingsButton;
