import { Box } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import Switch from "components/Shared/Switch";
import Tooltip from "@mui/material/Tooltip";
import InformationTooltip from "components/Icons/information.svg";
import { StyledInformationTooltip } from "components/Shared/Tooltip";
const MaxInput = (props) => {
  const { keyValue, stateKey, setQuestSettings } = props;
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
            setQuestSettings((prev) => ({
              ...prev,
              [stateKey]: e.target.value,
            }));
          }}
        />
      </Box>
      <Switch {...props} />
      {stateKey === "maxSubmission" && (
        <StyledInformationTooltip
          placement="right"
          title="The maximum number of approved submissions each user can submit for this quest"
        >
          <img
            src={InformationTooltip}
            alt="information"
            style={{ width: "16px", height: "16px", marginLeft: "8px" }}
          />
        </StyledInformationTooltip>
      )}
      {stateKey === "maxApproval" && (
        <StyledInformationTooltip
          placement="right"
          title="The total number of approved submissions allowed for this quest"
        >
          <img
            src={InformationTooltip}
            alt="information"
            style={{ width: "16px", height: "16px", marginLeft: "8px" }}
          />
        </StyledInformationTooltip>
      )}
    </Box>
  );
};

export default MaxInput;
