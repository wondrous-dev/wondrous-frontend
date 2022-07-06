import { TaskShareIcon } from 'components/Icons/taskShare';
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
    setSnackbarAlertMessage('Task link copied');
    setSnackbarAlertOpen(true);
  };
  return (
    <StyledShare onClick={handleOnClick} className={className}>
      <TaskShareIcon />
    </StyledShare>
  );
};
