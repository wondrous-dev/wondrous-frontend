import { ContractType } from "services/web3/contractRouter";
import { Label } from "components/QuestsList/styles";
import { Input } from "components/EditableText/styles";
import TextField from "components/Shared/TextField";
import { CustomTextField } from "components/AddFormEntity/components/styles";

const TokenIdSelect = ({ payment, setTokenIds }) => {
  if (payment.contractType === ContractType.ERC20) {
    return (
      <Label fontSize="14px" lineHeight="14px" textAlign="center" width="100%">
        Not applicable
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
      variant="standard"
      placeholder={"#12353"}
    />
  );
};

export default TokenIdSelect;
