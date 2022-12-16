import { useMemo } from 'react';
import OpenSeaIcon from 'components/Icons/openSea';
import { useTaskContext } from 'utils/hooks';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { Grid, Typography } from '@mui/material';
import typography from 'theme/typography';
import palette from 'theme/palette';
import { ShareButton as OpenSeaButton } from './Steps/styles';

const OpenseaButton = ({ tokenId }) => {
  const isProduction = !!process.env.NEXT_PUBLIC_PRODUCTION;

  const { tokenData } = useTaskContext();

  const openseaUrl = useMemo(() => {
    if (!tokenId) return null;
    if (isProduction) {
      return `https://opensea.io/assets/matic/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6/${tokenId}`;
    }
    return `https://testnets.opensea.io/assets/mumbai/0xb876baf8f69cd35fb96a17a599b070fbdd18a6a1/${tokenId}`;
  }, [isProduction, tokenId]);

  const diffInMinutes = useMemo(
    () => differenceInMinutes(new Date(), new Date(tokenData?.data?.getTaskMintTokenData?.updatedAt)),
    [tokenData]
  );

  return (
    <Grid display="flex" direction="column" gap="8px">
      <OpenSeaButton type="button" onClick={() => window.open(openseaUrl, '_blank')}>
        <OpenSeaIcon />
        View Minted NFT on OpenSea
      </OpenSeaButton>
      {diffInMinutes < 5 ? (
        <Typography fontSize="12px" fontFamily={typography.fontFamily} color={palette.grey250}>
          Please allow up to 5 minutes for the NFT to appear on OpenSea.
        </Typography>
      ) : null}
    </Grid>
  );
};

export default OpenseaButton;
