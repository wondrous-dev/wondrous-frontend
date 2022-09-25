import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { TabsVisibilityCreateEntity } from 'components/Common/TabsVisibilityCreateEntity';
import { CircularProgress, styled, Switch, TextField } from '@mui/material';
import { ReactEditor } from 'slate-react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { CREATE_POD } from 'graphql/mutations/pod';
import { GET_AUTOCOMPLETE_USERS, GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_ORG_USERS } from 'graphql/queries/org';
import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries/payment';
import palette from 'theme/palette';
import {
  CHAIN_TO_CHAIN_DIPLAY_NAME,
  ENTITIES_TYPES,
  GRAPHQL_ERRORS,
  MEDIA_TYPES,
  PERMISSIONS,
  PRIVACY_LEVEL,
} from 'utils/constants';
import { TextInputContext } from 'utils/contexts';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { RichTextEditor, useEditor, countCharacters, extractMentions, plainTextToRichText } from 'components/RichText';
import DropdownSelect from 'components/Common/DropdownSelect';
import { TextInput } from '../TextInput';

import { useMe } from '../Auth/withAuth';
import { ErrorText } from '../Common';
import CloseModalIcon from '../Icons/closeModal';
import { SafeImage } from '../Common/Image';
import InputForm from '../Common/InputForm/inputForm';
import { AddFileUpload } from '../Icons/addFileUpload';
import CreateDaoIcon from '../Icons/createDao';
import CreatePodIcon from '../Icons/createPod';
import AudioIcon from '../Icons/MediaTypesIcons/audio';
import CodeIcon from '../Icons/MediaTypesIcons/code';
import ImageIcon from '../Icons/MediaTypesIcons/image';
import VideoIcon from '../Icons/MediaTypesIcons/video';
import { ENTITIES_UI_ELEMENTS } from './chooseEntityToCreateModal';

import {
  CreateFormAddDetailsAppearBlock,
  CreateFormAddDetailsAppearBlockContainer,
  CreateFormAddDetailsInputLabel,
  CreateFormAddDetailsSection,
  CreateFormAddDetailsTab,
  CreateFormBaseModal,
  CreateFormBaseModalCloseBtn,
  CreateFormBaseModalHeader,
  CreateFormBaseModalTitle,
  CreateFormButtonsBlock,
  CreateFormCancelButton,
  CreateFormFooterButtons,
  CreateFormLinkAttachmentBlock,
  CreateFormLinkAttachmentLabel,
  CreateFormMainBlockTitle,
  CreateFormMainDescriptionInputSymbolCounter,
  CreateFormMainInputBlock,
  CreateFormMainSection,
  CreateFormMainSelects,
  CreateFormPreviewButton,
  CreateFormBaseModalHeaderWrapper,
  EditorContainer,
  EditorPlaceholder,
  EditorToolbar,
  TextInputDiv,
} from './styles';

export const MEDIA_UI_ELEMENTS = {
  [MEDIA_TYPES.IMAGE]: {
    icon: ImageIcon,
    label: 'Image',
  },
  [MEDIA_TYPES.AUDIO]: {
    icon: AudioIcon,
    label: 'Audio',
  },
  [MEDIA_TYPES.LINK]: {
    icon: ImageIcon,
    label: 'Link',
  },
  [MEDIA_TYPES.TEXT]: {
    icon: ImageIcon,
    label: 'Text',
  },

  [MEDIA_TYPES.CODE]: {
    icon: CodeIcon,
    label: 'Code',
  },

  [MEDIA_TYPES.VIDEO]: {
    icon: VideoIcon,
    label: 'Video',
  },
};

export const AndroidSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    background: '#3E3E3E',

    '&:before': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="white" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
      zIndex: 1000,
      opacity: 1,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
    background: 'white',
  },

  '& .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track': {
    background: 'linear-gradient(270deg, #CCBBFF -5.62%, #7427FF 45.92%, #00BAFF 103.12%)',
  },
}));

