import { useContext } from 'react';
import Typography from '@mui/material/Typography';

import Grid from '@mui/material/Grid';
import GradientHeading from 'components/GradientHeading';
import palette from 'theme/palette';
import typography from 'theme/typography';
import Image from 'next/image';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import { Polygon } from 'components/Icons/chains';
import { LINK } from 'utils/constants';
import { TaskShareIcon } from 'components/Icons/taskShare';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { useTaskContext } from 'utils/hooks';
import { CommunityShareWrapper, ShareButton } from './styles';
import { TaskMintDetailsChain } from '../TaskMintButton/styles';

const CommunityShare = ({ handleShareClick }) => (
  <CommunityShareWrapper>
    <Typography color={palette.blue20} fontFamily={typography.fontFamily} fontWeight={500}>
      Share with community?
    </Typography>
    <ShareButton borderRadius={6} paddingX={9} onClick={handleShareClick}>
      <TaskShareIcon stroke={palette.highlightBlue} />
      Share
    </ShareButton>
  </CommunityShareWrapper>
);

const SuccessMint = ({ tokenData }) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const { fetchedTask } = useTaskContext();

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(`${LINK}/task/${fetchedTask?.id}/nft`);
    setSnackbarAlertMessage(`Link copied`);
    setSnackbarAlertOpen(true);
  };

  return (
    !!tokenData && (
      <Grid display="flex" direction="column" gap="18px" alignItems="center" justifyContent="center">
        <GradientHeading
          fontSize={24}
          mb="2px"
          textAlign="center"
          width="100%"
          gradient="89.67deg, #CCBBFF 37.16%, #00BAFF 108.05%"
        >
          Successfully Minted Task!
        </GradientHeading>
        <TaskMintDetailsChain>
          <ItemButtonIcon>
            <Polygon />
          </ItemButtonIcon>
          Minted on Polygon via Mint Kudos
        </TaskMintDetailsChain>
        <Image layout="fixed" width={258} height={257} src={tokenData?.imageUrl} />
        <CommunityShare handleShareClick={handleShareClick} />
      </Grid>
    )
  );
};

export default SuccessMint;
