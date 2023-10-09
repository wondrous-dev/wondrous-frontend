import { useQuery } from "@apollo/client";
import { ClickAwayListener } from "@mui/base";
import { Box, ButtonBase, Grid, Popper } from "@mui/material";
import { CustomTextField, Label } from "components/AddFormEntity/components/styles";
import AutocompleteComponent from "components/Autocomplete";
import CloseModalIcon from "components/Icons/CloseModal";
import SelectComponent from "components/Shared/Select";
import Switch from "components/Shared/Switch";
import { GET_QUESTS_FOR_ORG } from "graphql/queries";
import { useCallback, useContext, useMemo, useRef, useState } from "react";
import { getTextForCondition } from "utils/common";
import { CONDITION_TYPES, QUEST_STATUSES } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import { useDiscordRoles } from "utils/discord";
import AddIcon from "@mui/icons-material/Add";
import { ButtonIconWrapper } from "components/Shared/styles";
import useLevels from "utils/levels/hooks";

const CONDITION_MAP = [
  {
    value: CONDITION_TYPES.DISCORD_ROLE,
    label: "Discord Role",
  },
  {
    value: CONDITION_TYPES.QUEST,
    label: "Quest",
  },
  {
    value: CONDITION_TYPES.LEVEL,
    label: "Level",
  },
];

const CONDITION_VALUES = {
  [CONDITION_TYPES.DISCORD_ROLE]: "discordRoleId",
  [CONDITION_TYPES.QUEST]: "questId",
  [CONDITION_TYPES.LEVEL]: "minLevel",
};

const FilterGroup = ({ condition, handleChange, options, handleClose, typeOptions }) => {
  const handleConditionDataChange = (value) => {
    let additionalParams: any = {};
    const isDiscordCondition = condition.type === CONDITION_TYPES.DISCORD_ROLE;

    if (isDiscordCondition) {
      const discordGuildId = options.find((item) => item.value === value)?.discordGuildId;
      additionalParams.discordGuildId = discordGuildId;
    }
    handleChange("conditionData", {
      [CONDITION_VALUES[condition.type]]: value,
      ...additionalParams,
    });
    if (isDiscordCondition) {
      handleClose({
        type: condition.type,
        conditionData: {
          [CONDITION_VALUES[condition.type]]: value,
          ...additionalParams,
        },
      });
    }
  };
  return (
    <Box display="flex" gap="6px" alignItems="center">
      <Label>Where</Label>
      <Box minWidth="150px">
        <SelectComponent
          options={typeOptions}
          onChange={(value) => {
            handleChange("type", value);
            handleChange("conditionData", null);
          }}
          value={condition.type}
        />
      </Box>
      <Box minWidth="150px">
        <AutocompleteComponent
          options={options || []}
          handleChange={handleConditionDataChange}
          value={condition.value || condition.conditionData?.[CONDITION_VALUES[condition.type]]}
        />
      </Box>
      {condition.type === CONDITION_TYPES.QUEST && (
        <>
          <Label marginLeft="8px">Exclude Quest</Label>
          <Switch
            onChange={() => {
              if (condition?.conditionData?.exclusiveQuest) {
                handleChange("conditionData", {
                  ...condition?.conditionData,
                  exclusiveQuest: false,
                });
              } else {
                handleChange("conditionData", {
                  ...condition?.conditionData,
                  exclusiveQuest: true,
                });
              }
            }}
            value={condition?.conditionData?.exclusiveQuest}
          />
        </>
      )}
    </Box>
  );
};

