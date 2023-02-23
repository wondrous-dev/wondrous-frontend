import { useQuery } from '@apollo/client/react';
import { Autocomplete, InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { SafeImage } from 'components/Common/Image';
import {
  OptionDiv,
  OptionTypography,
  StyledAutocomplete,
  StyledAutocompletePopper,
  StyledChip,
} from 'components/CreateEntity/styles';
import SearchIcon from 'components/Icons/search';
import { SEARCH_ORG_USERS } from 'graphql/queries/org';
import React, { useState } from 'react';
import palette from 'theme/palette';

export const filterUsers = (users) => {
  if (!users) {
    return [];
  }

  return users.map((user) => ({
    profilePicture: user?.thumbnailPicture || user?.profilePicture,
    label: user?.username,
    value: user?.id,
  }));
};

const LeaderboardSearch = ({ orgId, assignee, setAssignee, handleGetCompletedTasksBetweenPeriods }) => {
  const [assigneeString, setAssigneeString] = useState('');
  const { data: orgUsersData, refetch: refetchSearchOrgUsers } = useQuery(SEARCH_ORG_USERS, {
    skip: !orgId,
    variables: {
      orgIds: [orgId],
      searchString: '',
    },
  });

  const handleInputChange = (event, newInputValue) => {
    setAssigneeString(newInputValue);
    refetchSearchOrgUsers({
      searchString: newInputValue,
      orgIds: [orgId],
    });
  };
  return (
    <Autocomplete
      forcePopupIcon={false}
      options={filterUsers(orgUsersData?.searchOrgUsers)}
      onOpen={() => {}}
      renderInput={(params) => {
        const InputProps = {
          ...params?.InputProps,
          type: 'autocomplete',
          startAdornment:
            assignee && assigneeString ? <StyledChip label={assigneeString} onDelete={() => setAssignee(null)} /> : '',
          endAdornment: (
            <InputAdornment
              position="end"
              sx={{
                width: '14px',
                height: '14px',
              }}
            >
              <SearchIcon color={palette.white} />
            </InputAdornment>
          ),
        };
        return (
          <TextField
            {...params}
            sx={{
              color: palette.white,
              height: '34px',
              fontFamily: 'Space Grotesk',
              fontSize: '13px',
              fontWeight: '500px',
              minWidth: '360px',
              background: '#191919',
              borderRadius: '8px',
              '& input::placeholder': {
                color: palette.grey58,
                fontWeight: 500,
              },
              '& .MuiInputBase-root': {
                padding: '0 14px',
                height: '100%',
              },
            }}
            placeholder="Select members..."
            InputLabelProps={{ shrink: false }}
            InputProps={InputProps}
            inputProps={{
              ...params.inputProps,
              style: {
                padding: 0,
                opacity: assignee ? '0' : '1',
              },
            }}
          />
        );
      }}
      value={assignee}
      inputValue={assigneeString}
      onInputChange={handleInputChange}
      onChange={(_, __, reason) => {
        if (reason === 'clear') {
          setAssignee(null);
          handleGetCompletedTasksBetweenPeriods();
        }
      }}
      renderOption={(props, option) => (
        <OptionDiv
          onClick={(event) => {
            setAssignee(option);
            props?.onClick(event);
          }}
        >
          {option?.profilePicture && (
            <SafeImage
              useNextImage={false}
              src={option?.profilePicture}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '15px',
              }}
              alt="Profile picture"
            />
          )}
          <OptionTypography>{option?.label}</OptionTypography>
        </OptionDiv>
      )}
    />
  );
};

export default LeaderboardSearch;
