import React, { useState } from 'react';
import { Typography, TextField, InputAdornment } from '@mui/material';
import { createPortal } from 'react-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useQuery } from '@apollo/client';
import { LIMIT } from 'services/board';
import { Autocomplete } from 'components/SearchTasks/styles';
import GradientHeading from 'components/GradientHeading';
import SearchIcon from 'components/Icons/search';
import { Org } from 'types/Org';
import Divider from 'components/Divider';
import { Button } from 'components/Button';
import { GET_ORG_USERS } from 'graphql/queries';
import palette from 'theme/palette';

type Props = {
  org: Org;
  onCancel: () => void;
  // TODO: Replace any
  onSubmit: ({ users }: any) => void | Promise<any>;
  footerRef: React.RefObject<HTMLDivElement>;
};

const AddTeamMembers = ({ org, onSubmit, onCancel, footerRef }: Props) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { data: { getOrgUsers } = {} } = useQuery(GET_ORG_USERS, {
    variables: {
      orgId: org.id,
      // FIXME we need to implement search here
      limit: LIMIT,
    },
  });

  const handleChange = (event, users) => {
    setSelectedUsers(users);
  };

  return (
    <div>
      <GradientHeading fontSize={24} mb="20px" gradient="89.67deg, #CCBBFF 37.16%, #00BAFF 108.05%">
        Add your team members
      </GradientHeading>

      <Typography color={palette.grey250}>
        Import members from your project to this collaboration. After, you will get an invite link to add their project
        lead to add their team.
      </Typography>

      <Divider my="18px" />
      <Grid container direction="row" wrap="nowrap">
        <Box sx={{ flex: '0 0 94px' }}>
          <Box
            py="4px"
            px="8px"
            color="#CCBBFF"
            sx={{ background: '#282828', display: 'inline-block' }}
            borderRadius="4px"
          >
            Admin
          </Box>
        </Box>

        <Autocomplete
          disablePortal
          placeholder="Enter username..."
          options={getOrgUsers || []}
          sx={{
            color: 'white',
            flex: '1 1 auto',
            '.MuiOutlinedInput-root': {
              background: '#141414',
            },
            '*': {
              color: 'white',
            },
          }}
          multiple
          openOnFocus
          onChange={handleChange}
          getOptionLabel={(option: any) => option?.user?.username}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="start">
                    {' '}
                    <SearchIcon color={palette.highlightBlue} />
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
            />
          )}
        />
      </Grid>

      <Divider my="18px" />
      <Grid container direction="row" wrap="nowrap">
        <Box sx={{ flex: '0 0 94px' }}>
          <Box
            py="4px"
            px="8px"
            color="#CCBBFF"
            sx={{ background: '#282828', display: 'inline-block' }}
            borderRadius="4px"
          >
            Members
          </Box>
        </Box>

        <Autocomplete
          disablePortal
          placeholder="Enter username..."
          options={getOrgUsers || []}
          sx={{
            color: 'white',
            flex: '1 1 auto',
            '.MuiOutlinedInput-root': {
              background: '#141414',
            },
            '*': {
              color: 'white',
            },
          }}
          multiple
          openOnFocus
          onChange={handleChange}
          getOptionLabel={(option: any) => option?.user?.username}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <InputAdornment position="start">
                    {' '}
                    <SearchIcon />
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
            />
          )}
        />
      </Grid>
      {footerRef.current
        ? createPortal(
            <Grid container gap="18px">
              <Button color="grey" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                onClick={() => onSubmit({ users: selectedUsers })}
                disabled={!selectedUsers.length}
              >
                Next
              </Button>
            </Grid>,
            footerRef.current
          )
        : null}
    </div>
  );
};

export default AddTeamMembers;
