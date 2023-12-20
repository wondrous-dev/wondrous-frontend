import { useMutation } from "@apollo/client";
import { SharedSecondaryButton } from "components/Shared/styles";
import { ethers } from "ethers";
import { LINK_CMTY_PAYMENTS_WITH_TRANSACTION } from "graphql/mutations/payment";
import { useContext, useEffect, useState } from "react";
import { TransactionData } from "services/web3/types";
import { ERC20abi } from "services/contracts/erc20.abi";
import GlobalContext from "utils/context/GlobalContext";
import { DEFAULT_ERC20_GAS_LIMIT, SUPPORTED_CHAINS } from "utils/web3Constants";
import {
  checkERC20Allowance,
  approveERC20,
  checkNFTAllowance,
  checkERC1155Allowance,
  setNFTApprovalForAll721,
} from "services/web3/tokenHelpers";
// import useWeb3 from "services/web3/useWeb3";
import useAlerts from "utils/hooks";
import ERC721ABI from "services/web3/abi/ERC721";
import ERC1155ABI from "services/web3/abi/ERC1155";
import BigNumber from "bignumber.js";
import { CircularProgress } from "@mui/material";
import { ContractType } from "services/web3/contractRouter";
import { getMessageFromError, verifyChain } from "./utils";
import useWonderWeb3Modal from "services/web3/useWonderWeb3Modal";

interface IPaymentData {
  chain: string;
  amount: string;
  currency: string;
  recipient: string;
  id: string;
  contractAddress: string;
  decimal: string;
  contractType: string;
}

interface IProps {
  paymentData: IPaymentData;
  disabled?: boolean;
  tokenId?: string;
  onPaymentCompleted?: () => void;
}

