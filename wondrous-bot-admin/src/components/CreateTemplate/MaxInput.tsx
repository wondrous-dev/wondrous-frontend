import { Box } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import Switch from "components/Shared/Switch";
import Tooltip from "@mui/material/Tooltip";
import InformationTooltip from "components/Icons/information.svg";
import { StyledInformationTooltip } from "components/Shared/Tooltip";
import { useMemo } from "react";

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
  const { keyValue, stateKey, handleValueChange, value } = props;

  const infoLabel = INFO_LABELS[stateKey];

  const isActive = value || keyValue?.trim() === "";

  return (
    <Box display="flex" gap={isActive ? "10px" : "0px"} alignItems="center">
      <Box
        sx={{
          width: isActive ? "100%" : "0px",
          visibility: isActive ? "visible" : "hidden",
          transition: "width 0.3s ease-in-out, visibility 0.3s ease-in-out",
        }}
      >
        <CustomTextField
          autoFocus
          type="number"
          value={keyValue}
          onChange={(e) => {
            handleValueChange(e.target.value);
          }}
        />
      </Box>
      <Switch {...props} value={isActive} />
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
