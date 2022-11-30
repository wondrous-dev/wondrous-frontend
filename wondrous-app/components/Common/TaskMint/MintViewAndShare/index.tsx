import { Grid } from '@mui/material';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { useContext } from 'react';
import { LINK } from 'utils/constants';
import OpenseaButton from '../OpenseaButton';
import { CommunityShare } from '../Steps/SuccessMint';
import { Wrapper } from './styles';

/*
 * @param {number} tokenId
 * @param {number} taskId
 * @returns {JSX.Element}
 * @description: Component that contains the button to view the NFT on Opensea
 * and the button to copy the link to the NFT view modal
 */

const MintViewAndShare = ({ tokenId, taskId }) => {
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

export default MintViewAndShare;
