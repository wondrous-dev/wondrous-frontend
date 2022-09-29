import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { TabsVisibilityCreateEntity } from 'components/Common/TabsVisibilityCreateEntity';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { CREATE_POD } from 'graphql/mutations/pod';
import { GET_AUTOCOMPLETE_USERS, GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { SEARCH_ORG_USERS } from 'graphql/queries/org';
import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries/payment';
import palette from 'theme/palette';
import { ENTITIES_TYPES, GRAPHQL_ERRORS, MEDIA_TYPES, PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';
import { TextInputContext } from 'utils/contexts';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { RichTextEditor, useEditor, countCharacters, extractMentions, plainTextToRichText } from 'components/RichText';
import DropdownSelect from 'components/Common/DropdownSelect';
import { TextInput } from '../TextInput';

import { ErrorText } from '../Common';
import CloseModalIcon from '../Icons/closeModal';
import InputForm from '../Common/InputForm/inputForm';
import CreateDaoIcon from '../Icons/createDao';
import AudioIcon from '../Icons/MediaTypesIcons/audio';
import CodeIcon from '../Icons/MediaTypesIcons/code';
import ImageIcon from '../Icons/MediaTypesIcons/image';
import VideoIcon from '../Icons/MediaTypesIcons/video';

import {
  CreateLayoutPodsIcon,
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

export const filterOrgUsersForAutocomplete = (orgUsers): { display: string; id: string }[] => {
  if (!orgUsers) {
    return [];
  }
  return orgUsers?.map((orgUser) => ({
    ...orgUser,
    display: orgUser?.username,
    id: orgUser?.id,
  }));
};

function CreatePodModal(props) {
  const { handleClose, cancel, open } = props;
  const [podDescriptionText, setPodDescriptionText] = useState('');

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
  const isPod = true;
  const textLimit = 200;

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'network-only',
  });
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const selectedOrgPrivacyLevel = userOrgs?.getUserOrgs?.filter((i) => i.id === org)[0]?.privacyLevel;
  const [searchOrgUsers] = useLazyQuery(SEARCH_ORG_USERS);

  const handleUserMentionChange = (query) =>
    searchOrgUsers({
      variables: {
        orgId: org,
        searchString: query,
      },
    }).then(({ data }) => data?.searchOrgUsers?.map((user) => ({ ...user, display: user.username, id: user.id })));

  const podDescriptionTextCounter = (e) => {
    if (e.target.value.length < textLimit) {
      setPodDescriptionText(e.target.value);
    }
  };

  // const getOrgReviewers = useQuery(GET_ORG_REVIEWERS)
  const [pod, setPod] = useState(null);
  const [isPublicEntity, setIsPublicEntity] = useState(false);
  const { showLinkAttachmentSection, showVisibility } = useMemo(
    () => ({
      showLinkAttachmentSection: true,
      showVisibility: true,
    }),
    []
  );

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
  }, [podDescriptionText, title, org, canCreatePod, errors, link, createPod, isPublicEntity]);

  const creating = createPodLoading && !createPodError;
  return (
    <CreateFormBaseModal isPod={isPod}>
      <CreateFormBaseModalHeaderWrapper>
        <CreateFormBaseModalHeader
          style={{
            marginBottom: '0',
          }}
        >
          <CreateLayoutPodsIcon circle />
          <CreateFormBaseModalTitle>Create a pod</CreateFormBaseModalTitle>
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
          <CreateFormMainBlockTitle>Pod title</CreateFormMainBlockTitle>

          <InputForm
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter pod title"
            search={false}
          />
          {errors.title && <ErrorText> {errors.title} </ErrorText>}
        </CreateFormMainInputBlock>

        <CreateFormMainInputBlock>
          <CreateFormMainBlockTitle>Pod description</CreateFormMainBlockTitle>

          <TextInputDiv>
            <TextInputContext.Provider
              value={{
                content: podDescriptionText,
                onChange: podDescriptionTextCounter,
                onMentionChange: handleUserMentionChange,
              }}
            >
              <TextInput
                placeholder="Enter pod description"
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

          <CreateFormMainDescriptionInputSymbolCounter>
            {podDescriptionText?.length}/{textLimit} characters
          </CreateFormMainDescriptionInputSymbolCounter>
          {errors.description && <ErrorText> {errors.description} </ErrorText>}
        </CreateFormMainInputBlock>
      </CreateFormMainSection>

      <CreateFormAddDetailsSection>
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
                  <CreateFormAddDetailsInputLabel>Who can see this pod?</CreateFormAddDetailsInputLabel>
                  <TabsVisibilityCreateEntity
                    type="pod"
                    isPod
                    isPublic={isPublicEntity}
                    setIsPublic={setIsPublicEntity}
                    orgPrivacyLevel={selectedOrgPrivacyLevel}
                    podPrivacyLevel=""
                  />
                  {errors.privacy && <ErrorText>{errors.privacy}</ErrorText>}
                </CreateFormAddDetailsTab>
              )}
            </CreateFormAddDetailsAppearBlockContainer>
          )}
        </CreateFormAddDetailsAppearBlock>
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
            Create Pod
          </CreateFormPreviewButton>
        </CreateFormButtonsBlock>
      </CreateFormFooterButtons>
    </CreateFormBaseModal>
  );
}

export default CreatePodModal;
