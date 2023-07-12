import { Box } from "@mui/material";
import { ContractType } from "services/web3/contractRouter";
import SingleWalletPayment from "./SingleWalletPayment";
import { StyledCheckbox } from "./styles";

const PaymentSelector = ({ paymentData, withPaymentButton = false, updatePaymentList, isChecked, tokenId, onPaymentCompleted }) => {
  const isPaymentButtonDisabled = !tokenId && [ContractType.ERC1155, ContractType.ERC721].includes(paymentData.contractType);
  return (
    <Box display="flex" gap="6px" alignItems="center">
      <StyledCheckbox
        checked={isChecked}
        disabled={isPaymentButtonDisabled}
        onChange={(e) => {
          updatePaymentList(paymentData.id, e.target.checked);
        }}
      />
      {withPaymentButton && <SingleWalletPayment 
      onPaymentCompleted={onPaymentCompleted}
      paymentData={paymentData} disabled={isPaymentButtonDisabled} tokenId={tokenId}/>}
    </Box>
  );
};

export default PaymentSelector;
