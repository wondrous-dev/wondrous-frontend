import React, { useContext, useEffect, useState } from 'react';
import { useSettings } from 'utils/hooks';
import styled from 'styled-components';
import { useLazyQuery, useMutation } from '@apollo/client';

import { SEARCH_ORG_USERS } from 'graphql/queries';
import { parseUserPermissionContext } from 'utils/helpers';
import { INVITE_USER_TO_POD } from 'graphql/mutations/pod';
import { PERMISSIONS } from 'utils/constants';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { InviteDiv } from 'components/Settings/Members/styles';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import {
  AutocompleteList,
  CreateFormAddDetailsInputBlock,
  CreateFormAddDetailsInputLabel,
  CreateFormPreviewButton,
  OptionDiv,
  OptionTypography,
  StyledAutocomplete,
} from 'components/CreateEntity/styles';
import { InputAdornment, TextField } from '@mui/material';
import { white } from 'theme/colors';
import { SafeImage } from 'components/Common/Image';
import DropdownSelect from 'components/Common/DropdownSelect/dropdownSelect';
import { filterRoles } from './helpers';
import ArrowDropDownIcon from 'components/Icons/arrowDropDown';
import SearchIcon from 'components/Icons/search';
import RolesIcon from 'components/Icons/roles';

export const RolesDropdown = styled(DropdownSelect)`
  .MuiInputBase-formControl {
    background: #1e1e1e;
  }
`;

const InviteMember = (props) => {
  const { podId, roleList, setUsers, users } = props;
  const [inviteeRole, setInviteeRole] = useState(null);
  const [invitee, setInvitee] = useState(null);
  const [touched, setTouched] = useState(false);
  const [inviteeString, setInviteeString] = useState('');
  const settings = useSettings();
  let orgId = props?.orgId || settings?.pod?.orgId;
  const [searchOrgUsers, { data: searchOrgUserResults }] = useLazyQuery(SEARCH_ORG_USERS);
  const loggedInUserPermissions = settings?.userPermissionsContext;
  const permissions = parseUserPermissionContext({
    userPermissionsContext: loggedInUserPermissions,
    orgId,
    podId,
  });
  const [inviteUserToPod] = useMutation(INVITE_USER_TO_POD);
  const canInvite = permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.MANAGE_MEMBER);
  const userIsOwner = permissions.includes(PERMISSIONS.FULL_ACCESS);
  const searchedUsers = searchOrgUserResults?.searchOrgUsers;
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  const MenuProps = {
    disableScrollLock: true,
    PaperProps: {
      style: {
        borderRadius: '6px',
        border: '1px solid #6A6A6A',
        maxHeight: '250px',
        background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
        padding: '0 7px',
      },
    },
  };

  useEffect(() => {
    if (roleList) {
      const roles = filterRoles(roleList, null, userIsOwner);
      setInviteeRole(roles[0].value);
    }
  }, [roleList]);

  if (!canInvite) {
    return null;
  }

  const userIds = users.map((user) => user?.user?.id);

  const filterOrgUsersForAutocomplete = (users) => {
    if (!users) {
      return [];
    }
    return users
      .filter((user) => {
        if (userIds.includes(user?.id)) {
          return false;
        }
        return true;
      })
      .map((user) => ({
        ...user,
        profilePicture: user?.profilePicture,
        label: user?.username,
        value: user?.id,
      }));
  };

  return (
    <InviteDiv>
      <CreateFormAddDetailsInputBlock
        style={{
          width: 'auto',
          flex: 1,
          marginRight: '18px',
        }}
      >
        <CreateFormAddDetailsInputLabel>Username</CreateFormAddDetailsInputLabel>
        <StyledAutocomplete
          options={filterOrgUsersForAutocomplete(searchedUsers) || []}
          renderInput={(params) => (
            <>
              <TextField
                style={{
                  color: white,
                  fontFamily: 'Space Grotesk',
                  fontSize: '14px',
                  paddingLeft: '10px',
                }}
                placeholder="Enter username..."
                InputLabelProps={{ shrink: false }}
                {...params}
                InputProps={{
                  ...params.InputProps,
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <RolesIcon color="#CCBBFF" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="start" style={{ paddingRight: 0 }}>
                      <SearchIcon color="white" height={11} />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
          style={{
            background: '#1E1E1E',
          }}
          disableClearable
          PopperComponent={AutocompleteList}
          value={invitee}
          inputValue={inviteeString}
          onOpen={() => {
            // prefetch users to not display dropdown with text `No Data`
            if (!touched) {
              searchOrgUsers({
                variables: {
                  orgId,
                  queryString: '',
                },
              });
            }
          }}
          onInputChange={(event, newInputValue) => {
            searchOrgUsers({
              variables: {
                orgId,
                queryString: newInputValue,
              },
            });
            setInviteeString(newInputValue);
          }}
          renderOption={(props, option, state) => {
            return (
              <OptionDiv
                onClick={(event) => {
                  setInvitee(option);
                  props?.onClick(event);
                }}
              >
                {option?.thumbnailPicture ? (
                  <SafeImage
                    src={option?.thumbnailPicture}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                    }}
                  />
                ) : (
                  <DefaultUserImage />
                )}

                <OptionTypography>
                  {option?.firstName} <span>@{option?.username}</span>
                </OptionTypography>
              </OptionDiv>
            );
          }}
        />
      </CreateFormAddDetailsInputBlock>

      <RolesDropdown
        title="Role"
        titleStyle={{
          marginBottom: '-8px',
        }}
        MenuProps={MenuProps}
        IconComponent={() => <ArrowDropDownIcon style={{ height: '7px', right: '15px' }} fill="#CCBBFF" />}
        value={inviteeRole}
        setValue={setInviteeRole}
        labelText="Choose Role"
        options={filterRoles(roleList, null, userIsOwner)}
        style={{
          background: 'red',
        }}
        formSelectStyle={{
          width: 'auto',
          flex: 1,
          maxWidth: 'none',
        }}
      />
      <CreateFormPreviewButton
        disabled={!(invitee?.id && inviteeRole)}
        onClick={() => {
          inviteUserToPod({
            variables: {
              userId: invitee?.id,
              roleId: inviteeRole,
              podId,
            },
            onCompleted: (data) => {
              const userPod = data?.inviteUserToPod;
              setUsers([userPod, ...users]);
            },
          });
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage(<>{invitee?.username} invited!</>);
        }}
        style={{
          marginTop: '28px',
        }}
      >
        Invite Member
      </CreateFormPreviewButton>
    </InviteDiv>
  );
};

export default InviteMember;
