import { useMutation } from "@apollo/client";
import { SharedSecondaryButton } from "components/Shared/styles";
import { ethers } from "ethers";
import { LINK_CMTY_PAYMENTS_WITH_TRANSACTION } from "graphql/mutations/payment";
import { useContext, useEffect, useState } from "react";
import { TransactionData } from "services/web3/types";
import useWonderWeb3 from "services/web3/useWonderWeb3";
import { ERC20abi } from "services/contracts/erc20.abi";
import GlobalContext from "utils/context/GlobalContext";
import { DEFAULT_ERC20_GAS_LIMIT, SUPPORTED_CHAINS } from "utils/web3Constants";
import { checkERC20Allowance, approveERC20, checkNFTAllowance, checkERC1155Allowance, setNFTApprovalForAll721 } from "services/web3/tokenHelpers";
import { useWeb3React } from "@web3-react/core";
import useWeb3 from "services/web3/useWeb3";
import useAlerts from "utils/hooks";
import ERC721ABI from "services/web3/abi/ERC721";
import ERC1155ABI from "services/web3/abi/ERC1155";
import BigNumber from "bignumber.js";
import { CircularProgress } from "@mui/material";
import { ContractType } from "services/web3/contractRouter";

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
}

const SingleWalletPayment = ({ paymentData , disabled = false, tokenId}: IProps) => {
  const [wrongChainError, setWrongChainError] = useState(null);
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const [signingError, setSigningError] = useState(null);
  const [incompatibleWalletError, setIncompatibleWalletError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { activeOrg } = useContext(GlobalContext);

  const [linkCmtyPaymentsWithTransaction, { data: linkMetamaskPaymentData }] = useMutation(
    LINK_CMTY_PAYMENTS_WITH_TRANSACTION,
    {
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

  useEffect(() => {
    wonderWeb3.activateAndStore("injected");
  }, []);
  const wonderWeb3 = useWonderWeb3();
  const { provider } = useWeb3();
  const { address, chain: connectedChain } = wonderWeb3;

  const getChainIdFromChainName = (chainName: string) => {
    const chainIdx = Object.values(SUPPORTED_CHAINS).findIndex((chainId) => chainId === chainName);
    const chainId = Object.keys(SUPPORTED_CHAINS)[chainIdx];
    return chainId;
  };
  useEffect(() => {
    setWrongChainError(null);
    const chain = getChainIdFromChainName(paymentData?.chain);
    if (chain && connectedChain) {
      if (chain !== SUPPORTED_CHAINS[chain]) {
        setWrongChainError(`Currently connected to the wrong network should be on ${chain}`);
      }
    }
  }, [connectedChain, paymentData?.chain]);

  const handleAllowance = ({contractType}) => {
    if (contractType === ContractType.ERC20) {
      return checkERC20Allowance(provider, paymentData.contractAddress, address, paymentData.recipient);
    }
    if (contractType === ContractType.ERC721) {
      return checkNFTAllowance(provider, paymentData.contractAddress, address, paymentData.recipient);
    }
    if (contractType === ContractType.ERC1155) {
      return checkERC1155Allowance(provider, paymentData.contractAddress, address, paymentData.recipient);
    }
  }

  const handleApproval = ({contractType}) => {
    if(contractType === ContractType.ERC20) {
      return approveERC20(provider, paymentData.contractAddress, address, paymentData.recipient);
    }
    if(contractType === ContractType.ERC721) {
      return setNFTApprovalForAll721(provider, paymentData.contractAddress, address);
    }
    if(contractType === ContractType.ERC1155) {
      return setNFTApprovalForAll721(provider, paymentData.contractAddress, address);
    }
  };

  const handleTransfer = ({contractType, iface, gasPrice, finalAmount, tokenId}) => {
    if(contractType === ContractType.ERC20) {
      const callData = iface.encodeFunctionData("transfer", [paymentData.recipient, finalAmount]);
      return {
        from: wonderWeb3?.address,
        to: paymentData.contractAddress,
        data: callData,
        value: "0",
        gasLimit: DEFAULT_ERC20_GAS_LIMIT,
        gasPrice: gasPrice.toHexString(),
      };

    }
    if(contractType === ContractType.ERC721) {
      console.log(address, paymentData.recipient, tokenId, 'BEFORE')
      const callData = iface.encodeFunctionData("safeTransferFrom(address,address,uint256)", [address, paymentData.recipient, tokenId]);
      console.log(callData, 'AFTER')
      return {
        from: wonderWeb3?.address,
        to: paymentData.contractAddress,
        data: callData,
        value: "0",
        gasLimit: DEFAULT_ERC20_GAS_LIMIT,
        gasPrice: gasPrice.toHexString(),
      };
    }
    if(contractType === ContractType.ERC1155) {
      const callData = iface.encodeFunctionData("safeTransferFrom", [wonderWeb3?.address, paymentData.recipient, tokenId, paymentData.amount, '0x']);
      return {
        from: wonderWeb3?.address,
        to: paymentData.contractAddress,
        data: callData,
        value: "0",
        gasLimit: DEFAULT_ERC20_GAS_LIMIT,
        gasPrice: gasPrice.toHexString(),              
      }
    }
  };
  
  const sendTransactionFromMetamask = async () => {
    setLoading(true);
    wonderWeb3.onConnect();
    try {
      await handleAllowance({contractType: paymentData.contractType});
    } catch (error) {
      console.log(error, "error");
      setSnackbarAlertMessage("You need to approve the token allowance first");
      setSnackbarAlertOpen(true);
      handleApproval({contractType: paymentData.contractType});
    }
    
    let iabi = null;
    if (paymentData?.contractType === ContractType.ERC20) {
      iabi = ERC20abi;
    }
    if(paymentData?.contractType === ContractType.ERC721) {
      iabi = ERC721ABI;
    }
    if(paymentData?.contractType === ContractType.ERC1155) {
      iabi = ERC1155ABI;
    }
    const iface = new ethers.utils.Interface(iabi);
    const chain = paymentData?.chain;
    if (chain !== SUPPORTED_CHAINS[connectedChain]) {
      setWrongChainError(`Please switch to ${chain} chain`);
      return;
    }
    let transactionData: TransactionData;
    const gasPrice = await wonderWeb3.getGasPrice();

    const decimal = Number(paymentData?.decimal);
    const bigChangedAmount = new BigNumber(paymentData.amount);
    const newDecimal = new BigNumber(10 ** decimal);
    let finalAmount = bigChangedAmount.times(newDecimal).toString();

    if (paymentData?.currency === "ETH") {
      transactionData = {
        from: wonderWeb3.address,
        to: paymentData.recipient,
        data: "0x00",
        value: finalAmount,
        gasLimit: DEFAULT_ERC20_GAS_LIMIT,
        gasPrice: gasPrice.toHexString(),
      };
    } else {
      transactionData = handleTransfer({contractType: paymentData.contractType, iface, gasPrice, finalAmount, tokenId})
      console.log(transactionData, 'transactionData')
    }
    try {
      const transactionObj = await wonderWeb3.sendTransaction(transactionData);
      const txHash = transactionObj?.hash;
      linkCmtyPaymentsWithTransaction({
        variables: {
          input: {
            chain,
            fromAddress: wonderWeb3.address,
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
      let message = "Error sending transaction";
      if (error?.code === 4001) {
        message = "Transaction rejected";
      }
      setLoading(false);
      setSnackbarAlertMessage(message);
      setSnackbarAlertOpen(true);
    }
  };

  const handlePaymentClick = () => sendTransactionFromMetamask();

  return (
    <SharedSecondaryButton onClick={handlePaymentClick} disabled={disabled}>
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
