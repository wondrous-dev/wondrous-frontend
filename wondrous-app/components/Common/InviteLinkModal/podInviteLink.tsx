import { useContext, useEffect, useRef, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { BATCH_ADD_USERS_TO_POD, CREATE_POD_INVITE_LINK, SEND_POD_EMAIL_INVITES } from 'graphql/mutations/pod';
import { GET_POD_ROLES, GET_POD_USERS } from 'graphql/queries/pod';
import { SEARCH_ORG_USERS } from 'graphql/queries/org';
import { useOrgBoard, usePodBoard, useIsMobile } from 'utils/hooks';
import { parseUserPermissionContext } from 'utils/helpers';
import { LINK, validateEmail } from 'utils/constants';
import Checkbox from '@mui/material/Checkbox';
import ArrowFillIcon from 'components/Icons/arrowDropDown';
import CopyIcon from 'components/Icons/copy';
import { getRoleEmoji } from 'components/Settings/Members/MembersTableRow/helpers';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from 'components/Icons/search';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';

import DeleteBasketIcon from 'components/Icons/DeleteIcon';
import LinkIcon from 'components/RichText/icons/LinkIcon';
import Button from 'components/Button';
import GradientHeading from 'components/GradientHeading';
import palette from 'theme/palette';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import Modal from 'components/Modal';
import DropdownSelect from 'components/Common/DropdownSelect';
import {
  AutocompleteList,
  CreateFormAddDetailsInputBlock,
  CreateFormAddDetailsInputLabel,
  CreateFormPreviewButton,
  OptionDiv,
  OptionTypography,
  StyledAutocomplete,
} from 'components/CreateEntity/styles';

import { putDefaultRoleOnTop } from './OrgInviteLink';

import {
  CopyTypography,
  CopyContainer,
  InviteThruLinkTextField,
  LinkSwitch,
  LinkInviteContainer,
  StyledDivider,
  EmailInput,
} from './styles';

const LINK_TYPE_OPTIONS = [
  {
    label: 'Multi Use',
    value: 'public',
  },

  {
    label: 'One time Use',
    value: 'one_time',
  },
];
function PodInviteLinkModal(props) {
  const { podId, open, onClose } = props;
  const isMobile = useIsMobile();
  const [copied, setCopied] = useState(false);
  const [activeRoleId, setActiveRoleId] = useState(null);
  const [linkType, setLinkType] = useState(LINK_TYPE_OPTIONS[0].value);
  const [inputText, setInputText] = useState(null);
  const [invitee, setInvitee] = useState(null);
  const [users, setUsers] = useState([]);
  const [inviteeString, setInviteeString] = useState('');
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const userPermissionsContext = board?.userPermissionsContext;
  const [inviteLink, setInviteLink] = useState('');
  const orgId = podBoard?.orgId;

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });

  const [createPodInviteLink] = useMutation(CREATE_POD_INVITE_LINK, {
    onCompleted: (data) => {
      setInviteLink(`${LINK}/invite/${data?.createPodInviteLink.token}`);
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const [getPodRoles, { data: podRoles }] = useLazyQuery(GET_POD_ROLES, {
    onCompleted: (data) => {
      if (data?.getPodRoles) {
        data?.getPodRoles?.forEach((role) => {
          if (role?.default) {
            setActiveRoleId(role?.id);
          }
        });
      }
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const [searchOrgUsers, { data: searchOrgUserResults }] = useLazyQuery(SEARCH_ORG_USERS);
  const [getPodUsers, { fetchMore: fetchMorePodUsers }] = useLazyQuery(GET_POD_USERS, {
    fetchPolicy: 'network-only',
  });

  const handleOnClose = () => {
    onClose();
    setCopied(false);
    setInviteLink('');
    setActiveRoleId(null);
    setInputText(null);
  };

  const handleOnCopy = () => {
    navigator.clipboard.writeText(`${inviteLink}`);
    setCopied(true);
  };

  useEffect(() => {
    if (!activeRoleId && podId && open) {
      getPodRoles({
        variables: {
          podId,
        },
      });
    }
  }, [activeRoleId, podId, open, getPodRoles]);
  useEffect(() => {
    getPodUsers({
      variables: {
        podId,
        limit: 1000,
      },
    }).then((result) => {
      setUsers(result?.data?.getPodUsers);
    });
  }, [podId]);
  useEffect(() => {
    if (open) {
      createPodInviteLink({
        variables: {
          input: {
            invitorId: '',
            type: linkType,
            podId,
            podRoleId: activeRoleId,
          },
        },
      });
    }
    setCopied(false);
  }, [activeRoleId, linkType, podId, open]);
  const roles = putDefaultRoleOnTop(podRoles?.getPodRoles, permissions);

  useEffect(() => {
    if (!activeRoleId && roles?.length > 0) {
      roles.forEach((role) => {
        if (role?.default) {
          setActiveRoleId(role?.id);
        }
      });
    }
  }, [activeRoleId, roles]);
  const roleOptions = roles?.map((role) => {
    const emoji = getRoleEmoji(role?.name);
    const label = `${emoji} ${role?.name}`;
    return {
      label,
      value: role?.id,
    };
  });
  users;
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
        profilePicture: user?.thumbnailPicture || user?.profilePicture,
        label: user?.username,
        value: user?.id,
      }));
  };
  const searchedUsers = searchOrgUserResults?.searchOrgUsers;

  return (
    <Modal title="Add Members" open={open} onClose={handleOnClose} maxWidth={660}>
      <GradientHeading fontSize={24} mb="20px" gradient="89.67deg, #CCBBFF 37.16%, #00BAFF 108.05%">
        Invite from link
      </GradientHeading>
      <LinkInviteContainer>
        <DropdownSelect
          value={activeRoleId}
          options={roleOptions}
          setValue={setActiveRoleId}
          formSelectStyle={{
            height: 'auto',
            width: '40%',
          }}
          innerStyle={{
            marginTop: '0px',
            height: '40px',
            padding: '0px 0px',
          }}
        />
        <InviteThruLinkTextField variant="outlined" value={`${inviteLink}`} disabled />
        {/* <DropdownSelect
          value={linkType}
          options={LINK_TYPE_OPTIONS}
          setValue={setLinkType}
          formSelectStyle={{
            height: 'auto',
          }}
          innerStyle={{
            marginTop: '0px',
            height: '40px',
          }}
        /> */}
        {!isMobile ? (
          <CopyContainer $copied={copied} onClick={handleOnCopy}>
            <CopyIcon color={copied ? palette.green30 : palette.blue20} />
            <CopyTypography $copied={copied}>{copied ? 'Link copied' : 'Copy link'}</CopyTypography>
          </CopyContainer>
        ) : (
          <CopyContainer $copied={copied} onClick={handleOnCopy}>
            <CopyIcon color={copied ? palette.green30 : palette.blue20} />
          </CopyContainer>
        )}
      </LinkInviteContainer>
      <LinkSwitch
        label="Link expires after one-time use"
        checked={linkType === 'one_time'}
        onClick={() => setLinkType(linkType === 'one_time' ? 'public' : 'one_time')}
      />
      <StyledDivider />
      <GradientHeading fontSize={24} mb="20px" gradient="89.67deg, #CCBBFF 37.16%, #00BAFF 108.05%">
        Invite through email
      </GradientHeading>
      <LinkInviteContainer>
        <DropdownSelect
          value={activeRoleId}
          options={roleOptions}
          setValue={setActiveRoleId}
          formSelectStyle={{
            height: 'auto',
            width: '40%',
          }}
          innerStyle={{
            marginTop: '0px',
            height: '40px',
            padding: '0px 0px',
          }}
        />
        <EmailInput
          placeholder="Enter username..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          InputLabelProps={{ shrink: false }}
          InputProps={{
            disableUnderline: true,
            endAdornment: (
              <InputAdornment position="start" style={{ paddingRight: 0 }}>
                <SearchIcon color="white" height={11} />
              </InputAdornment>
            ),
          }}
        />
      </LinkInviteContainer>
      {/* <StyledAutocomplete
        options={filterOrgUsersForAutocomplete(searchedUsers) || []}
        renderInput={(params) => (
          <TextField
            style={{
              color: palette.white,
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
              endAdornment: (
                <InputAdornment position="start" style={{ paddingRight: 0 }}>
                  <SearchIcon color="white" height={11} />
                </InputAdornment>
              ),
            }}
          />
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
          searchOrgUsers({
            variables: {
              orsIds: [orgId],
              searchString: '',
            },
          });
        }}
        onInputChange={(event, newInputValue) => {
          searchOrgUsers({
            variables: {
              orgIds: [orgId],
              searchString: newInputValue,
            },
          });
          setInviteeString(newInputValue);
        }}
        renderOption={(props, option, state) => (
          <OptionDiv
            onClick={(event) => {
              setInvitee(option);
              props?.onClick(event);
            }}
          >
            {option?.thumbnailPicture ? (
              <SafeImage
                useNextImage={false}
                src={option?.thumbnailPicture}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                }}
                alt="Thumbnail picture"
              />
            ) : (
              <DefaultUserImage />
            )}

            <OptionTypography>
              {option?.firstName} <span>@{option?.username}</span>
            </OptionTypography>
          </OptionDiv>
        )}
      /> */}
    </Modal>
  );
}
export default PodInviteLinkModal;
