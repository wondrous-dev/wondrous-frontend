import { Box } from "@mui/material";
import Ethereum from "assets/ethereum";
import Polygon from "assets/polygonMaticLogo.svg";
import { SharedSecondaryButton } from "components/Shared/styles";

export const MB_LIMIT = 30;

export const COMMUNITY_BADGE_CHAIN_SELECT_OPTIONS = [
  {
    label: "Ethereum",
    value: "ethereum",
    icon: (
      <Ethereum
        style={{
          width: "20px",
          marginRight: "8px",
        }}
      />
    ),
  },
  {
    label: "Polygon",
    value: "polygon",
    icon: (
      <img
        style={{
          width: "20px",
          marginRight: "8px",
        }}
        src={Polygon}
      />
    ),
  },
  ...(import.meta.env.VITE_PRODUCTION
    ? []
    : [
        {
          label: "Goerli",
          value: "goerli",
          icon: (
            <Ethereum
              style={{
                width: "20px",
                marginRight: "8px",
              }}
            />
          ),
        },
      ]),
];

export const CONTRACT_LABELS = {
  ERC721: "ERC721",
  ERC1155: "ERC1155",
};

export const ModalFooterComponent = ({ loading, handleSubmit, buttonText = "Create NFT" }) => {
  if (loading) return null;
  return (
    <Box width="100%" display="flex" justifyContent="center" alignItems="center" bgcolor="#2A8D5C" padding="9px">
      <SharedSecondaryButton onClick={handleSubmit} type="button">
        {buttonText}
      </SharedSecondaryButton>
    </Box>
  );
};
