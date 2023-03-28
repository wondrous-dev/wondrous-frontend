import { useQuery } from '@apollo/client/react';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import { SafeImage } from 'components/Common/Image';
import SearchIcon from 'components/Icons/search';
import { SEARCH_ORG_USERS } from 'graphql/queries/org';
import React, { useMemo, useState } from 'react';
import palette from 'theme/palette';
import Grid from '@mui/material/Grid';
import useMediaQuery from 'hooks/useMediaQuery';
import { SEARCH_POD_USERS } from 'graphql/queries';

export const filterUsers = (users) =>
  users?.map(({ thumbnailPicture, profilePicture, username, id }) => ({
    profilePicture: thumbnailPicture || profilePicture,
    label: username,
    value: id,
  })) || [];

const LeaderboardSearch = ({ orgId, podId, assignee, setAssignee, handleGetCompletedTasksBetweenPeriods }) => {
  const { isTabletScreen } = useMediaQuery();
  const [assigneeString, setAssigneeString] = useState('');
  const { data: orgUsersData, refetch: refetchSearchOrgUsers } = useQuery(SEARCH_ORG_USERS, {
    fetchPolicy: 'cache-and-network',
    skip: !orgId,
    variables: {
      orgIds: [orgId],
      searchString: '',
    },
  });

  const { data: podUsersData, refetch: refetchSearchPodUsers } = useQuery(SEARCH_POD_USERS, {
    fetchPolicy: 'cache-and-network',
    skip: !podId,
    variables: {
      podId,
      searchString: '',
    },
  });

  const userData = podId ? podUsersData?.searchPodUsers : orgUsersData?.searchOrgUsers;
  const refetchUserData = podId ? refetchSearchPodUsers : refetchSearchOrgUsers;

  const handleInputChange = (event, newInputValue) => {
    setAssigneeString(newInputValue);
    refetchUserData({
      searchString: newInputValue,
      ...(podId ? { podId } : { orgIds: [orgId] }),
    });
  };

  const options = useMemo(() => filterUsers(userData), [userData]);

  return (
    <Grid container alignItems="center" justifyContent="end" item xs={12} md={3} width="fit-content">
      <Autocomplete
        fullWidth={isTabletScreen}
        options={options}
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
          width: '100%',
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
    </Grid>
  );
};

export default LeaderboardSearch;
