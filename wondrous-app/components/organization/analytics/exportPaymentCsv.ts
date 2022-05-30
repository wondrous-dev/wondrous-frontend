import CSVModal, { EXPORT_PAYMENT_CSV_TYPE } from './CSVModal';
import { format } from 'date-fns';

export const exportPaymentCSV = ({ paymentsData, exportCSVType, fromTime, toTime, isPod = false }) => {
    let headers = [];
    if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.UTOPIA) {
      headers = ['Name', 'Wallet', 'Amount', 'Pay-out Token', 'Chain'];
    } else if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.PARCEL) {
      headers = ['Name(Optional)', 'Address/ENS', 'Amount', 'Token Address/Token Symbol', 'Chain'];
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
  
      let tokenOrSymbol;
      if (
        paymentMethod?.tokenAddress === '0x0000000000000000000000000000000000000000' ||
        paymentMethod?.symbol === 'USDC'
      ) {
        tokenOrSymbol = paymentMethod?.symbol;
      } else {
        tokenOrSymbol = paymentMethod?.tokenAddress || '';
      }
      let newRow = [assigneeUsername, wallet, paymentAmount, tokenOrSymbol, paymentMethod?.chain];
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
      `wonderverse_contributor_data_${format(new Date(fromTime), 'MM/dd/yyyy')}_to_${format(
        new Date(toTime),
        'MM/dd/yyyy'
      )}.csv`
    );
    document.body.appendChild(link); // Required for FF
    link.click();
  };