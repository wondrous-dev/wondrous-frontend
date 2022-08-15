import { TaskShareIcon } from 'components/Icons/taskShare';
import Tooltip from 'components/Tooltip';
import { useContext } from 'react';
import { TASK_TYPE } from 'utils/constants';
import { capitalize } from 'utils/common';
import { SnackbarAlertContext } from '../SnackbarAlert';
import { StyledShare } from './styles';

interface IShareProps {
  url: string;
  className?: string;
  entityType?: string;
}

export function Share(props: IShareProps) {
  const { url, className, entityType = TASK_TYPE } = props;
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const snackbarAlertMessage = `${capitalize(entityType)} link copied`;
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
}
