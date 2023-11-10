import { Box, Grid } from "@mui/material";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import InfoLabel from "components/CreateTemplate/InfoLabel";
import { QUALIFYING_ACTION_TYPES } from "utils/constants";
import { Label } from "components/CreateTemplate/styles";

const TYPES_MAP = {
  [QUALIFYING_ACTION_TYPES.PURCHASE]: {
    label: "Which products should this apply to?",
    placeholder: "Select products",
  },
  [QUALIFYING_ACTION_TYPES.QUEST]: {
    label: "Which quests should this apply to?",
    placeholder: "Select quests",
  },
};

const KEYS_MAP = {
  [QUALIFYING_ACTION_TYPES.PURCHASE]: "storeItemId",
  [QUALIFYING_ACTION_TYPES.QUEST]: "questId",
};

const SelectorsComponent = ({ referralItemData, handleEntityChange, options = [] }) => {
  const handleChange = (value) => {
    handleEntityChange({
      [KEYS_MAP[referralItemData.type]]: value,
    });
  };

  console.log(referralItemData, 'ref data')
  const value = referralItemData[KEYS_MAP[referralItemData.type]];

  const typeConfig = TYPES_MAP[referralItemData.type];

  return (
    <Grid display="flex" flexDirection="column" gap="12px">
      <Label fontWeight={600}>{typeConfig?.label}</Label>
      <Box display="flex" gap="14px" alignItems="center">
        <AutocompleteOptionsComponent
          options={options}
          value={value}
          placeholder={typeConfig?.placeholder}
          onChange={handleChange}
          bgColor="#E8E8E8"
        />
        <InfoLabel
          imgStyle={{
            marginLeft: "0",
          }}
          title="//TODO: Select qualifying action"
        />
      </Box>
    </Grid>
  );
};

export default SelectorsComponent;
