import Modal from "components/Shared/Modal";
import { SharedSecondaryButton } from "components/Shared/styles";
import { CoinbaseConnector, MetaMaskConnector, WalletConnectConnector } from "components/Connectors";
import { useEffect, useState } from "react";
import { Box, Grid, useMediaQuery } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import useWonderWeb3 from "services/web3/useWonderWeb3";
import { verifyChain } from "components/PaymentLedger/utils";
import useAlerts from "utils/hooks";
import { nftFactoryABI } from "services/contracts/nftFactory.abi";
import { ethers } from "ethers";
import { CHAIN_TO_NFT_FACTORY } from "services/web3/contractRouter";
import Spinner from "components/Shared/Spinner";

const ClaimButton = ({ chain, nonce, signature, tokenId, setSuccess }) => {
  const wonderWeb3 = useWonderWeb3();
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();

  const [isMinting, setIsMinting] = useState(false);
  const [openConnectModal, setOpenConnectModal] = useState(false);

  const handleMint = async () => {
    if (!wonderWeb3?.address) return;

    try {
      setIsMinting(true);
      const prov = new ethers.providers.Web3Provider(wonderWeb3.web3Provider);
      const signer = prov.getSigner();
      const contractInstance = new ethers.Contract(CHAIN_TO_NFT_FACTORY[wonderWeb3.chainName], nftFactoryABI, signer);

      const transaction = await contractInstance.claimBadge(1, BigInt(tokenId), nonce, signature);
      await transaction.wait();

      setSnackbarAlertMessage("Minting successful");
      setSnackbarAlertOpen(true);
      setSuccess(true);
      setIsMinting(false);
    } catch (error) {
      console.log(error, 'err')
      setIsMinting(false);
      setSnackbarAlertMessage("Minting failed! Please try again or contact support.");
      setSnackbarAlertOpen(true);
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
        <>{isMinting ? <Spinner /> : <>{wonderWeb3?.address ? "Claim now" : "Connect wallet"}</>}</>
      </SharedSecondaryButton>
    </>
  );
};

export default ClaimButton;
