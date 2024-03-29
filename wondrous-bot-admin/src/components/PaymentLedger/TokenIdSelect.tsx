import { ContractType } from "services/web3/contractRouter";
import { Label } from "components/QuestsList/styles";
import { Input } from "components/EditableText/styles";
import TextField from "components/Shared/TextField";
import { CustomTextField } from "components/AddFormEntity/components/styles";

const TokenIdSelect = ({ payment, setTokenIds, value }) => {
  if (payment.contractType === ContractType.ERC20 || payment.contractType === ContractType.ERC1155) {
    const labelText = payment.contractType === ContractType.ERC20 ? "Not applicable" : value;
    return (
      <Label fontSize="14px" lineHeight="14px" textAlign="center" width="100%">
        {labelText}
      </Label>
    );
  }
  const handleChange = (value) => {
    return setTokenIds((prev) => ({
      ...prev,
      [payment.id]: value,
    }));
  };
  return (
    <CustomTextField
      onChange={(e) => handleChange(e.target.value)}
      label={"Enter token ID"}
      fullWidth
      value={value}
      variant="standard"
      placeholder={"#12353"}
    />
  );
};

export default TokenIdSelect;
