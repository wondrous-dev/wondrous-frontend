import { useMemo } from 'react';
import OpenSeaIcon from 'components/Icons/openSea';
import { ShareButton as OpenSeaButton } from './Steps/styles';

const OpenseaButton = ({ tokenId }) => {
  const isProduction = !!process.env.NEXT_PUBLIC_PRODUCTION;

  const openseaUrl = useMemo(() => {
    if (!tokenId) return null;
    if (isProduction) {
      return `https://opensea.io/assets/matic/0x60576a64851c5b42e8c57e3e4a5cf3cf4eeb2ed6/${tokenId}`;
    }
    return `https://testnets.opensea.io/assets/mumbai/0xb876baf8f69cd35fb96a17a599b070fbdd18a6a1/${tokenId}`;
  }, [isProduction, tokenId]);

  return (
    <OpenSeaButton type="button" onClick={() => window.open(openseaUrl, '_blank')}>
      <OpenSeaIcon />
      View on OpenSea
    </OpenSeaButton>
  );
};

export default OpenseaButton;
