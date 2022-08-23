import { useContext } from 'react';
import { ENTITIES_TYPES, TASK_TYPE } from 'utils/constants';
import { capitalize } from 'utils/common';
import Tooltip from 'components/Tooltip';
import { TaskShareIcon } from 'components/Icons/taskShare';
import { SnackbarAlertContext } from '../SnackbarAlert';
import { StyledShare } from './styles';

interface IShareProps {
  url: string;
  entityType?: string;
}

const Share = ({ url, entityType = TASK_TYPE }: IShareProps) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const snackbarAlertMessage = `${capitalize(entityType)} link copied`;
  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setSnackbarAlertMessage(snackbarAlertMessage);
    setSnackbarAlertOpen(true);
  };

  const getTitle = (type) => {
    if (type === ENTITIES_TYPES.PROPOSAL) return 'Share Proposal';
    if (type === ENTITIES_TYPES.BOUNTY) return 'Share Bounty';

    return 'Share Task';
  };

  return (
    <Tooltip title={getTitle(entityType)} placement="top">
      <StyledShare onClick={handleOnClick}>
        <TaskShareIcon />
      </StyledShare>
    </Tooltip>
  );
};

export default Share;
