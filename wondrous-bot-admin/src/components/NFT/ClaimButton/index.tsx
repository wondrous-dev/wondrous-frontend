import { Connectors } from "components/Login/styles";
import Modal from "components/Shared/Modal";
import { SharedSecondaryButton } from "components/Shared/styles";
import { CoinbaseConnector, DiscordConnector, MetaMaskConnector, WalletConnectConnector } from "components/Connectors";
import { useEffect, useState } from "react";
import { Box, Grid, useMediaQuery } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import useWonderWeb3 from "services/web3/useWonderWeb3";
import { verifyChain } from "components/PaymentLedger/utils";
import useAlerts from "utils/hooks";
import { nftFactoryABI } from "services/contracts/nftFactory.abi";
import { ethers } from "ethers";

const contractAddress = "0x563565C5Faf5B3aC2B04271715ba67a9AbbFad51";

const ClaimButton = ({ chain, receiverAddress, signature, tokenId }) => {
  const wonderWeb3 = useWonderWeb3();
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();

  const [openConnectModal, setOpenConnectModal] = useState(false);

  const handleMint = async () => {
    if (!wonderWeb3?.address) return;

    try {
      // Define the parameters as per your requirement
      const amount = 1;
      const prov = new ethers.providers.Web3Provider(wonderWeb3.web3Provider);
      const signer = prov.getSigner();

      // Trigger the contract's claimBadge function
      const contractInstance = new ethers.Contract(contractAddress, nftFactoryABI, signer);
    
      const transaction = await contractInstance.claimBadge(amount, tokenId, signature);
      await transaction.wait();

      alert("Minted successfully!");
    } catch (error) {
      console.error(error);
      alert("Minting failed. Check console for error details.");
    }
  };

  useEffect(() => {
    if (wonderWeb3?.address && openConnectModal) {
      setOpenConnectModal(false);
    }
  }, [wonderWeb3?.address]);

  const handleChainVerify = ({ chain }) => {
    try {
      verifyChain({
        chain,
        connectedChain: wonderWeb3?.chain,
      });
    } catch (error) {
      setSnackbarAlertMessage(`Please switch to ${chain} chain`);
      setSnackbarAlertOpen(true);
      throw new Error();
    }
  };

  const toggleModal = () => {
    if (!wonderWeb3.address) {
      return setOpenConnectModal(!openConnectModal);
    }
    handleChainVerify({ chain });
    handleMint();
  };

  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <>
      <Modal open={openConnectModal} onClose={() => setOpenConnectModal(false)} title={"Connect your wallet"}>
        <Grid display="flex" flexDirection="column" width="100%" justifyContent="center" alignItems="center" gap="24px">
          <Label sx={{ textAlign: "center !important" }}>Select your wallet</Label>
          <Box display="flex" gap="8px" alignItems="center">
            {!isMobile && <MetaMaskConnector />}
            <CoinbaseConnector />
            <WalletConnectConnector />
          </Box>
        </Grid>
      </Modal>
      <SharedSecondaryButton onClick={toggleModal}>
        {wonderWeb3?.address ? "Claim now" : "Connect wallet"}
      </SharedSecondaryButton>
    </>
  );
};

export default ClaimButton;
