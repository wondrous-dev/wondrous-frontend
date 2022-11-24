import { Grid } from '@mui/material';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { useContext } from 'react';
import { LINK } from 'utils/constants';
import OpenseaButton from '../OpenseaButton';
import { CommunityShare } from '../Steps/SuccessMint';
import { Wrapper } from './styles';

const TaskViewMintActions = ({ tokenId, taskId }) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${LINK}/task/${taskId}/nft`);
    setSnackbarAlertMessage(`Link copied`);
    setSnackbarAlertOpen(true);
  };

  return (
    <Grid display="flex" gap="24px" direction="column">
      <Wrapper>
        <OpenseaButton tokenId={tokenId} />
      </Wrapper>
      <Wrapper>
        <CommunityShare handleShareClick={handleShareClick} />
      </Wrapper>
    </Grid>
  );
};

export default TaskViewMintActions;
