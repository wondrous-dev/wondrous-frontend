import { Box } from "@mui/material";
import { getUserSigningMessage } from "components/Auth";
import { SharedSecondaryButton } from "components/Shared/styles";
import { ethers } from "ethers";
import { useState } from "react";
import { useWeb3Modal } from "@web3modal/ethers5/react";


const WalletTestPage = () => {

  const { open } = useWeb3Modal();

  return (
    <Box display="flex" flexDirection="column" gap="10px" justifyContent="center" alignItems="center" paddingTop="20vh">
      {/* <w3m-network-button />
      <w3m-connect-button />
      <w3m-account-button /> */}
      <SharedSecondaryButton onClick={() => open()}>Connect with MetaMask</SharedSecondaryButton>
    </Box>
  );
};

export default WalletTestPage;
