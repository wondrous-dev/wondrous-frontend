import { Box } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import Switch from "components/Shared/Switch";
import Tooltip from "@mui/material/Tooltip";
import InformationTooltip from "components/Icons/information.svg";
import { StyledInformationTooltip } from "components/Shared/Tooltip";

const KEYS = {
  MAX_SUBMISSION: "maxSubmission",
  MAX_APPROVAL: "maxApproval",
  MAX_PURCHASE: "maxPurchase",
};

const INFO_LABELS = {
  [KEYS.MAX_SUBMISSION]: "The maximum number of approved submissions each user can submit for this quest",
  [KEYS.MAX_APPROVAL]: "The total number of approved submissions allowed for this quest",
  [KEYS.MAX_PURCHASE]: "The maximum number of times a user can purchase this item",
};

const MaxInput = (props) => {
  const { keyValue, stateKey, handleValueChange } = props;

  const infoLabel = INFO_LABELS[stateKey];

  return (
    <Box display="flex" gap={keyValue ? "10px" : "0px"} alignItems="center">
      <Box
        sx={{
          width: keyValue ? "100%" : "0px",
          visibility: keyValue ? "visible" : "hidden",
          transition: "width 0.3s ease-in-out, visibility 0.3s ease-in-out",
        }}
      >
        <CustomTextField
          autoFocus
          type="number"
          value={keyValue}
          onChange={(e) => {
            handleValueChange(e.target.value)}}
        />
      </Box>
      <Switch {...props} />
      {infoLabel ? (
        <StyledInformationTooltip placement="right" title={infoLabel}>
          <img
            src={InformationTooltip}
            alt="information"
            style={{ width: "16px", height: "16px", marginLeft: "8px" }}
          />
        </StyledInformationTooltip>
      ) : null}
    </Box>
  );
};

export default MaxInput;
