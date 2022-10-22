import { createPortal } from 'react-dom';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from 'components/Divider';
import GradientHeading from 'components/GradientHeading';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import { Polygon } from 'components/Icons/chains';
import { Button } from 'components/Button';
import { MintTaskDetailsChain } from '../MintTaskButton/styles';

const StartMint = ({ nextStep, onCancel, footerRef }) => {
  console.log(footerRef);
  return (
    <Grid display="flex" direction="column" gap="18px">
      <GradientHeading fontSize={24} mb="2px" gradient="89.67deg, #CCBBFF 37.16%, #00BAFF 108.05%">
        Mint your task for free
      </GradientHeading>
      <img src="/images/taskmint/startmint.png" />
      <Typography color={palette.white} fontFamily={typography.fontFamily} fontSize={15} fontWeight={600}>
        Carry your proof of work wherever you go
      </Typography>
      <Typography color={palette.grey250} fontFamily={typography.fontFamily} fontSize={15} fontWeight={400}>
        The minting will take under 1 minute. We’ll send you a <br /> notification when your NFT hits your wallet.
      </Typography>
      <Divider />
      <MintTaskDetailsChain>
        <ItemButtonIcon bgColor={palette.highlightPurple}>
          <Polygon />
        </ItemButtonIcon>
        Minted on Polygon via Mint Kudos - (Zero gas fees)
      </MintTaskDetailsChain>
      {footerRef.current
        ? createPortal(
            <Grid container gap="18px">
              <Button color="grey" onClick={onCancel}>
                Cancel
              </Button>
              <Button color="primary" type="button" onClick={nextStep}>
                Mint task
              </Button>
            </Grid>,
            footerRef.current
          )
        : null}
    </Grid>
  );
};

export default StartMint;
