import { useQuery } from '@apollo/client/react';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { SafeImage } from 'components/Common/Image';
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
      options={filterUsers(orgUsersData?.searchOrgUsers)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Select members..."
          sx={{
            input: {
              color: palette.white,
              fontWeight: 500,
              '&::placeholder': {
                color: palette.grey58,
              },
            },
            fontFamily: 'Space Grotesk',
            fontSize: '13px',
            fontWeight: '500',
            minWidth: '360px',
            background: '#191919',
            borderRadius: '8px',
            '& .MuiInputBase-root': {
              padding: '0 14px',
            },
          }}
        />
      )}
      value={assignee}
      inputValue={assigneeString}
      onInputChange={handleInputChange}
      onChange={(_, __, reason) => {
        if (reason === 'clear') {
          setAssignee(null);
          handleGetCompletedTasksBetweenPeriods();
        }
      }}
      popupIcon={<SearchIcon />}
      sx={{
        '& .MuiAutocomplete-popupIndicator': { transform: 'none' },
        '& .MuiAutocomplete-clearIndicator': { color: palette.grey58 },
      }}
      renderOption={(props, option) => (
        <ListItem
          sx={{
            display: 'flex',
            gap: '12px',
            '&:hover': {
              background: palette.grey78,
              cursor: 'pointer',
            },
          }}
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
              alt={`Profile picture ${option?.label}`}
            />
          )}
          <Typography color={palette.white} fontWeight="500">
            {option?.label}
          </Typography>
        </ListItem>
      )}
    />
  );
};

export default LeaderboardSearch;
