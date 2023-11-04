import { SubmissionsArtwork, MembersArtwork } from "./Images";

import { EMPTY_STATE_TYPES } from "utils/constants";
import { Grid } from "@mui/material";
import { Label } from "components/QuestsList/styles";

const EMPTY_STATE_MAP = {
  [EMPTY_STATE_TYPES.SUBMISSIONS]: {
    title: "No submissions yet",
    Image: SubmissionsArtwork,
  },
  [EMPTY_STATE_TYPES.MEMBERS]: {
    title: "No members yet",
    Image: MembersArtwork,
  },
  [EMPTY_STATE_TYPES.PAYMENTS]: {
    title: "No payments to process",
    Image: MembersArtwork,
  },
  [EMPTY_STATE_TYPES.NFT]: {
    title: "You have no community NFTs yet",
    Image: MembersArtwork,
  },

  [EMPTY_STATE_TYPES.PURCHASES]: {
    title: "This item has no purchases yet",
    Image: MembersArtwork,
  },
  [EMPTY_STATE_TYPES.CATEGORIES]: {
    title: 'No categories yet',
    Image: SubmissionsArtwork
  }
};

const EmptyState = ({ type, sx = {}, labelColor = "white", children = null, customType = {title: '', Image: null} }) => {
  const { title, Image } = customType ? customType : EMPTY_STATE_MAP[type]
  if (!title || !Image) return null;

  return (
    <Grid
      border="1px solid white"
      height="200px"
      borderRadius="12px"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap="24px"
      flexDirection="column"
      {...sx}
    >
      <Image />
      <Label color={labelColor} fontSize="14px" fontWeight={500}>
        {title}
      </Label>
      {children}
    </Grid>
  );
};

export default EmptyState;
