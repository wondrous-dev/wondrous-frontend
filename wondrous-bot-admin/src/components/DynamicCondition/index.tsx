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
import { QUEST_CONDITION_TYPES, QUEST_STATUSES } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import { useDiscordRoles } from "utils/discord";

const CONDITION_MAP = [
  {
    value: QUEST_CONDITION_TYPES.DISCORD_ROLE,
    label: "Discord Role",
  },
  {
    value: QUEST_CONDITION_TYPES.QUEST,
    label: "Quest",
  },
];

const CONDITION_VALUES = {
  [QUEST_CONDITION_TYPES.DISCORD_ROLE]: "discordRoleId",
  [QUEST_CONDITION_TYPES.QUEST]: "questId",
};

const FilterGroup = ({ condition, handleChange, options, handleClose }) => {
  const handleConditionDataChange = (value) => {
    let additionalParams: any = {};
    const isDiscordCondition = condition.type === QUEST_CONDITION_TYPES.DISCORD_ROLE;

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
          options={CONDITION_MAP}
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
      {condition.type === QUEST_CONDITION_TYPES.QUEST && (
        <>
          <Label marginLeft="8px">Exclude Quest</Label>
          <Switch
            onChange={() => {
              if (condition?.conditionData?.excludeQuest) {
                handleChange("conditionData", {
                  ...condition?.conditionData,
                  excludeQuest: false,
                });
              } else {
                handleChange("conditionData", {
                  ...condition?.conditionData,
                  excludeQuest: true,
                });
              }
            }}
            value={condition?.conditionData?.excludeQuest}
          />
        </>
      )}
    </Box>
  );
};

const DynamicCondition = ({ value, setQuestSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeOrg } = useContext(GlobalContext);

  const [condition, setConditions] = useState({
    type: value?.type || null,
    conditionData: value?.conditionData || null,
  });

  const { data: getQuests } = useQuery(GET_QUESTS_FOR_ORG, {
    variables: {
      input: {
        orgId: activeOrg?.id,
        limit: 500,
        status: QUEST_STATUSES.OPEN,
      },
    },
  });

  const ref = useRef();
  const handleClickAway = (data = null) => {
    if (!isOpen) return;
    let conditionItem = data?.conditionData ? data : condition;
    setQuestSettings((prev) => ({
      ...prev,
      questConditions: [condition],
    }));

    setIsOpen(false);
  };

  const roles = useDiscordRoles({
    orgId: activeOrg?.id,
  });

  const openPopper = () => {
    return setIsOpen(true);
  };

  const handleChange = (key, value) =>
    setConditions((prev) => ({
      ...prev,
      [key]: value,
    }));

  const getOptionsForCondition = useCallback(
    (type) => {
      if (type === QUEST_CONDITION_TYPES.DISCORD_ROLE) {
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

      if (type === QUEST_CONDITION_TYPES.QUEST) {
        const quests = getQuests?.getQuestsForOrg?.map((quest) => ({
          value: quest.id,
          label: quest.title,
        }));
        return quests;
      }
      return [
        {
          value: null,
          label: "No options",
        },
      ];
    },
    [getQuests, roles]
  );

  const nameForConditionValue = useMemo(() => {
    const item = getOptionsForCondition(condition?.type)?.find((item) => {
      return item.value === condition?.conditionData?.[CONDITION_VALUES[condition?.type]];
    });
    return item?.label;
  }, [condition, roles, getOptionsForCondition]);

  const onResetClick = () => {
    setConditions({
      type: null,
      conditionData: null,
    });
    setQuestSettings((prev) => ({
      ...prev,
      questConditions: [],
    }));
    setIsOpen(false);
  };
  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseDown">
      <div>
        <Box display="flex" alignItems="center" gap="4px">
          <CustomTextField
            onClick={openPopper}
            placeholder="Add Condition"
            ref={ref}
            value={getTextForCondition({
              type: condition.type,
              name: nameForConditionValue,
            })}
          />
          <ButtonBase onClick={onResetClick}>
            <CloseModalIcon strokeColor="black" />
          </ButtonBase>
        </Box>
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
