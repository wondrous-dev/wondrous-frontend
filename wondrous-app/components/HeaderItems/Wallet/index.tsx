import { Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { ItemButtonIcon } from 'components/Common/SidebarItem/styles';
import { ChainWrapper, WalletAddress } from 'components/Common/Wallet/styles';
import CopyIcon from 'components/Icons/copy';
import { MinimalWalletIcon } from 'components/Icons/WalletIcon';
import { useState } from 'react';
import { useWonderWeb3 } from 'services/web3';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { CHAIN_TO_CHAIN_DIPLAY_NAME, CHAIN_LOGO } from 'utils/web3Constants';
import { Wrapper } from '../CreateEntityComponent/styles';
import { ItemContainer } from '../UserProfile/styles';

const WalletItem = () => {
  const [isCopied, setIsCopied] = useState(false);
  const wonderWeb3 = useWonderWeb3();

  console.log(CHAIN_TO_CHAIN_DIPLAY_NAME[wonderWeb3?.nativeTokenSymbol]);

  const handleAddressCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(`${wonderWeb3?.wallet?.address}`);
  };

  return (
    <Wrapper>
      <ItemContainer style={{ padding: '14px 8px' }}>
        <Grid display="flex" gap="8px" direction="column" alignItems="flexStart">
          <Grid display="flex" gap="12px" alignItems="center">
            <ItemButtonIcon>
              <MinimalWalletIcon />
            </ItemButtonIcon>
            <Typography fontFamily={typography.fontFamily} color={palette.white} fontSize="15px" fontWeight={500}>
              Wallet
            </Typography>
            <Typography fontFamily={typography.fontFamily} color={palette.green30} fontSize="15px" fontWeight={500}>
              Connected
            </Typography>
          </Grid>
          <Grid display="flex" gap="12px" alignItems="center">
            <Tooltip title={CHAIN_TO_CHAIN_DIPLAY_NAME[wonderWeb3?.chainName]}>
            <WalletAddress>
                <Grid display="flex" gap="6px" alignItems="center">
                {CHAIN_LOGO[wonderWeb3?.chain]}
                <Typography color={palette.white} fontFamily={typography.fontFamily} fontWeight={500} fontSize="13px">
                {wonderWeb3?.nativeTokenSymbol}
                </Typography>
                </Grid>
                </WalletAddress>
            </Tooltip>
            <WalletAddress>
              {isCopied
                ? 'Address copied!'
                : `${wonderWeb3?.wallet?.address?.slice(0, 14)}...${wonderWeb3?.wallet?.address?.slice(-4)}`}
            </WalletAddress>
            <ChainWrapper onClick={handleAddressCopy}>
              <CopyIcon />
            </ChainWrapper>
          </Grid>
        </Grid>
      </ItemContainer>
    </Wrapper>
  );
};
export default WalletItem;
