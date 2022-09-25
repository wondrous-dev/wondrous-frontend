import React, { useCallback, useMemo, useState } from 'react';
import { Typography, InputAdornment } from '@mui/material';
import { createPortal } from 'react-dom';
import Box from '@mui/material/Box';
import { useLazyQuery, useQuery } from '@apollo/client';
import { LIMIT } from 'services/board';
import GradientHeading from 'components/GradientHeading';
import SearchIcon from 'components/Icons/search';
import { Org } from 'types/Org';
import Divider from 'components/Divider';
import { Button } from 'components/Button';
import { SEARCH_ORG_USERS } from 'graphql/queries';
import palette from 'theme/palette';
import { SafeImage } from 'components/Common/Image';
import { Autocomplete, Option } from 'components/SearchTasks/styles';
import {
  CreateEntityApplicationsSelectRender,
  CreateEntityAutocompleteOptionTypography,
  CreateEntityDefaultUserImage,
  CreateEntityOption,
  CreateEntityOptionLabel,
  CreateEntitySelect,
  CreateEntitySelectArrowIcon,
  CreateEntitySelectWrapper,
  CreateEntityWrapper,
} from 'components/CreateEntity/CreateEntityModal/styles';
import CloseModalIcon from 'components/Icons/closeModal';
import differenceWith from 'lodash/differenceWith';
import eq from 'lodash/eq';
import debounce from 'lodash/debounce';
import { LinkIcon } from 'components/Icons/taskModalIcons';
import { GET_ORG_ROLES, GET_PARENT_ORG_CONTRIBUTORS } from 'graphql/queries/org';
import { NewInviteLinkModal } from 'components/Common/NewInviteLinkModal/InviteLink';
import { PERMISSIONS } from 'utils/constants';
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
  onSubmit: () => void | Promise<any>;
  footerRef: React.RefObject<HTMLDivElement>;
  selectedUsers: any;
  setUsers: any;
  footerLeftRef: React.RefObject<HTMLDivElement>;
  collabData: Org;
};

const AddTeamMembers = ({
  org,
  onSubmit,
  onCancel,
  footerRef,
  selectedUsers,
  setUsers,
  footerLeftRef,
  collabData,
}: Props) => {
  const [hasMore, setHasMore] = useState(false);
  const [inviteLinkModalIsOpen, setInviteLinkModalIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchOrgUsers, { data: searchOrgUserResults }] = useLazyQuery(SEARCH_ORG_USERS);
  const { data: orgRoles } = useQuery(GET_ORG_ROLES, {
    onError: (e) => {
      console.error(e);
    },
    variables: {
      orgId: collabData.id,
    },
    skip: !collabData.id,
    fetchPolicy: 'cache-and-network',
    onCompleted: ({ getOrgRoles }) => {
      const adminMemberRole = getOrgRoles?.reduce(
        (acc, next) => {
          if (next.permissions.includes(PERMISSIONS.FULL_ACCESS) && !acc.adminRole) {
            acc.adminRole = next;
          }
          if (!acc.memberRole && !next.permissions.includes(PERMISSIONS.FULL_ACCESS)) {
            acc.memberRole = next;
          }
          return acc;
        },
        { adminRole: null, memberRole: null }
      );
      setUsers({ ...selectedUsers, ...adminMemberRole });
    },
  });

  const {
    data: { getParentOrgsContributors } = {},
    fetchMore,
    previousData,
  } = useQuery(GET_PARENT_ORG_CONTRIBUTORS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      sharedOrgId: collabData.id,
      limit: LIMIT,
    },
    onCompleted: (data) => {
      const hasMoreData = data?.getParentOrgsContributors?.length >= LIMIT;
      if (!previousData && hasMoreData !== hasMore) setHasMore(hasMoreData);
    },
  });

  const users = inputValue ? searchOrgUserResults?.searchOrgUsers : getParentOrgsContributors;

  const search = useCallback(debounce(searchOrgUsers, 1000), []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value) search({ variables: { searchString: e.target.value, orgId: org.id } });
  };

  const handleChange = (key, event, users) => setUsers({ ...selectedUsers, [key]: users });

  const handleFetchMore = () =>
    !inputValue &&
    fetchMore({ variables: { offset: getParentOrgsContributors?.length } }).then(({ data }) =>
      setHasMore(data?.getParentOrgsContributors?.length >= LIMIT)
    );

  const availableOptions = useMemo(
    () => differenceWith(users, selectedUsers.members.concat(selectedUsers.admins), (a: any, b: any) => eq(a.id, b.id)),
    [selectedUsers, users]
  );

  const FIELDS_CONFIG = [
    {
      buttonLabel: 'Admin',
      key: 'admins',
      options: availableOptions,
      roleKey: 'adminRole',
    },
    {
      buttonLabel: 'Members',
      key: 'members',
      options: availableOptions,
      roleKey: 'memberRole',
    },
  ];

  const removeSelectedUser = (key, userId) =>
    setUsers({ ...selectedUsers, [key]: selectedUsers[key].filter((item) => item?.id !== userId) });

  return (
    <div>
      <NewInviteLinkModal
        orgOrPodName={collabData?.name}
        orgId={collabData?.id}
        open={inviteLinkModalIsOpen}
        onClose={() => setInviteLinkModalIsOpen(false)}
      />
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
              <Box sx={{ display: 'flex', gap: '10px' }}>
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
                  onChange={(event, options) => handleChange(field.key, event, options)}
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
                <CreateEntitySelectWrapper style={{ alignItems: 'center', flexWrap: 'nowrap', width: '30%' }}>
                  <CreateEntityWrapper>
                    <CreateEntitySelect
                      name="select-role"
                      value={selectedUsers[field.roleKey]?.id}
                      style={{ width: '100%' }}
                      onChange={(roleId) =>
                        setUsers({
                          ...selectedUsers,
                          [field.roleKey]: orgRoles?.getOrgRoles?.find((role) => role.id === roleId),
                        })
                      }
                      renderValue={() => (
                        <CreateEntityApplicationsSelectRender>
                          <span>{selectedUsers[field.roleKey]?.name}</span>
                          <CreateEntitySelectArrowIcon />
                        </CreateEntityApplicationsSelectRender>
                      )}
                    >
                      {orgRoles?.getOrgRoles?.map((role, idx) => (
                        <CreateEntityOption key={idx} value={role.id}>
                          <CreateEntityOptionLabel>{role.name}</CreateEntityOptionLabel>
                        </CreateEntityOption>
                      ))}
                    </CreateEntitySelect>
                  </CreateEntityWrapper>
                </CreateEntitySelectWrapper>
              </Box>
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
      {footerLeftRef.current
        ? createPortal(
            <Grid
              py="4px"
              px="8px"
              color="#CCBBFF"
              justifyContent="center"
              alignItems="center"
              gap="10px"
              display="flex"
              onClick={() => setInviteLinkModalIsOpen(true)}
              sx={{ background: '#282828', fontWeight: '600', cursor: 'pointer' }}
              borderRadius="4px"
            >
              <LinkIcon />
              Universal link
            </Grid>,
            footerLeftRef.current
          )
        : null}
      {footerRef.current
        ? createPortal(
            <Grid container gap="18px">
              <Button color="grey" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                color="primary"
                type="submit"
                onClick={onSubmit}
                disabled={!(selectedUsers.admins.length || selectedUsers.members.length)}
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
