import { TaskShareIcon } from 'components/Icons/taskShare';
import Tooltip from 'components/Tooltip';
import { useContext } from 'react';
import { SnackbarAlertContext } from '../SnackbarAlert';
import { StyledShare } from './styles';

interface IShareProps {
  url: string;
  className?: string;
  isBounty?: boolean;
}

export const Share = (props: IShareProps) => {
  const { url, className, isBounty = false } = props;
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const snackbarAlertMessage = isBounty ? 'Bounty link copied' : 'Task link copied';
  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setSnackbarAlertMessage(snackbarAlertMessage);
    setSnackbarAlertOpen(true);
  };
  return (
    <Tooltip title="Share task" placement="top">
      <StyledShare onClick={handleOnClick}>
        <TaskShareIcon />
      </StyledShare>
    </Tooltip>
  );
};
