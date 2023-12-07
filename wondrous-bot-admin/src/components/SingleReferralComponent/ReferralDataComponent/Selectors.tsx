import { Box, Grid } from "@mui/material";
import AutocompleteOptionsComponent from "components/AddFormEntity/components/AutocompleteComponent";
import InfoLabel from "components/CreateTemplate/InfoLabel";
import { QUALIFYING_ACTION_TYPES } from "utils/constants";
import { Label } from "components/CreateTemplate/styles";
import { ButtonIconWrapper } from "components/Shared/styles";
import DeleteIcon from "components/Icons/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useGlobalContext } from "utils/hooks";
import CreateQuestContext from "utils/context/CreateQuestContext";
import { useContext } from "react";
import ErrorField from "components/Shared/ErrorField";
import { KEYS_MAP } from "../constants";
import { ListboxComponent } from "components/Shared/FetchMoreListbox";

const TYPES_MAP = {
  [QUALIFYING_ACTION_TYPES.PURCHASE]: {
    label: "Which store item(s) should this apply to?",
    placeholder: "Select products",
  },
  [QUALIFYING_ACTION_TYPES.QUEST]: {
    label: "Which quest(s) should this apply to?",
    placeholder: "Select quests",
  },
  [QUALIFYING_ACTION_TYPES.ANY_QUEST]: {
    label: "Which quest(s) should this apply to?",
    placeholder: "Select quests",
  },
};

const ActionEntityButtons = ({ idx = 0, referralItemType, handleDelete, handleAdd, canAddItem }) => {
  if (referralItemType === QUALIFYING_ACTION_TYPES.ANY_QUEST) return null;
  return (
    <>
      {idx !== 0 && (
        <ButtonIconWrapper onClick={handleDelete}>
          <DeleteIcon />
        </ButtonIconWrapper>
      )}
      {canAddItem && (
        <ButtonIconWrapper onClick={handleAdd}>
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

const SelectorsComponent = ({
  setReferralItemData,
  referralItemData,
  handleEntityChange,
  options = [],
  handleFetchMore,
  hasMore,
}) => {
  const values = referralItemData[KEYS_MAP[referralItemData.type]];

  const { errors, setErrors } = useContext(CreateQuestContext);

  const typeConfig = TYPES_MAP[referralItemData.type];

  const handleDelete = (idx) => {
    setReferralItemData((prev) => ({
      ...prev,
      questIds: prev.questIds.filter((_, index) => index !== idx),
    }));
  };

  const handleAdd = () =>
    setReferralItemData((prev) => ({
      ...prev,
      questIds: [...prev.questIds, ""],
    }));

  if (!typeConfig) return null;

  return (
    <Grid display="flex" flexDirection="column" gap="12px">
      <Label fontWeight={600}>{typeConfig?.label}</Label>
      {!values?.length ? (
        <Box display="flex" gap="14px" alignItems="center">
          <AutocompleteOptionsComponent
            options={options}
            value={null}
            error={errors?.questIds?.[0]}
            placeholder={typeConfig?.placeholder}
            onChange={(value) => handleEntityChange(value, 0, referralItemData.type)}
            bgColor="#E8E8E8"
          />
          <ActionEntityButtons
            referralItemType={referralItemData.type}
            handleDelete={handleDelete}
            handleAdd={handleAdd}
            canAddItem={false}
          />
        </Box>
      ) : null}
      {values?.map((value, idx) => {
        return (
          <Box display="flex" gap="4px" flexDirection="column" key={idx}>
            <Box display="flex" gap="14px" alignItems="center">
              <AutocompleteOptionsComponent
                options={options}
                value={value}
                error={errors?.questIds?.[idx]}
                placeholder={typeConfig?.placeholder}
                onChange={(value) => handleEntityChange(value, idx, referralItemData.type)}
                bgColor="#E8E8E8"
                autocompletProps={{
                  ListboxComponent: ListboxComponent,
                }}
                listBoxProps={{
                  handleFetchMore: async () => handleFetchMore(referralItemData?.type),
                  hasMore,
                }}
              />
              <ActionEntityButtons
                idx={idx}
                handleAdd={handleAdd}
                handleDelete={() => handleDelete(idx)}
                canAddItem={idx === values.length - 1 && values[idx]}
                referralItemType={referralItemData.type}
              />
            </Box>
            <ErrorField errorText={errors?.questIds?.[idx]} />
          </Box>
        );
      })}
    </Grid>
  );
};

export default SelectorsComponent;
