import { useMutation } from "@apollo/client";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";

import BigNumber from "bignumber.js";

import { SharedSecondaryButton } from "components/Shared/styles";

import { ethers } from "ethers";
import { LINK_CMTY_PAYMENTS_WITH_TRANSACTION } from "graphql/mutations/payment";

import { useContext, useEffect, useMemo, useState } from "react";

import { ContractType, getMultisendAddress } from "services/web3/contractRouter";

import {
  approveERC20,
  batchTransferERC1155,
  batchTransferERC20,
  batchTransferERC721,
  checkERC1155Allowance,
  checkERC20Allowance,
  checkNFTAllowance,
  getERC1155Balance,
  getERC721Balance,
  setNFTApprovalForAll,
  setNFTApprovalForAll721,
} from "services/web3/tokenHelpers";

import GlobalContext from "utils/context/GlobalContext";
import useAlerts from "utils/hooks";

import { SUPPORTED_CHAINS } from "utils/web3Constants";
import { getMessageFromError, verifyChain } from "./utils";
import useWonderWeb3Modal from "services/web3/useWonderWeb3Modal";

const BatchPayments = ({ selectedPayments, paymentData, tokenIds, onPaymentCompleted }) => {
  const { activeOrg } = useContext(GlobalContext);
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();
  const [loading, setLoading] = useState(false);
  const paymentItems = useMemo(() => {
    return paymentData?.filter((item) => selectedPayments.includes(item.id));
  }, [paymentData, selectedPayments]);

  const getChainIdFromChainName = (chainName: string) => {
    const chainIdx = Object.values(SUPPORTED_CHAINS).findIndex((chainId) => chainId === chainName);
    const chainId = Object.keys(SUPPORTED_CHAINS)[chainIdx];
    return chainId;
  };

  const [linkCmtyPaymentsWithTransaction, { data: linkMetamaskPaymentData }] = useMutation(
    LINK_CMTY_PAYMENTS_WITH_TRANSACTION,
    {
      onCompleted: () => {
        const completedPaymentIds = paymentItems.map((item) => item.id);
        return onPaymentCompleted(completedPaymentIds);
      },
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

  const { chainId, address, walletProvider } = useWonderWeb3Modal();

  const conditions = useMemo(() => {
    const contractAddress = paymentItems?.[0]?.contractAddress;
    const chain = paymentItems?.[0]?.chain;
    const checkIfAllHavePayee = paymentItems?.every((item) => item?.recipientAddress);

    const checkIfAllSameCurrency = paymentItems?.every((item) => item?.contractAddress === contractAddress);

    const checkIfAllSameChain = paymentItems?.every((item) => item?.chain === chain);

    return {
      checkIfAllHavePayee,
      checkIfAllSameCurrency,
      checkIfAllSameChain,
      errorsList: [
        {
          condition: !checkIfAllHavePayee,
          message: "Some payments don't have a payee address",
        },
        {
          condition: !checkIfAllSameCurrency,
          message: "Some payments have different currencies",
        },
        {
          condition: !checkIfAllSameChain,
          message: "Some payments have different chains",
        },
      ],
    };
  }, [paymentItems]);

  const showBatchPayButton =
    conditions?.checkIfAllHavePayee && conditions?.checkIfAllSameCurrency && conditions?.checkIfAllSameChain;

  const handleChainVerify = ({ chain }) => {
    try {
      verifyChain({
        chain,
        connectedChainId: chainId,
      });
    } catch (error) {
      setSnackbarAlertMessage(`Please switch to ${chain} chain`);
      setSnackbarAlertOpen(true);
      throw new Error();
    }
  };

  const handleAllowance = async ({ contractType, tokenAddress, batchTransferContractAddress }) => {
    if (contractType === ContractType.ERC20) {
      return await approveERC20(
        walletProvider,
        tokenAddress,
        batchTransferContractAddress,
        ethers.constants.MaxUint256.toString()
      );
    }
    if (contractType === ContractType.ERC1155) {
      return await setNFTApprovalForAll(walletProvider, tokenAddress, batchTransferContractAddress);
    }
    if (contractType === ContractType.ERC721) {
      return await setNFTApprovalForAll721(walletProvider, tokenAddress, batchTransferContractAddress);
    }
  };

  const checkAllowance = async ({ tokenAddress, batchTransferContractAddress, contractType }) => {
    let allowance = 0;
    let balance = 0;
    const totalAmount = paymentItems.reduce((acc, item) => {
      const decimal = Number(item?.decimal);
      const bigChangedAmount = new BigNumber(item?.amount);
      const newDecimal = new BigNumber(10 ** decimal);
      let finalAmount = Number(bigChangedAmount.times(newDecimal).toString());
      return acc + finalAmount;
    }, 0);
    if (contractType === ContractType.ERC20) {
      allowance = await checkERC20Allowance(walletProvider, tokenAddress, address, batchTransferContractAddress);
    }

    if (contractType === ContractType.ERC721) {
      const isAllowed = await checkNFTAllowance(walletProvider, tokenAddress, batchTransferContractAddress, address);
      allowance = isAllowed ? totalAmount : 0;
      const erc721Balance = await getERC721Balance(walletProvider, tokenAddress, address);
      balance = Number(erc721Balance?.toString());
    }
    if (contractType === ContractType.ERC1155) {
      const isAllowed = await checkERC1155Allowance(
        walletProvider,
        tokenAddress,
        batchTransferContractAddress,
        address
      );
      try {
        balance = await Promise.all(
          Object.values(tokenIds).map(async (tokenId: string) => {
            try {
              const erc1155Balance = await getERC1155Balance(walletProvider, tokenAddress, address, tokenId);
              return Number(erc1155Balance?.toString());
            } catch (error) {
              return totalAmount;
            }
          })
        ).then((balances) => balances.reduce((acc, balance) => acc + balance, 0));
        allowance = isAllowed ? totalAmount : 0;
      } catch (error) {
        balance = totalAmount;
      }
    }
    const isAllowed = Number(allowance.toString()) >= totalAmount;
    if ((contractType === ContractType.ERC721 || contractType === ContractType.ERC1155) && balance < totalAmount) {
      throw new Error("not_enough_balance");
    }
    if (!isAllowed) {
      return handleAllowance({
        contractType,
        tokenAddress,
        batchTransferContractAddress,
      });
    }
  };

  const handleTransfer = async ({ contractType, tokenAddress, addresses, chainId }) => {
    const tokens = paymentItems.map((payment) => tokenIds[payment.id]);
    if (contractType === ContractType.ERC20) {
      const txHash = await batchTransferERC20(
        walletProvider,
        tokenAddress,
        addresses,
        paymentItems.map((item) => {
          const decimal = Number(item?.decimal) || 18;
          const bigChangedAmount = new BigNumber(item?.amount);
          const newDecimal = new BigNumber(10 ** decimal);
          let finalAmount = bigChangedAmount.times(newDecimal).toString();
          return finalAmount;
        }),
        chainId
      );
      return txHash;
    }
    if (contractType === ContractType.ERC1155) {
      const txHash = await batchTransferERC1155(
        walletProvider,
        tokenAddress,
        addresses,
        tokens,
        paymentItems.map((item) => {
          return item.amount;
        }),
        chainId
      );
      return txHash;
    }
    if (contractType === ContractType.ERC721) {
      const txHash = await batchTransferERC721(walletProvider, tokenAddress, addresses, tokens, chainId);
      return txHash;
    }
  };
  const sendTransactionFromMetamask = async () => {
    const paymentItem = paymentItems[0];
    setLoading(true);
    try {
      handleChainVerify({ chain: paymentItem?.chain });
    } catch (error) {
      setLoading(false);
      return;
    }
    const chainId = Number(getChainIdFromChainName(paymentItem?.chain)) || 137;

    const contractType = paymentItem?.contractType;

    const batchTransferContractAddress = getMultisendAddress(contractType, chainId);

    const tokenAddress = paymentItems[0]?.contractAddress;
    const addresses = paymentItems.map((item) => item?.recipientAddress);
    try {
      await checkAllowance({ tokenAddress, batchTransferContractAddress, contractType });
      const txHash = await handleTransfer({ contractType, tokenAddress, addresses, chainId });
      linkCmtyPaymentsWithTransaction({
        variables: {
          input: {
            chain: paymentItem?.chain,
            fromAddress: address,
            txHash: txHash.hash,
            paymentIds: selectedPayments,
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
    <Grid
      position="fixed"
      bgcolor="#FFEBDA"
      width="93%"
      bottom="10%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      padding="14px"
      borderRadius="16px"
      border="1px solid #000212"
      gap="6px"
    >
      <Box display="flex" flexDirection="column" gap="6px">
        {conditions?.errorsList?.map(({ condition, message }, idx) =>
          condition ? (
            <Typography color="black" fontSize="14px" fontFamily="Poppins" fontWeight={500} key={idx}>
              {message}
            </Typography>
          ) : null
        )}
      </Box>

      <SharedSecondaryButton disabled={!showBatchPayButton} onClick={sendTransactionFromMetamask}>
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
          "Batch pay"
        )}
      </SharedSecondaryButton>
    </Grid>
  );
};

export default BatchPayments;
