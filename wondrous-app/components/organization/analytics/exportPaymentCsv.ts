import { EXPORT_PAYMENT_CSV_TYPE } from 'utils/constants';
import { format } from 'date-fns';

export const exportPaymentCSV = ({ paymentsData, exportCSVType, fromTime, toTime, isPod = false }) => {
  let headers = [];
  if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.UTOPIA) {
    headers = ['Name', 'Wallet', 'Amount', 'Denominated in', 'Pay-out Token'];
  } else if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.PARCEL) {
    headers = ['Name(Optional)', 'Address/ENS', 'Amount', 'Token Address/Token Symbol', 'Symbol'];
  } else if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.PLAIN) {
    headers = ['Username', 'Address/ENS', 'Amount', 'Token Address', 'Token Name', 'Symbol', 'Chain', 'Decimals'];
  }
  const rows = [[headers]];
  if (!paymentsData?.contributorTaskData) {
    return;
  }
  const { contributorTaskData, userToPaymentMethod, userToRewardAmount } = paymentsData;
  contributorTaskData.forEach((contributor) => {
    const assigneeId = contributor?.assigneeId;
    const assigneeUsername = contributor?.assigneeUsername || '';
    const wallet = contributor?.assigneeWallet || '';
    const paymentMethod = userToPaymentMethod[assigneeId];
    const paymentAmount = userToRewardAmount[assigneeId] || 0;
    if (!assigneeId) {
      return;
    }

    let newRow;
    if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.UTOPIA) {
      newRow = [assigneeUsername, wallet, paymentAmount, 'USD', paymentMethod?.symbol];
    } else if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.PARCEL) {
      let tokenOrSymbol = paymentMethod?.tokenAddress;
      if (paymentMethod?.tokenAddress === '0x0000000000000000000000000000000000000000') {
        tokenOrSymbol = paymentMethod?.symbol;
      }
      newRow = [assigneeUsername, wallet, paymentAmount, tokenOrSymbol, paymentMethod?.symbol];
    } else if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.PLAIN) {
      let tokenAddress = paymentMethod?.tokenAddress;
      if (tokenAddress === '0x0000000000000000000000000000000000000000') {
        tokenAddress = '';
      }
      newRow = [
        assigneeUsername,
        wallet,
        paymentAmount,
        tokenAddress,
        paymentMethod?.tokenName,
        paymentMethod?.symbol,
        paymentMethod?.chain,
        paymentMethod?.decimal,
      ];
    }
    rows.push(newRow);
  });
  let csvContent = 'data:text/csv;charset=utf-8,';
  rows.forEach(function (rowArray) {
    let row = rowArray.join(',');
    csvContent += row + '\r\n';
  });
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `wonderverse_contributor_payment_${format(new Date(fromTime), 'MM/dd/yyyy')}_to_${format(
      new Date(toTime),
      'MM/dd/yyyy'
    )}.csv`
  );
  document.body.appendChild(link); // Required for FF
  link.click();
};
