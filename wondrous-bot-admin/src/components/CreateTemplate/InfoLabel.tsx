import { StyledInformationTooltip } from "components/Shared/Tooltip";
import InformationTooltip from "components/Icons/information.svg";

const KEYS = {
  MAX_SUBMISSION: "maxSubmission",
  MAX_APPROVAL: "maxApproval",
  MAX_PURCHASE: "maxPurchase",
  REQUIRE_REVIEW: "requireReview",
};

const INFO_LABELS = {
  [KEYS.MAX_SUBMISSION]: "The maximum number of approved submissions each user can submit for this quest",
  [KEYS.MAX_APPROVAL]: "The total number of approved submissions allowed for this quest",
  [KEYS.MAX_PURCHASE]: "The maximum number of times a user can purchase this item",
  [KEYS.REQUIRE_REVIEW]: "If enabled, all submissions will require review before being approved",
};

const InfoLabel = ({stateKey = null, title = null, imgStyle = {}}) => {
  const infoLabel = stateKey ? INFO_LABELS[stateKey] : title;

  return infoLabel ? (
    <StyledInformationTooltip placement="right" title={infoLabel}>
      <img src={InformationTooltip} alt="information" style={{ width: "16px", height: "16px", marginLeft: "8px", ...imgStyle }} />
    </StyledInformationTooltip>
  ) : null;
};

export default InfoLabel;
