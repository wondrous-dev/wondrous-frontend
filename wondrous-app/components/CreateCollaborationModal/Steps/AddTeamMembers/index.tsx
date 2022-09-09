import React, { useCallback, useMemo, useState } from 'react';
import { Typography, InputAdornment } from '@mui/material';
import { createPortal } from 'react-dom';
import Box from '@mui/material/Box';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { LIMIT } from 'services/board';
import GradientHeading from 'components/GradientHeading';
import SearchIcon from 'components/Icons/search';
import { Org } from 'types/Org';
import Divider from 'components/Divider';
import { Button } from 'components/Button';
import { GET_ORG_ROLES, GET_ORG_USERS, SEARCH_ORG_USERS } from 'graphql/queries';
import palette from 'theme/palette';
import { SafeImage } from 'components/Common/Image';
import { Autocomplete, Option } from 'components/SearchTasks/styles';
import {
  CreateEntityAutocompleteOptionTypography,
  CreateEntityDefaultUserImage,
} from 'components/CreateEntity/CreateEntityModal/styles';
import CloseModalIcon from 'components/Icons/closeModal';
import differenceWith from 'lodash/differenceWith';
import eq from 'lodash/eq';
import debounce from 'lodash/debounce';
import { CREATE_ORG_INVITE_LINK } from 'graphql/mutations';
import { LINK } from 'utils/constants';
import ListBox from './Listbox';
import {
  PaperComponent,
  SelectedUsersWrapper,
  SelectedUserItem,
  CloseIconWrapper,
  Grid,
  TextField,
  SelectedCount,
} from './styles';

type Props = {
  org: Org;
  onCancel: () => void;
  onSubmit: ({ users }: any) => void | Promise<any>;
  footerRef: React.RefObject<HTMLDivElement>;
  selectedUsers: any;
  setUsers: any;
  existingUsersIds: Array<string>;
};

const AddTeamMembers = ({ org, onSubmit, onCancel, footerRef, selectedUsers, setUsers, existingUsersIds }: Props) => {
  const [hasMore, setHasMore] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchOrgUsers, { data: searchOrgUserResults }] = useLazyQuery(SEARCH_ORG_USERS);
  const {
    data: { getOrgUsers } = {},
    fetchMore,
    previousData,
  } = useQuery(GET_ORG_USERS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      orgId: org.id,
      limit: LIMIT,
    },
    onCompleted: ({ getOrgUsers }) => {
      const hasMoreData = getOrgUsers?.length >= LIMIT;
      if (!previousData && hasMoreData !== hasMore) setHasMore(hasMoreData);
    },
  });

  const [createOrgInviteLink] = useMutation(CREATE_ORG_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${LINK}/invite/${data?.createOrgInviteLink.token}`);
    },
    onError: (e) => {
      console.error(e);
    },
  });
  const [getOrgRoles, { data: orgRoles }] = useLazyQuery(GET_ORG_ROLES, {
    // onCompleted: (data) => {
    //   data?.getOrgRoles &&
    //     data?.getOrgRoles?.forEach((role) => {
    //       if (role?.default) {
    //         setRole(role?.id);
    //       }
    //     });
    // },
    onError: (e) => {
      console.error(e);
    },
    fetchPolicy: 'cache-and-network',
  });

  const users = inputValue ? searchOrgUserResults?.searchOrgUsers : getOrgUsers?.map((i) => i.user);

  const search = useCallback(debounce(searchOrgUsers, 1000), []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value) search({ variables: { queryString: e.target.value, orgId: org.id } });
  };

  const handleChange = (key, event, users) => setUsers({ ...selectedUsers, [key]: users });

  const handleFetchMore = () =>
    !inputValue &&
    fetchMore({ variables: { offset: getOrgUsers?.length } }).then(({ data }) =>
      setHasMore(data?.getOrgUsers?.length >= LIMIT)
    );

  const availableOptions = useMemo(
    () =>
      differenceWith(users, selectedUsers.members.concat(selectedUsers.admins), (a: any, b: any) =>
        eq(a.id, b.id)
      ).filter((user) => !existingUsersIds?.includes(user.id)),
    [selectedUsers, users, existingUsersIds]
  );

  const FIELDS_CONFIG = [
    {
      buttonLabel: 'Admin',
      key: 'admins',
      options: availableOptions,
    },
    {
      buttonLabel: 'Members',
      key: 'members',
      options: availableOptions,
    },
  ];

  const removeSelectedUser = (key, userId) =>
    setUsers({ ...selectedUsers, [key]: selectedUsers[key].filter((item) => item?.id !== userId) });

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
            <Box sx={{ width: '100%' }}>
              <Autocomplete
                disablePortal
                disableCloseOnSelect
                PaperComponent={PaperComponent}
                clearOnBlur
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
                value={selectedUsers[field.key]}
                ListboxComponent={ListBox}
                ListboxProps={{
                  handleFetchMore,
                  hasMore,
                }}
                onChange={(event, options) => {
                  handleChange(field.key, event, options);
                }}
                getOptionLabel={(option: any) => option?.username}
                renderTags={(tagValue, getTagProps) => null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    onChange={handleInputChange}
                    placeholder="Search users"
                    onBlur={() => {
                      if (inputValue) setInputValue('');
                    }}
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
                    {option?.profilePicture ? (
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
                      {option?.username}
                    </CreateEntityAutocompleteOptionTypography>
                  </Option>
                )}
              />
              <SelectedUsersWrapper>
                {selectedUsers[field.key]?.map((selected, idx) => (
                  <SelectedUserItem key={idx}>
                    {selected?.profilePicture ? (
                      <SafeImage
                        useNextImage={false}
                        src={selected?.profilePicture}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                        }}
                      />
                    ) : (
                      <CreateEntityDefaultUserImage />
                    )}
                    {selected?.username}
                    <CloseIconWrapper>
                      <CloseModalIcon onClick={() => removeSelectedUser(field.key, selected?.id)} />
                    </CloseIconWrapper>
                  </SelectedUserItem>
                ))}
              </SelectedUsersWrapper>
              <SelectedCount>{`${selectedUsers[field.key].length} ${field.key}`}</SelectedCount>
            </Box>
          </Grid>
          {idx !== FIELDS_CONFIG.length - 1 && <Divider my="18px" />}
        </>
      ))}
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
                disabled={!selectedUsers.admins.length}
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
function setInviteLink(arg0: string) {
  throw new Error('Function not implemented.');
}
