import { useQuery } from '@apollo/client';
import { ClickAwayListener } from '@mui/base';
import { Box, Grid, Popper } from '@mui/material';
import {
  CustomTextField,
  Label,
} from 'components/AddFormEntity/components/styles';
import SelectComponent from 'components/Shared/Select';
import { GET_QUESTS_FOR_ORG } from 'graphql/queries';
import { GET_ORG_DISCORD_ROLES } from 'graphql/queries/discord';
import { useContext, useMemo, useRef, useState } from 'react';
import { getTextForCondition } from 'utils/common';
import { QUEST_CONDITION_TYPES } from 'utils/constants';
import GlobalContext from 'utils/context/GlobalContext';

const CONDITION_MAP = [
  {
    value: QUEST_CONDITION_TYPES.DISCORD_ROLE,
    label: 'Discord Role',
  },
  {
    value: QUEST_CONDITION_TYPES.QUEST,
    label: 'Quest',
  },
];

const CONDITION_VALUES = {
  [QUEST_CONDITION_TYPES.DISCORD_ROLE]: 'discordRoleId',
  [QUEST_CONDITION_TYPES.QUEST]: 'questId',
};

const FilterGroup = ({ condition, handleChange, options }) => {
  return (
    <Box display='flex' gap='6px' alignItems='center'>
      <Label>Where</Label>
      <SelectComponent
        options={CONDITION_MAP}
        onChange={(value) => handleChange('type', value)}
        value={condition.type}
      />
      <SelectComponent
        options={options || []}
        onChange={(value) =>
          handleChange('conditionData', {
            [CONDITION_VALUES[condition.type]]: value,
          })
        }
        value={condition.value}
      />
    </Box>
  );
};

const DEFAULT_CONDITION = {
  type: QUEST_CONDITION_TYPES.DISCORD_ROLE,
  conditionData: {
    discordRoleId: null,
  },
};

const DynamicCondition = ({ value, setQuestSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeOrg } = useContext(GlobalContext);

  const [condition, setConditions] = useState({
    type: value?.type || null,
    conditionData: value?.conditionData || null,
  });

  //TODO paginate this
  const { data: getQuests } = useQuery(GET_QUESTS_FOR_ORG, {
    variables: {
      input: {
        orgId: activeOrg?.id,
        limit: 500
      }
    },
    skip: !isOpen,
  });

  const ref = useRef();
  const handleClickAway = () => {
    if (
      condition?.type !== value?.type ||
      condition?.conditionData !== value?.conditionData
    ) {
      setQuestSettings((prev) => ({
        ...prev,
        questConditions: [
          { type: condition.type, conditionData: condition?.conditionData },
        ],
      }));
    }
    setIsOpen(false);
  };

  const { data: getOrgDiscordRolesData } = useQuery(GET_ORG_DISCORD_ROLES, {
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !isOpen,
  });

  const addDefaultCondition = () => setConditions(DEFAULT_CONDITION);

  const openPopper = () => {
    if (Object.keys(condition).length === 0) {
      addDefaultCondition();
    }
    return setIsOpen(true);
  };

  const handleChange = (key, value) =>
    setConditions((prev) => ({
      ...prev,
      [key]: value,
    }));

  const getOptionsForCondition = (type) => {
    if (type === QUEST_CONDITION_TYPES.DISCORD_ROLE) {
      return getOrgDiscordRolesData?.getOrgDiscordRoles?.map((role) => ({
        value: role.id,
        label: role.name,
      }));
    }

    if (QUEST_CONDITION_TYPES.QUEST) {
      const quests = getQuests?.getQuestsForOrg?.map((quest) => ({
        value: quest.id,
        label: quest.title,
      }));
      return quests;
    }
    return [
      {
        value: null,
        label: 'No options',
      },
    ];
  };

  const nameForConditionValue = useMemo(() => {
    const item = getOptionsForCondition(condition?.type)?.find((item) => {
      return (
        item.value ===
        condition?.conditionData?.[CONDITION_VALUES[condition?.type]]
      );
    });
    return item?.label;
  }, [condition]);

  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent='onMouseDown'>
      <div>
        <CustomTextField
          disabled
          onClick={openPopper}
          placeholder='Add Condition'
          ref={ref}
          value={getTextForCondition({
            type: condition.type,
            name: nameForConditionValue,
          })}
        />
        <Popper
          open={isOpen}
          onClick={(e) => e.stopPropagation()}
          placement='bottom-start'
          anchorEl={ref.current}
          sx={{
            zIndex: 1000,
          }}
        >
          <Grid
            bgcolor='white'
            border='1px solid #000000'
            boxShadow='0px 4px 4px rgba(0, 0, 0, 0.25)'
            borderRadius='6px'
            container
            minWidth='300px'
            marginTop='4px'
            direction={'column'}
            gap='10px'
            padding='14px'
          >
            <FilterGroup
              condition={condition}
              handleChange={handleChange}
              options={getOptionsForCondition(condition.type)}
            />
          </Grid>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default DynamicCondition;