const SingleWalletPayment = ({ paymentData, disabled = false, tokenId, onPaymentCompleted }: IProps) => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const [loading, setLoading] = useState(false);

  const [isVerifyingChain, setIsVerifyingChain] = useState(false);
  const { activeOrg } = useContext(GlobalContext);

  const [linkCmtyPaymentsWithTransaction, { data: linkMetamaskPaymentData }] = useMutation(
    LINK_CMTY_PAYMENTS_WITH_TRANSACTION,
    {
      onCompleted: () => onPaymentCompleted(),
      refetchQueries: [
        "getPaidCmtyPaymentsForQuest",
        "getProcessingCmtyPaymentsForQuest",
        "getProcessingCmtyPaymentsForOrg",
        "getCmtyPaymentsCountForOrg",
        "getUnpaidCmtyPaymentsForQuest",
        "getCompletedCmtyPaymentsForOrg",
        "getUnpaidCmtyPaymentsForOrg",
      ],
    }
  );

  const {
    chainId,
    sendTransaction,
    walletProvider,
    address,
    getGasPrice,
    open,
    closeWeb3Modal,
    lastEvent,
    isConnected,
  } = useWonderWeb3Modal();

  useEffect(() => {
    if (paymentData?.chain === SUPPORTED_CHAINS[chainId] && lastEvent === "MODAL_OPEN" && isVerifyingChain) {
      closeWeb3Modal();
      setIsVerifyingChain(false);
    }
  }, [chainId, paymentData?.chain, lastEvent, isVerifyingChain]);

  
  const handleChainVerify = () => {
    if(isVerifyingChain) setIsVerifyingChain(false);
    if (!isConnected) {
      setSnackbarAlertMessage(`Please connect your wallet first`);
      setSnackbarAlertOpen(true);
      open();
      throw new Error();
    }
    try {
      verifyChain({
        chain: paymentData?.chain,
        connectedChainId: chainId,
      });
    } catch (error) {
      setIsVerifyingChain(true);
      if (paymentData?.chain === SUPPORTED_CHAINS[2020] || paymentData?.chain === SUPPORTED_CHAINS[59144]) { // ronin and linea
        open()
      } else {
        open({ view: "Networks" });
      }
      setSnackbarAlertMessage(`Please switch to ${paymentData?.chain} chain`);
      setSnackbarAlertOpen(true);
      throw new Error();
    }
  };

  const handleAllowance = ({ contractType }) => {
    if (contractType === ContractType.ERC20) {
      return checkERC20Allowance(walletProvider, paymentData.contractAddress, address, paymentData.recipient);
    }
    if (contractType === ContractType.ERC721) {
      return checkNFTAllowance(walletProvider, paymentData.contractAddress, address, paymentData.recipient);
    }
    if (contractType === ContractType.ERC1155) {
      return checkERC1155Allowance(walletProvider, paymentData.contractAddress, address, paymentData.recipient);
    }
  };

  const handleApproval = ({ contractType }) => {
    if (contractType === ContractType.ERC20) {
      return approveERC20(walletProvider, paymentData.contractAddress, address, paymentData.recipient);
    }
    if (contractType === ContractType.ERC721) {
      return setNFTApprovalForAll721(walletProvider, paymentData.contractAddress, address);
    }
    if (contractType === ContractType.ERC1155) {
      return setNFTApprovalForAll721(walletProvider, paymentData.contractAddress, address);
    }
  };

  const handleTransfer = ({ contractType, iface, gasPrice, finalAmount, tokenId }) => {
    if (contractType === ContractType.ERC20) {
      const callData = iface.encodeFunctionData("transfer", [paymentData.recipient, finalAmount]);
      return {
        from: address,
        to: paymentData.contractAddress,
        data: callData,
        value: "0",
        gasLimit: DEFAULT_ERC20_GAS_LIMIT,
        gasPrice: gasPrice.toHexString(),
      };
    }
    if (contractType === ContractType.ERC721) {
      const callData = iface.encodeFunctionData("safeTransferFrom(address,address,uint256)", [
        address,
        paymentData.recipient,
        tokenId,
      ]);
      return {
        from: address,
        to: paymentData.contractAddress,
        data: callData,
        value: "0",
        gasLimit: DEFAULT_ERC20_GAS_LIMIT,
        gasPrice: gasPrice.toHexString(),
      };
    }
    if (contractType === ContractType.ERC1155) {
      const callData = iface.encodeFunctionData("safeTransferFrom", [
        address,
        paymentData.recipient,
        tokenId,
        paymentData.amount,
        "0x",
      ]);
      return {
        from: address,
        to: paymentData.contractAddress,
        data: callData,
        value: "0",
        gasLimit: DEFAULT_ERC20_GAS_LIMIT,
        gasPrice: gasPrice.toHexString(),
      };
    }
  };

  const sendTransactionFromMetamask = async () => {
    try {
      handleChainVerify();
    } catch (error) {
      return;
    }
    setLoading(true);
    // wonderWeb3.onConnect();
    try {
      await handleAllowance({ contractType: paymentData.contractType });
    } catch (error) {
      setSnackbarAlertMessage("You need to approve the token allowance first");
      setSnackbarAlertOpen(true);
      handleApproval({ contractType: paymentData.contractType });
    }

    let iabi = null;
    if (paymentData?.contractType === ContractType.ERC20) {
      iabi = ERC20abi;
    }
    if (paymentData?.contractType === ContractType.ERC721) {
      iabi = ERC721ABI;
    }
    if (paymentData?.contractType === ContractType.ERC1155) {
      iabi = ERC1155ABI;
    }
    const iface = new ethers.utils.Interface(iabi);
    const chain = paymentData?.chain;
    let transactionData: TransactionData;
    const gasPrice = await getGasPrice();

    const erc20DefaultDecimal = paymentData?.contractType === ContractType.ERC20 ? 18 : 1;
    const decimal = Number(paymentData?.decimal) || erc20DefaultDecimal;
    const bigChangedAmount = new BigNumber(paymentData.amount);
    const newDecimal = new BigNumber(10 ** decimal);
    let finalAmount = bigChangedAmount.times(newDecimal).toString();
    if (paymentData?.currency === "ETH" || paymentData?.currency === "MATIC") {
      transactionData = {
        from: address,
        to: paymentData.recipient,
        data: "0x00",
        value: finalAmount,
        gasLimit: DEFAULT_ERC20_GAS_LIMIT,
        gasPrice: gasPrice.toHexString(),
      };
    } else {
      transactionData = handleTransfer({
        contractType: paymentData.contractType,
        iface,
        gasPrice,
        finalAmount,
        tokenId,
      });
    }
    try {
      const transactionObj = await sendTransaction(transactionData);
      const txHash = transactionObj?.hash;
      linkCmtyPaymentsWithTransaction({
        variables: {
          input: {
            chain,
            fromAddress: address,
            txHash,
            paymentIds: [paymentData.id],
            orgId: activeOrg?.id,
          },
        },
      });
      setLoading(false);
      setSnackbarAlertMessage("Success!");
      setSnackbarAlertOpen(true);
    } catch (error) {
      const message = getMessageFromError(error);
      setLoading(false);
      setSnackbarAlertMessage(message);
      setSnackbarAlertOpen(true);
    }
  };

  return (
    <SharedSecondaryButton onClick={sendTransactionFromMetamask} disabled={disabled}>
      {loading ? (
        <CircularProgress
          size={30}
          thickness={5}
          sx={{
            color: "#2A8D5C",
            animationDuration: "10000ms",
          }}
        />
      ) : (
        "Pay"
      )}
    </SharedSecondaryButton>
  );
};

export default SingleWalletPayment;
