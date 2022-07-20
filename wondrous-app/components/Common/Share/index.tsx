import { TaskShareIcon } from 'components/Icons/taskShare';
import Tooltip from 'components/Tooltip';
import { useContext } from 'react';
import { SnackbarAlertContext } from '../SnackbarAlert';
import { StyledShare } from './styles';

interface IShareProps {
  url: string;
  className?: string;
}

export const Share = (props: IShareProps) => {
  const { url, className } = props;
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setSnackbarAlertMessage('Bounty link copied');
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