export const filterOrgUsersForAutocomplete = (orgUsers): { display: string; id: string }[] => {
  if (!orgUsers) {
    return [];
  }
  return orgUsers.map((orgUser) => ({
    ...orgUser?.user,
    display: orgUser?.user?.username,
    id: orgUser?.user?.id,
  }));
};

export const filterPaymentMethods = (paymentMethods) => {
  if (!paymentMethods) return [];
  return paymentMethods.map((paymentMethod) => ({
    ...paymentMethod,
    icon: (
      <SafeImage
        useNextImage={false}
        src={paymentMethod.icon}
        style={{ width: '30px', height: '30px', borderRadius: '15px' }}
      />
    ),
    label: `${paymentMethod.tokenName?.toUpperCase()}: ${CHAIN_TO_CHAIN_DIPLAY_NAME[paymentMethod.chain]}`,
    value: paymentMethod.id,
  }));
};

export const filterOrgUsers = (orgUsers) => {
  if (!orgUsers) {
    return [];
  }

  return orgUsers.map((orgUser) => ({
    profilePicture: orgUser?.user?.thumbnailPicture || orgUser?.user?.profilePicture,
    label: orgUser?.user?.username,
    value: orgUser?.user?.id,
  }));
};

function CreatePodModal(props) {
  const { entityType, handleClose, cancel, open, parentTaskId } = props;
  const user = useMe();
  const [addDetails, setAddDetails] = useState(true);
  const [descriptionText, setDescriptionText] = useState(plainTextToRichText(''));
  const [podDescriptionText, setPodDescriptionText] = useState('');

  const editor = useEditor();
  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();

  const [errors, setErrors] = useState({
    general: null,
    title: null,
    description: null,
    org: null,
    privacy: null,
  });

  const [org, setOrg] = useState(null);
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  const isPod = entityType === ENTITIES_TYPES.POD;
  const textLimit = isPod ? 200 : 900;

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'network-only',
  });
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const selectedOrgPrivacyLevel = userOrgs?.getUserOrgs?.filter((i) => i.id === org)[0]?.privacyLevel;
  const [getAutocompleteUsers, { data: autocompleteData }] = useLazyQuery(GET_AUTOCOMPLETE_USERS);
  const [fetchPaymentMethod, setFetchPaymentMethod] = useState(false);
  const [getPaymentMethods, { data: paymentMethodData }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG, {
    onCompleted: () => {
      setFetchPaymentMethod(true);
    },
  });
  const [orgUserFetched, setOrgUserFetched] = useState(false);
  const [getOrgUsers, { data: orgUsersData }] = useLazyQuery(GET_ORG_USERS, {
    onCompleted: () => {
      setOrgUserFetched(true);
    },
  });

  const podDescriptionTextCounter = (e) => {
    if (e.target.value.length < textLimit) {
      setPodDescriptionText(e.target.value);
    }
  };

  // const getOrgReviewers = useQuery(GET_ORG_REVIEWERS)
  const [pods, setPods] = useState([]);
  const [pod, setPod] = useState(null);
  const selectedPodPrivacyLevel = pods?.filter((i) => i.id === pod)[0]?.privacyLevel;
  const [isPublicEntity, setIsPublicEntity] = useState(false);
  const { showLinkAttachmentSection, showVisibility } = useMemo(
    () => ({
      showLinkAttachmentSection: true,
      showVisibility: true,
    }),
    []
  );

  const { icon: TitleIcon, label: titleText } = ENTITIES_UI_ELEMENTS[entityType];

  const filterDAOptions = useCallback((orgs) => {
    if (!orgs) {
      return [];
    }
    return orgs.map((org) => ({
      imageUrl: org?.profilePicture,
      label: org?.name,
      value: org?.id,
    }));
  }, []);

  const fetchedUserPermissionsContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;

  const router = useRouter();
  const { podId: routerPodId } = router.query;

  useEffect(() => {
    if (open) {
      if (fetchedUserPermissionsContext && board?.orgId in fetchedUserPermissionsContext?.orgPermissions && !org) {
        // If you're only part of one dao then just set that as default
        // TODO: if you are part of the org and you're on that page it should be create on that org
        setOrg(board?.orgId);
      }

      if (board?.podId && !pod) {
        // If you're only part of one dao then just set that as default
        // TODO: if you are part of the org and you're on that page it should be create on that org
        setPod(board?.podId || routerPodId);
      }
      if (org) {
        if (!orgUserFetched) {
          getOrgUsers({
            variables: {
              orgId: org,
              limit: 100, // TODO: fix autocomplete
            },
          });
          setOrgUserFetched(true);
        }
        if (!fetchPaymentMethod) {
          getPaymentMethods({
            variables: {
              orgId: org,
            },
          });
          setFetchPaymentMethod(true);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board?.orgId, fetchedUserPermissionsContext, board?.podId, org, pod, open, routerPodId]);

  const permissions = parseUserPermissionContext({
    userPermissionsContext: fetchedUserPermissionsContext,
    orgId: org,
    podId: pod,
  });
  const canCreatePod = permissions.includes(PERMISSIONS.FULL_ACCESS) || permissions.includes(PERMISSIONS.MANAGE_POD);

  const [createPod, { loading: createPodLoading, error: createPodError }] = useMutation(CREATE_POD, {
    onCompleted: (data) => {
      const pod = data?.createPod;
      handleClose();
      router.push(`/pod/${pod?.id}/boards`, undefined, {
        shallow: true,
      });
    },
    refetchQueries: ['getOrgById'],
  });

  const submitMutation = useCallback(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    switch (entityType) {
      case ENTITIES_TYPES.POD:
        if (canCreatePod) {
          const podInput = {
            name: title,
            username: title?.toLowerCase().split(' ').join('_'),
            description: podDescriptionText,
            orgId: org,
            privacyLevel: isPublicEntity ? PRIVACY_LEVEL.public : PRIVACY_LEVEL.private,
            links: [
              {
                url: link,
                displayName: link,
              },
            ],
          };
          if (!title) {
            const newErrors = { ...errors };
            if (!title) {
              newErrors.title = 'Please enter a title';
            }
            newErrors.general = 'Please enter the necessary information above';
            setErrors(newErrors);
          } else {
            createPod({
              variables: {
                input: podInput,
              },
            }).catch((err) => {
              if (
                err?.graphQLErrors &&
                err?.graphQLErrors[0]?.extensions?.message === GRAPHQL_ERRORS.POD_WITH_SAME_NEXT_EXISTS
              ) {
                setErrors({
                  ...errors,
                  general: 'Pod with that name already exists',
                });
              }
            });
          }
        } else {
          setErrors({
            ...errors,
            general: 'You need the right permissions to create a pod',
          });
        }
        break;
    }
  }, [entityType, podDescriptionText, title, org, canCreatePod, errors, link, createPod, isPublicEntity]);

  const creating = createPodLoading && !createPodError;
  return (
    <CreateFormBaseModal isPod={isPod}>
      <CreateFormBaseModalHeaderWrapper>
        <CreateFormBaseModalHeader
          style={{
            marginBottom: '0',
          }}
        >
          <TitleIcon circle />
          <CreateFormBaseModalTitle>Create a {titleText?.toLowerCase()}</CreateFormBaseModalTitle>
        </CreateFormBaseModalHeader>
        <CreateFormBaseModalCloseBtn onClick={handleClose}>
          <CloseModalIcon />
        </CreateFormBaseModalCloseBtn>
      </CreateFormBaseModalHeaderWrapper>
      <CreateFormMainSection>
        <CreateFormMainSelects>
          <DropdownSelect
            title="DAO"
            value={org}
            setValue={setOrg}
            labelText="Choose DAO"
            labelIcon={<CreateDaoIcon />}
            options={filterDAOptions(userOrgs?.getUserOrgs) || []}
            name="dao"
          />
        </CreateFormMainSelects>

        <CreateFormMainInputBlock>
          <CreateFormMainBlockTitle>{titleText} title</CreateFormMainBlockTitle>

          <InputForm
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Enter ${titleText?.toLowerCase()} title`}
            search={false}
          />
          {errors.title && <ErrorText> {errors.title} </ErrorText>}
        </CreateFormMainInputBlock>

        <CreateFormMainInputBlock>
          <CreateFormMainBlockTitle>{titleText} description</CreateFormMainBlockTitle>

          {isPod && (
            <TextInputDiv>
              <TextInputContext.Provider
                value={{
                  content: podDescriptionText,
                  onChange: podDescriptionTextCounter,
                  list: filterOrgUsersForAutocomplete(orgUsersData?.getOrgUsers),
                }}
              >
                <TextInput
                  placeholder={`Enter ${titleText.toLowerCase()} description`}
                  style={{
                    input: {
                      overflow: 'auto',
                      color: palette.white,
                      height: '100px',
                      marginBottom: '16px',
                      borderRadius: '6px',
                      padding: '8px',
                    },
                  }}
                />
              </TextInputContext.Provider>
            </TextInputDiv>
          )}

          <CreateFormMainDescriptionInputSymbolCounter>
            {countCharacters(descriptionText)}/{textLimit} characters
          </CreateFormMainDescriptionInputSymbolCounter>
          {errors.description && <ErrorText> {errors.description} </ErrorText>}
        </CreateFormMainInputBlock>
      </CreateFormMainSection>

      <CreateFormAddDetailsSection>
        {addDetails && (
          <CreateFormAddDetailsAppearBlock>
            {(showLinkAttachmentSection || showVisibility) && (
              <CreateFormAddDetailsAppearBlockContainer>
                {showLinkAttachmentSection && (
                  <CreateFormLinkAttachmentBlock
                    style={{
                      borderBottom: 'none',
                    }}
                  >
                    <CreateFormLinkAttachmentLabel>Link</CreateFormLinkAttachmentLabel>
                    <InputForm
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      margin
                      placeholder="Enter link URL"
                      search={false}
                    />
                  </CreateFormLinkAttachmentBlock>
                )}
                {showVisibility && (
                  <CreateFormAddDetailsTab>
                    <CreateFormAddDetailsInputLabel>
                      Who can see this {titleText?.toLowerCase()}?
                    </CreateFormAddDetailsInputLabel>
                    <TabsVisibilityCreateEntity
                      type={titleText?.toLowerCase()}
                      isPod={isPod}
                      isPublic={isPublicEntity}
                      setIsPublic={setIsPublicEntity}
                      orgPrivacyLevel={selectedOrgPrivacyLevel}
                      podPrivacyLevel={selectedPodPrivacyLevel}
                    />
                    {errors.privacy && <ErrorText>{errors.privacy}</ErrorText>}
                  </CreateFormAddDetailsTab>
                )}
              </CreateFormAddDetailsAppearBlockContainer>
            )}
          </CreateFormAddDetailsAppearBlock>
        )}
      </CreateFormAddDetailsSection>
      <CreateFormFooterButtons>
        {errors.general && <ErrorText>{errors.general}</ErrorText>}
        <CreateFormButtonsBlock>
          <CreateFormCancelButton onClick={cancel}>Cancel</CreateFormCancelButton>
          <CreateFormPreviewButton
            style={{
              ...(isPod &&
                !canCreatePod && {
                  background: palette.grey700,
                  border: `1px solid ${palette.grey700}`,
                  cursor: 'default',
                }),
            }}
            disabled={creating}
            onClick={submitMutation}
          >
            {creating ? <CircularProgress size={20} /> : null}
            Create {titleText}
          </CreateFormPreviewButton>
        </CreateFormButtonsBlock>
      </CreateFormFooterButtons>
    </CreateFormBaseModal>
  );
}

export default CreatePodModal;
