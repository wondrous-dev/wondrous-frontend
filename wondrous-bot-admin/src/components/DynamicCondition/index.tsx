import { useLazyQuery, useQuery } from '@apollo/client';
import { ClickAwayListener } from '@mui/base';
import AddIcon from '@mui/icons-material/Add';
import { Box, ButtonBase, Grid, Popper } from '@mui/material';
import { Label } from 'components/AddFormEntity/components/styles';
import SelectComponent from 'components/Shared/Select';
import { GET_ORG_DISCORD_ROLES } from 'graphql/queries/discord';
import { useContext, useRef, useState } from 'react';
import GlobalContext from 'utils/context/GlobalContext';

const CONDITION_VALUES = {
  AND: 'and',
  OR: 'or',
};

const CONDITION_TYPES = [
  {
    value: CONDITION_VALUES.AND,
    label: 'And',
  },
  {
    value: CONDITION_VALUES.OR,
    label: 'Or',
  },
];

const CONDITION_MAP = [
  {
    value: 'discord_role',
    label: 'Discord Role',
  },
  {
    value: 'quest',
    label: 'Quest',
  },
];

const FilterGroup = ({ isFirst = true, condition, handleChange }) => {
  return (
    <Box display='flex' gap='6px' alignItems='center'>
      {/* {isFirst ? <Label>Where</Label> : null}
      {!isFirst && (
        <SelectComponent
          options={CONDITION_TYPES}
          onChange={(value) => handleChange('type', value)}
          value={condition.type}
        />
      )} */}
      <SelectComponent
        options={CONDITION_MAP}
        onChange={(value) => handleChange('key', value)}
        value={condition.key}
      />
      <SelectComponent
        options={CONDITION_MAP}
        onChange={(value) => handleChange('value', value)}
        value={condition.value}
      />
    </Box>
  );
};

const DEFAULT_CONDITION = {
  key: CONDITION_MAP[0].value,
  value: null,
  type: CONDITION_VALUES.AND,
};
// use for multiple conditions - similar to notion's filter groups
const DynamicCondition = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { activeOrg } = useContext(GlobalContext);

  const [conditions, setConditions] = useState([]);
  const ref = useRef();
  const handleClickAway = () => setIsOpen(false);
  const { data: getOrgDiscordRolesData } = useQuery(GET_ORG_DISCORD_ROLES, {
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !isOpen,
  });

  const addDefaultCondition = () =>
    setConditions([...conditions, DEFAULT_CONDITION]);
  const openPopper = () => {
    addDefaultCondition();
    return setIsOpen(true);
  };

  const handleChange = (idx) => (key, value) => {
    const newConditions = [...conditions];
    newConditions[idx][key] = value;
    console.log(newConditions, 'new cond');
    setConditions(newConditions);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent='onMouseDown'>
      <div>
        <button ref={ref} onClick={openPopper}>
          Click me
        </button>
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
            {conditions?.map((condition, idx) => {
              const isFirst = idx === 0;
              return (
                <FilterGroup
                  isFirst={isFirst}
                  condition={condition}
                  handleChange={handleChange(idx)}
                />
              );
            })}
            <ButtonBase
              onClick={addDefaultCondition}
              type='button'
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <AddIcon
                sx={{
                  color: '#4d4d4d',
                }}
              />
              <Label>Add Condition</Label>
            </ButtonBase>
          </Grid>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

const SingleCondition = () => {
  const { activeOrg } = useContext(GlobalContext);
  const ref = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const handleClickAway = () => setIsOpen(false);
  const { data: getOrgDiscordRolesData } = useQuery(GET_ORG_DISCORD_ROLES, {
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !isOpen,
  });
  const openPopper = () => {
    return setIsOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway} mouseEvent='onMouseDown'>
      <FilterGroup condition={DEFAULT_CONDITION} handleChange={() => {}} />
    </ClickAwayListener>
  );
};
export default SingleCondition;