const DynamicCondition = ({ value, handleUpdate, options, stateKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeOrg } = useContext(GlobalContext);

  const fetchConditions = useMemo(() => {
    return {
      [CONDITION_TYPES.QUEST]: options.includes(CONDITION_TYPES.QUEST),
      [CONDITION_TYPES.DISCORD_ROLE]: options.includes(CONDITION_TYPES.DISCORD_ROLE),
      [CONDITION_TYPES.LEVEL]: options.includes(CONDITION_TYPES.LEVEL),
    };
  }, [options]);

  const [condition, setCondition] = useState({
    type: null,
    conditionData: null,
  });

  const { data: getQuests } = useQuery(GET_QUESTS_FOR_ORG, {
    variables: {
      input: {
        orgId: activeOrg?.id,
        limit: 500,
        status: QUEST_STATUSES.OPEN,
      },
      skip: fetchConditions[CONDITION_TYPES.QUEST] ? false : true,
    },
  });

  const ref = useRef();

  const handleClickAway = (data = null) => {
    if (!isOpen) return;
    setIsOpen(false);
    let conditionItem = data?.conditionData ? data : condition;

    if(!conditionItem?.conditionData || !conditionItem?.type) return;
    handleUpdate((prev) => {
      const prevState = prev[stateKey] || [];
      return {
        ...prev,
        [stateKey]: [...prevState, conditionItem],
      }
    });
    setCondition({
      type: null,
      conditionData: null,
    });
  };

  const roles = useDiscordRoles({
    orgId: activeOrg?.id,
    skip: fetchConditions[CONDITION_TYPES.DISCORD_ROLE] ? false : true,
  });

  const { levels } = useLevels({
    orgId: activeOrg?.id,
    shouldFetch: fetchConditions[CONDITION_TYPES.LEVEL] ? false : true,
  });

  const openPopper = () => {
    return setIsOpen(true);
  };

  const handleChange = (key, value) =>
    setCondition((prev) => ({
      ...prev,
      [key]: value,
    }));

  const getOptionsForCondition = useCallback(
    (type) => {
      if (type === CONDITION_TYPES.DISCORD_ROLE) {
        const allRoles = roles
          .map((role) =>
            role.roles.map((newRole) => ({
              ...newRole,
              discordGuildId: role.guildId,
            }))
          )
          .flat();
        return allRoles?.map((role) => ({
          value: role.id,
          label: role.name,
          discordGuildId: role.discordGuildId,
        }));
      }

      if (type === CONDITION_TYPES.QUEST) {
        const quests = getQuests?.getQuestsForOrg?.map((quest) => ({
          value: quest.id,
          label: quest.title,
        }));
        return quests;
      }
      if (type === CONDITION_TYPES.LEVEL) {
        return Object.keys(levels).map((key) => ({
          label: levels[key],
          value: parseInt(key),
        }));
      }
      return [
        {
          value: null,
          label: "No options",
        },
      ];
    },
    [getQuests, roles, levels]
  );

  const nameForConditionValue = (condition) => {
    const item = getOptionsForCondition(condition?.type)?.find((item) => {
      return item.value === condition?.conditionData?.[CONDITION_VALUES[condition?.type]];
    });
    return item?.label;
  };

  const addCondition = () => {
    const hasCondition = value.some((item) => {
      if (
        item.type === condition.type &&
        item.conditionData[CONDITION_VALUES[condition.type]] === condition[CONDITION_VALUES[condition.type]]
      ) {
        return true;
      }
      return false;
    });
    if (!hasCondition) {
      handleUpdate((prev) => ({
        ...prev,
        key: [...prev[stateKey], condition],
      }));
    }
    handleClickAway();
    setCondition({
      type: null,
      conditionData: null,
    });
  };

  const removeCondition = (condition) => {
    const { type, conditionData } = condition;
    const newConditions = value?.filter((item) => {
      if (item.type === type && item.conditionData[CONDITION_VALUES[type]] === conditionData[CONDITION_VALUES[type]]) {
        return false;
      }
      return true;
    });
    handleUpdate((prev) => ({
      ...prev,
      [stateKey]: newConditions,
    }));
  };

  const typeOptions = useMemo(() => {
    return CONDITION_MAP.filter((item) => options.includes(item.value));
  }, [options]);
  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseDown">
      <div>
        <Box display="flex" alignItems="center" gap="4px">
          <CustomTextField
            onClick={openPopper}
            placeholder="Add Condition"
            ref={ref}
            value={getTextForCondition({
              type: condition?.type,
              name: nameForConditionValue(condition),
              exclusiveQuest: condition?.conditionData?.exclusiveQuest,
            })}
          />
          <ButtonIconWrapper
            style={{
              height: "30px",
              width: "35px",
              marginLeft: "8px",
            }}
            onClick={addCondition}
          >
            <AddIcon
              sx={{
                color: "black",
              }}
            />
          </ButtonIconWrapper>
          {/* <ButtonBase onClick={onResetClick}>
            <CloseModalIcon strokeColor="black" />
          </ButtonBase> */}
        </Box>
        {value?.map((conditionItem) => (
          <Box display="flex" alignItems="center" gap="4px" marginTop="12px">
            <CustomTextField
              disabled
              style={{
                color: "grey",
              }}
              placeholder="Add Condition"
              value={getTextForCondition({
                type: conditionItem.type,
                name: nameForConditionValue(conditionItem),
                exclusiveQuest: conditionItem?.conditionData?.exclusiveQuest,
              })}
            />
            <ButtonBase onClick={() => removeCondition(conditionItem)}>
              <CloseModalIcon strokeColor="black" />
            </ButtonBase>
          </Box>
        ))}
        <Popper
          open={isOpen}
          onClick={(e) => e.stopPropagation()}
          placement="bottom-start"
          anchorEl={ref.current}
          sx={{
            zIndex: 1000,
          }}
        >
          <Grid
            bgcolor="white"
            border="1px solid #000000"
            boxShadow="0px 4px 4px rgba(0, 0, 0, 0.25)"
            borderRadius="6px"
            container
            minWidth="300px"
            marginTop="4px"
            direction={"column"}
            gap="10px"
            padding="14px"
          >
            <FilterGroup
              condition={condition}
              handleChange={handleChange}
              typeOptions={typeOptions}
              handleClose={handleClickAway}
              options={getOptionsForCondition(condition.type)}
            />
          </Grid>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default DynamicCondition;
