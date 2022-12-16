import { StyledShare } from 'components/Common/Share/styles';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { TaskShareIcon } from 'components/Icons/taskShare';
import Tooltip from 'components/Tooltip';
import { useContext } from 'react';
import { capitalize } from 'utils/common';
import { ENTITIES_TYPES, LINK } from 'utils/constants';

interface IShareProps {
  fetchedTask: {
    orgUsername: string;
    parentTaskId?: string;
    id: string;
    type?: string;
  };
  className?: Object;
}

const Share = ({ fetchedTask, className }: IShareProps) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const { id, orgUsername, type } = fetchedTask;
  const entityType = type || ENTITIES_TYPES.PROPOSAL;
  const taskTypeQuery = type ? `task` : `taskProposal`;
  const taskId = id;
  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(
      `${LINK}/organization/${orgUsername}/boards?${taskTypeQuery}=${taskId}&entity=${entityType}`
    );
    setSnackbarAlertMessage(`${capitalize(entityType)} link copied`);
    setSnackbarAlertOpen(true);
  };
  return (
    <Tooltip title={`Share ${capitalize(entityType)}`} placement="top">
      <StyledShare onClick={handleOnClick} className={className}>
        <TaskShareIcon />
      </StyledShare>
    </Tooltip>
  );
};

export default Share;
