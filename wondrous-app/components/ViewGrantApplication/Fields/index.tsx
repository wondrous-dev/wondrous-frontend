import Grid from '@mui/material/Grid';
import { ActionButton } from 'components/Common/Task/styles';
import CopyIcon from 'components/Icons/copy';
import { DataDisplayWrapper } from 'components/ViewGrant/Fields/styles';
import { useState } from 'react';
import { Button, GrantApplicationStatusWrapper, WalletAddressWrapper } from './styles';

export const GrantApplicationStatusManager = ({ grantApplication }) => {
  const { status } = grantApplication;
  const BUTTONS_CONFIG = [
    {
      label: status === 'approved' ? 'Undo Approval' : 'Undo approval',
      gradient: 'linear-gradient(259.59deg, #06FFA5 0%, #7427FF 93.38%)',
    },
    {
      label: status === 'changes_requested' ? 'Changes requested' : 'Request changes',
      gradient: 'linear-gradient(259.59deg, #FFD653 0%, #7427FF 93.38%)',
    },
    {
      label: status === 'rejected' ? 'Rejected' : 'Reject',
      gradient: 'linear-gradient(259.59deg, #F93701 0%, #7427FF 93.38%)',
    },
  ];

  const handleStatusChange = () => {};

  return (
    <GrantApplicationStatusWrapper>
      <Grid display="flex" justifyContent="space-between" alignItems="center" gap="24px">
        {BUTTONS_CONFIG.map((buttonConfig, index) => (
          <Button key={index} gradient={buttonConfig.gradient}>
            {buttonConfig.label}
          </Button>
        ))}
      </Grid>
    </GrantApplicationStatusWrapper>
  );
};

export const WalletAddressViewer = ({ walletAddress }) => {
  const [isCopied, setIsCopied] = useState(false);
  const handleAddressCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
    navigator.clipboard.writeText(`${walletAddress}`);
  };

  return (
    <WalletAddressWrapper>
      <DataDisplayWrapper onClick={handleAddressCopy}>
        {isCopied ? 'Address copied!' : `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
        {!isCopied && <CopyIcon />}
      </DataDisplayWrapper>
    </WalletAddressWrapper>
  );
};
