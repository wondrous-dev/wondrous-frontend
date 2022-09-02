import React, { useState } from 'react';
import { Typography, TextField, InputAdornment, Grid } from '@mui/material';
import { createPortal } from 'react-dom';
import Box from '@mui/material/Box';
import { useQuery } from '@apollo/client';
import { LIMIT } from 'services/board';
import GradientHeading from 'components/GradientHeading';
import SearchIcon from 'components/Icons/search';
import { Org } from 'types/Org';
import Divider from 'components/Divider';
import { Button } from 'components/Button';
import { GET_ORG_USERS } from 'graphql/queries';
import palette from 'theme/palette';
import { SafeImage } from 'components/Common/Image';
import { Autocomplete, Option } from 'components/SearchTasks/styles';
import {
  CreateEntityAutocompleteOptionTypography,
  CreateEntityDefaultUserImage,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { StyledChip } from 'components/CreateEntity/styles';
import ListBox from './Listbox';
import { PaperComponent } from './styles';

type Props = {
  org: Org;
  onCancel: () => void;
  onSubmit: ({ users }: any) => void | Promise<any>;
  footerRef: React.RefObject<HTMLDivElement>;
};

const AddTeamMembers = ({ org, onSubmit, onCancel, footerRef }: Props) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const {
    data: { getOrgUsers } = {},
    fetchMore,
    previousData,
  } = useQuery(GET_ORG_USERS, {
    variables: {
      orgId: org.id,
      limit: 2,
    },
    onCompleted: ({ getOrgUsers }) => {
      const hasMoreData = getOrgUsers?.length >= 2;
      if (!previousData && hasMoreData !== hasMore) setHasMore(hasMoreData);
    },
  });

  const handleChange = (event, users) => setSelectedUsers(users);

  const handleFetchMore = () =>
    fetchMore({ variables: { offset: getOrgUsers?.length } }).then(({ data }) =>
      setHasMore(data?.getOrgUsers?.length >= 2)
    );

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
            sx={{ background: '#282828', display: 'inline-block', fontWeight: '600' }}
            borderRadius="4px"
          >
            Admin
          </Box>
        </Box>

        <Autocomplete
          disablePortal
          disableCloseOnSelect
          placeholder="Enter username..."
          PaperComponent={PaperComponent}
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
          limitTags={1}
          ListboxComponent={ListBox}
          ListboxProps={{
            handleFetchMore,
            hasMore,
          }}
          onChange={handleChange}
          getOptionLabel={(option: any) => option?.user?.username}
          renderTags={(tagValue, getTagProps) =>
            tagValue.map((option, index) => <StyledChip label={option.user.username} {...getTagProps({ index })} />)
          }
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
          renderOption={(props, option) => (
            <Option {...props}>
              {option.profilePicture ? (
                <SafeImage
                  useNextImage={false}
                  src={option?.profilePicture}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <CreateEntityDefaultUserImage />
              )}

              <CreateEntityAutocompleteOptionTypography>
                {option?.user?.username}
              </CreateEntityAutocompleteOptionTypography>
            </Option>
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
            sx={{ background: '#282828', display: 'inline-block', fontWeight: '600' }}
            borderRadius="4px"
          >
            Members
          </Box>
        </Box>

        <Autocomplete
          disablePortal
          placeholder="Enter username..."
          PaperComponent={PaperComponent}
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
          ListboxComponent={ListBox}
          ListboxProps={{
            handleFetchMore,
            hasMore,
          }}
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
