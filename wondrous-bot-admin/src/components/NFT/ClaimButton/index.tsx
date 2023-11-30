
//TODO : fix
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
import { useMutation } from "@apollo/client";
import { LINK_TRANSACTION_TO_COMMUNITY_NFT } from "graphql/mutations/payment";
import useWonderWeb3Modal from "services/web3/useWonderWeb3Modal";

const ClaimButton = ({ chain, nonce, signature, tokenId, setSuccess, nftMetadataId, cmtyUserId }) => {
  const {address, walletProvider, chainId} = useWonderWeb3Modal();
  const [linkTx] = useMutation(LINK_TRANSACTION_TO_COMMUNITY_NFT)
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();

  const [isMinting, setIsMinting] = useState(false);
  const [openConnectModal, setOpenConnectModal] = useState(false);

  const handleMint = async () => {
    if (!address) return;

    try {
      setIsMinting(true);
      const prov = new ethers.providers.Web3Provider(walletProvider);
      const signer = prov.getSigner();
      const contractInstance = new ethers.Contract(CHAIN_TO_NFT_FACTORY[chainId], nftFactoryABI, signer);

      const transaction = await contractInstance.claimBadge(1, BigInt(tokenId), nonce, signature);
      await transaction.wait();

      await linkTx({
        variables: {
          txHash: transaction.hash,
          nftMetadataId,
          cmtyUserId
        }
      })
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
    if (address && openConnectModal) {
      setOpenConnectModal(false);
    }
  }, [address]);

  const handleChainVerify = ({ chain }) => {
    try {
      verifyChain({
        chain,
        connectedChainId: chain,
      });
    } catch (error) {
      setSnackbarAlertMessage(`Please switch to ${chain} chain`);
      setSnackbarAlertOpen(true);
      throw new Error();
    }
  };

  const toggleModal = () => {
    if (!address) {
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
        <>{isMinting ? <Spinner /> : <>{address ? "Claim now" : "Connect wallet"}</>}</>
      </SharedSecondaryButton>
    </>
  );
};

export default ClaimButton;
