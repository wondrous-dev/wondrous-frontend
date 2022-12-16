import { EXPORT_PAYMENT_CSV_TYPE } from 'utils/constants';
import { format } from 'date-fns';

const exportSubmissionPaymentCsv = ({ unpaidSubmissions, exportCSVType, isPod = false }) => {
  let headers = [];
  if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.UTOPIA) {
    headers = ['Name', 'Wallet', 'Amount', 'Denominated in', 'Pay-out Token'];
  } else if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.PARCEL) {
    headers = ['Name(Optional)', 'Address/ENS', 'Amount', 'Token Address/Token Symbol', 'Symbol'];
  } else if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.PLAIN) {
    headers = ['Username', 'Address/ENS', 'Amount', 'Token Address', 'Token Name', 'Symbol', 'Chain', 'Decimals'];
  }
  const rows = [[headers]];
  if (!unpaidSubmissions || Object.keys(unpaidSubmissions).length === 0) {
    return;
  }
  const paymentsArray = [];

  for (const [submissionId, value] of Object.entries(unpaidSubmissions)) {
    const unpaidSubmission: any = value;
    const paymentData = {
      username: unpaidSubmission.payeeUsername,
      recipientAddress: unpaidSubmission.payeeActiveEthAddress,
      tokenName: unpaidSubmission.tokenName,
      tokenSymbol: unpaidSubmission.symbol,
      tokenAddress: unpaidSubmission.tokenAddress,
      amount: unpaidSubmission.amount,
      chain: unpaidSubmission.chain,
      decimal: unpaidSubmission.decimal,
    };
    paymentsArray.push(paymentData);
  }

  paymentsArray.forEach((paymentData) => {
    const assigneeUsername = paymentData.username || '';
    const wallet = paymentData?.recipientAddress || '';
    const paymentAmount = paymentData?.amount || '';
    const tokenSymbol = paymentData?.tokenSymbol || '';

    let newRow;
    if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.UTOPIA) {
      newRow = [assigneeUsername, wallet, paymentAmount, 'USD', tokenSymbol];
    } else if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.PARCEL) {
      let tokenOrSymbol = paymentData?.tokenAddress;
      if (paymentData?.tokenAddress === '0x0000000000000000000000000000000000000000') {
        tokenOrSymbol = tokenSymbol;
      }
      newRow = [assigneeUsername, wallet, paymentAmount, tokenOrSymbol, tokenSymbol];
    } else if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.PLAIN) {
      let tokenAddress = paymentData?.tokenAddress;
      if (paymentData?.tokenAddress === '0x0000000000000000000000000000000000000000') {
        tokenAddress = '';
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
    }
    rows.push(newRow);
  });
  let csvContent = 'data:text/csv;charset=utf-8,';
  rows.forEach((rowArray) => {
    const row = rowArray.join(',');
    csvContent += `${row}\r\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `wonderverse_submission_payment_${format(new Date(), 'MM/dd/yyyy')}.csv`);
  document.body.appendChild(link); // Required for FF
  link.click();
};

export default exportSubmissionPaymentCsv;
