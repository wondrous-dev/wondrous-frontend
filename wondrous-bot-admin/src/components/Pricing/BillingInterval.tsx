import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { BillingIntervalToggleButton } from "./styles";

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
      <BillingIntervalToggleButton
        value={BillingIntervalValue.monthly}
        onClick={handleSetBillingInterval(BillingIntervalValue.monthly)}
        $selected={selected === BillingIntervalValue.monthly}
      >
        {BillingIntervalValue.monthly}
      </BillingIntervalToggleButton>
      <BillingIntervalToggleButton
        value={BillingIntervalValue.annual}
        onClick={handleSetBillingInterval(BillingIntervalValue.annual)}
        $selected={selected === BillingIntervalValue.annual}
      >
        {BillingIntervalValue.annual}
      </BillingIntervalToggleButton>
    </ToggleButtonGroup>
  );
};

export default BillingInterval;
