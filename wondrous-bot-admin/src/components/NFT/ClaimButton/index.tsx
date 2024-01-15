//TODO : fix
import { SharedSecondaryButton } from "components/Shared/styles";
import { useEffect, useState } from "react";
import { Box, ButtonBase, Typography, useMediaQuery } from "@mui/material";
import { verifyChain } from "components/PaymentLedger/utils";
import useAlerts from "utils/hooks";
import { nftFactoryABI } from "services/contracts/nftFactory.abi";
import { ethers } from "ethers";
import { CHAIN_TO_NFT_FACTORY } from "services/web3/contractRouter";
import Spinner from "components/Shared/Spinner";
import { useMutation } from "@apollo/client";
import { LINK_TRANSACTION_TO_COMMUNITY_NFT } from "graphql/mutations/payment";
import useWonderWeb3Modal from "services/web3/useWonderWeb3Modal";
import { StyledLink, UnderlinedLink } from "components/ViewQuest/styles";

const ClaimButton = ({ chain, nonce, signature, tokenId, setSuccess, nftMetadataId, cmtyUserId }) => {
  const { address, walletProvider, chainId, open, isConnected } = useWonderWeb3Modal();
  const [linkTx] = useMutation(LINK_TRANSACTION_TO_COMMUNITY_NFT);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();

  const [isMinting, setIsMinting] = useState(false);
  const [openConnectModal, setOpenConnectModal] = useState(false);

  const handleMint = async () => {
    if (!address) return;

    try {
      setIsMinting(true);
      if(isMobile) {
        setSnackbarAlertMessage("Please open your wallet and proceed with the transaction");
        setSnackbarAlertOpen(true);
      }
      const prov = new ethers.providers.Web3Provider(walletProvider);
      const signer = prov.getSigner();
      const contractInstance = new ethers.Contract(CHAIN_TO_NFT_FACTORY[chainId], nftFactoryABI, signer);

      const transaction = await contractInstance.claimBadge(1, BigInt(tokenId), nonce, signature);
      await transaction.wait();

      await linkTx({
        variables: {
          txHash: transaction.hash,
          nftMetadataId,
          cmtyUserId,
        },
      });
      setSnackbarAlertMessage("Minting successful");
      setSnackbarAlertOpen(true);
      setSuccess(true);
      setIsMinting(false);
    } catch (error) {
      //TODO: replace w code
      if (error.message?.toLowerCase()?.includes("signature has already been used")) {
        setSnackbarAlertMessage("Signature has already been used");
        setSnackbarAlertOpen(true);
        setIsMinting(false);
        return;
      }
      console.error(error);
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
        connectedChainId: chainId,
      });
    } catch (error) {
      open({ view: "Networks" });
      setSnackbarAlertMessage(`Please switch to ${chain} chain`);
      setSnackbarAlertOpen(true);
      throw new Error();
    }
  };

  const handleOnClaimClick = () => {
    if (!address) return open();
    handleChainVerify({ chain });
    handleMint();
  };

  return (
    <Box display="flex" flexDirection="column" gap="10px" alignItems="center" justifyContent="center">
      <SharedSecondaryButton onClick={handleOnClaimClick}>
        <>{isMinting ?<Spinner />: <>{address ? "Claim now" : "Connect wallet"}</>}</>
      </SharedSecondaryButton>
      {isMinting && <Typography color="black">Please don't close the webpage</Typography>}
      {isConnected ? (
        <ButtonBase onClick={() => open()} disabled={isMinting}>
          <Typography
            fontFamily="Poppins"
            color="black"
            fontSize="12px"
            sx={{
              textDecoration: "underline",
              pointer: "cursor",
              "&:hover": {
                color: "#84bcff",
              },
            }}
          >
            Change address
          </Typography>
        </ButtonBase>
      ) : null}
    </Box>
  );
};

export default ClaimButton;
