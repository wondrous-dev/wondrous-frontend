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
    org?: any;
    grantId?: string;
  };
  className?: Object;
}

const Share = ({ fetchedTask, className }: IShareProps) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const { id, orgUsername, type, org } = fetchedTask;
  const entityType = type || ENTITIES_TYPES.PROPOSAL;
  const taskTypeQuery = type ? `task` : `taskProposal`;
  const taskId = id;
  const copyText = type === ENTITIES_TYPES.GRANT_APPLICATION ? 'Grant application' : capitalize(entityType);

  const handleLink = () => {
    if (type === ENTITIES_TYPES.GRANT) {
      return navigator.clipboard.writeText(
        `${LINK}/organization/${orgUsername || org?.username}/grants?grant=${taskId}`
      );
    }

    if (type === ENTITIES_TYPES.GRANT_APPLICATION) {
      return navigator.clipboard.writeText(
        `${LINK}/organization/${orgUsername || org?.username}/grants?grant=${
          fetchedTask?.grantId
        }&grantApplicationId=${taskId}`
      );
    }
    if (type === ENTITIES_TYPES.MILESTONE) {
      return navigator.clipboard.writeText(
        `${LINK}/organization/${orgUsername || org?.username}/boards?milestone=${taskId}&entity=${entityType}`
      );
    }
    return navigator.clipboard.writeText(
      `${LINK}/organization/${orgUsername || org?.username}/boards?${taskTypeQuery}=${taskId}&entity=${entityType}`
    );
  };
  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleLink();
    setSnackbarAlertMessage(`${copyText} link copied`);
    setSnackbarAlertOpen(true);
  };
  return (
    <Tooltip title={`Share ${copyText}`} placement="top">
      <StyledShare onClick={handleOnClick} className={className}>
        <TaskShareIcon />
      </StyledShare>
    </Tooltip>
  );
};

export default Share;
