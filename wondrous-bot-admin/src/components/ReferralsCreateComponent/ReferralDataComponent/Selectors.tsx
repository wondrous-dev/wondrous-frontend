import { Box, Grid } from "@mui/material";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import InfoLabel from "components/CreateTemplate/InfoLabel";
import { QUALIFYING_ACTION_TYPES } from "utils/constants";
import { Label } from "components/CreateTemplate/styles";
import { ButtonIconWrapper } from "components/Shared/styles";
import DeleteIcon from "components/Icons/Delete";
import AddIcon from "@mui/icons-material/Add";

const TYPES_MAP = {
  [QUALIFYING_ACTION_TYPES.PURCHASE]: {
    label: "Which products should this apply to?",
    placeholder: "Select products",
  },
  [QUALIFYING_ACTION_TYPES.QUEST]: {
    label: "Which quest(s) should this apply to?",
    placeholder: "Select quests",
  },
};

const KEYS_MAP = {
  [QUALIFYING_ACTION_TYPES.PURCHASE]: "storeItemId",
  [QUALIFYING_ACTION_TYPES.QUEST]: "questIds",
};

const SelectorsComponent = ({ setReferralItemData, referralItemData, handleEntityChange, options = [] }) => {
  const values = referralItemData[KEYS_MAP[referralItemData.type]];

  const typeConfig = TYPES_MAP[referralItemData.type];

  const Buttons = ({ idx }) => {
    return (
      <>
        {idx !== 0 && (
          <ButtonIconWrapper
            onClick={() => {
              setReferralItemData((prev) => ({
                ...prev,
                questIds: prev.questIds.filter((_, index) => index !== idx),
              }));
            }}
          >
            <DeleteIcon />
          </ButtonIconWrapper>
        )}
        {idx === values.length - 1 && (
          <ButtonIconWrapper
            onClick={() => {
              setReferralItemData((prev) => ({
                ...prev,
                questIds: [...prev.questIds, ""],
              }));
            }}
          >
            <AddIcon
              sx={{
                color: "black",
              }}
            />
          </ButtonIconWrapper>
        )}
      </>
    );
  };

  return (
    <Grid display="flex" flexDirection="column" gap="12px">
      <Label fontWeight={600}>{typeConfig?.label}</Label>
      {values?.map((value, idx) => (
        <Box display="flex" gap="14px" alignItems="center">
          <AutocompleteOptionsComponent
            options={options}
            value={value}
            placeholder={typeConfig?.placeholder}
            onChange={(value) => handleEntityChange(value, idx)}
            bgColor="#E8E8E8"
          />
          <Buttons idx={idx} />
        </Box>
      ))}
    </Grid>
  );
};

export default SelectorsComponent;
