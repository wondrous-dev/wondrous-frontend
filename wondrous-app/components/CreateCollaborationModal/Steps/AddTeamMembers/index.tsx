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
import { PaperComponent, SelectedUsersWrapper, SelectedUserItem } from './styles';

type Props = {
  org: Org;
  onCancel: () => void;
  onSubmit: ({ users }: any) => void | Promise<any>;
  footerRef: React.RefObject<HTMLDivElement>;
};

const AddTeamMembers = ({ org, onSubmit, onCancel, footerRef }: Props) => {
  const [selectedUsers, setSelectedUsers] = useState({ admin: [], members: [] });
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

  const handleChange = (key, event, users) => setSelectedUsers({ ...selectedUsers, [key]: users });

  const handleFetchMore = () =>
    fetchMore({ variables: { offset: getOrgUsers?.length } }).then(({ data }) =>
      setHasMore(data?.getOrgUsers?.length >= 2)
    );

  const FIELDS_CONFIG = [
    {
      buttonLabel: 'Admin',
      key: 'admin',
      options: getOrgUsers || [],
    },
    {
      buttonLabel: 'Members',
      key: 'members',
      options: getOrgUsers || [],
    },
  ];

  const removeSelectedUser = (key, userId) =>
    setSelectedUsers({ ...selectedUsers, [key]: selectedUsers[key].filter((item) => item?.user?.id !== userId) });

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
      {FIELDS_CONFIG.map((field, idx) => (
        <>
          <Grid container direction="row" wrap="nowrap">
            <Box sx={{ flex: '0 0 94px' }}>
              <Box
                py="4px"
                px="8px"
                color="#CCBBFF"
                sx={{ background: '#282828', display: 'inline-block', fontWeight: '600' }}
                borderRadius="4px"
              >
                {field.buttonLabel}
              </Box>
            </Box>

            <Autocomplete
              disablePortal
              disableCloseOnSelect
              placeholder="Enter username..."
              PaperComponent={PaperComponent}
              options={field.options}
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
              onChange={(event, users) => handleChange(field.key, event, users)}
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
          <SelectedUsersWrapper>
            {selectedUsers[field.key]?.map((selected, idx) => (
              <SelectedUserItem onClick={() => removeSelectedUser(field.key, selected.user?.id)} key={idx}>
                {selected?.user?.username}
              </SelectedUserItem>
            ))}
          </SelectedUsersWrapper>
          {idx !== FIELDS_CONFIG.length - 1 && <Divider my="18px" />}
        </>
      ))}
      {footerRef.current
        ? createPortal(
            <Grid container gap="18px">
              <Button color="grey" onClick={onCancel}>
                Cancel
              </Button>
              <Button color="primary" type="submit" onClick={() => onSubmit({ users: selectedUsers })} disabled>
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
