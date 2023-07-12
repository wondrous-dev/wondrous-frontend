import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { BillingIntervalButton } from "./styles";

export enum BillingIntervalValue {
  monthly = "monthly",
  annual = "annual",
}

const BillingInterval = ({ onClick, selected }) => {
  const handleSetBillingInterval = (value: BillingIntervalValue) => () => onClick(() => value);
  return (
    <ToggleButtonGroup
      sx={{
        borderRadius: "8px",
        background: "#4A4A4D",
      }}
    >
      <BillingIntervalButton
        value={BillingIntervalValue.monthly}
        onClick={handleSetBillingInterval(BillingIntervalValue.monthly)}
        $selected={selected === BillingIntervalValue.monthly}
      >
        {BillingIntervalValue.monthly}
      </BillingIntervalButton>
      <BillingIntervalButton
        value={BillingIntervalValue.annual}
        onClick={handleSetBillingInterval(BillingIntervalValue.annual)}
        $selected={selected === BillingIntervalValue.annual}
      >
        {BillingIntervalValue.annual}
      </BillingIntervalButton>
    </ToggleButtonGroup>
  );
};

export default BillingInterval;
