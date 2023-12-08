import { format } from "date-fns";
import { SUPPORTED_CHAINS, SUPPORTED_CHAIN_IDS } from "utils/web3Constants";

export const exportSubmissionPaymentCsv = (data) => {
  let headers = ["Username", "Address/ENS", "Amount", "Token Address", "Token Name", "Symbol", "Chain", "Decimals"];

  const rows = [[headers]];
  if (!data || Object.keys(data).length === 0) {
    return;
  }
  const paymentsArray = [];

  for (const [_, value] of Object.entries(data)) {
    const unpaidSubmission: any = value;
    const paymentData = {
      username: unpaidSubmission.discordUsername,
      recipientAddress: unpaidSubmission.recipientAddress,
      tokenName: unpaidSubmission.tokenName,
      tokenSymbol: unpaidSubmission.tokenName,
      tokenAddress: unpaidSubmission.contractAddress,
      amount: unpaidSubmission.amount,
      chain: unpaidSubmission.chain,
      decimal: unpaidSubmission.decimal,
    };
    paymentsArray.push(paymentData);
  }

  paymentsArray.forEach((paymentData) => {
    const assigneeUsername = paymentData.username || "";
    const wallet = paymentData?.recipientAddress || "";
    const paymentAmount = paymentData?.amount || "";
    const tokenSymbol = paymentData?.tokenSymbol || "";

    let newRow;
    let tokenAddress = paymentData?.tokenAddress;
    if (paymentData?.tokenAddress === "0x0000000000000000000000000000000000000000") {
      tokenAddress = "";
    }
    newRow = [
      assigneeUsername,
      wallet,
      paymentAmount,
      tokenAddress,
      paymentData?.tokenName,
      tokenSymbol,
      paymentData?.chain,
      paymentData?.decimal,
    ];
    rows.push(newRow);
  });
  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach((rowArray) => {
    const row = rowArray.join(",");
    csvContent += `${row}\r\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `wonderverse_quest_payment_${format(new Date(), "MM/dd/yyyy")}.csv`);
  document.body.appendChild(link); // Required for FF
  link.click();
};

export const verifyChain = ({ chain, connectedChainId }) => {
  if (chain && connectedChainId) {
    if (chain !== SUPPORTED_CHAINS[connectedChainId]) {
      throw new Error();
    }
  }
};

export const getMessageFromError = (error) => {
  let message = "Something went wrong";
  if (error === "not_enough_balance") {
    message = "You don't have enough balance to make this transaction";
  }
  if (error?.code === 4001) {
    message = "Transaction rejected";
  }

  return message;
};
