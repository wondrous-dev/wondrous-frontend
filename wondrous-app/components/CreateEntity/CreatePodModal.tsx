import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { TabsVisibilityCreateEntity } from 'components/Common/TabsVisibilityCreateEntity';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { CREATE_POD } from 'graphql/mutations/pod';
import { GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { SEARCH_ORG_USERS } from 'graphql/queries/org';
import palette from 'theme/palette';
import { GRAPHQL_ERRORS, MEDIA_TYPES, PERMISSIONS, PRIVACY_LEVEL } from 'utils/constants';
import { TextInputContext } from 'utils/contexts';
import { parseUserPermissionContext } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import DropdownSelect from 'components/Common/DropdownSelect';
import CreateDaoIcon from 'components/Icons/createDao';
import AudioIcon from 'components/Icons/MediaTypesIcons/audio';
import CodeIcon from 'components/Icons/MediaTypesIcons/code';
import ImageIcon from 'components/Icons/MediaTypesIcons/image';
import VideoIcon from 'components/Icons/MediaTypesIcons/video';
import { TextInput } from 'components/TextInput';

import { ErrorText } from 'components/Common';
import CloseModalIcon from 'components/Icons/closeModal';
import InputForm from 'components/Common/InputForm/inputForm';

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
  CreateFormMainBlockTitle,
  CreateFormMainDescriptionInputSymbolCounter,
  CreateFormMainInputBlock,
  CreateFormMainSection,
  CreateFormMainSelects,
  CreateFormPreviewButton,
  CreateFormBaseModalHeaderWrapper,
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
  const { handleClose, cancel, open, shouldRedirect = true, defaults = null } = props;
  const [podDescriptionText, setPodDescriptionText] = useState(defaults?.description || '');

  const [errors, setErrors] = useState({
    general: null,
    title: null,
    description: null,
    org: null,
    privacy: null,
  });

  const [org, setOrg] = useState(null);
  const [link, setLink] = useState('');
  const [title, setTitle] = useState(defaults?.title || '');
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  const isPod = true;
  const textLimit = 200;

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'network-only',
  });
  const { data: userOrgs } = useQuery(GET_USER_ORGS, {
    fetchPolicy: 'network-only',
  });

  const userOrgsData = userOrgs?.getUserOrgs;

  const selectedOrgPrivacyLevel = userOrgsData?.filter((i) => i.id === org)[0]?.privacyLevel;
  const [searchOrgUsers] = useLazyQuery(SEARCH_ORG_USERS);

  const handleUserMentionChange = (query) =>
    searchOrgUsers({
      variables: {
        orgIds: [org],
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

  const filterDAOptions = userOrgsData
    ? userOrgsData
        .filter(({ modules }) => modules?.pod ?? true)
        .map(({ profilePicture, name, id }) => ({
          imageUrl: profilePicture,
          label: name,
          value: id,
        }))
    : [];

  const fetchedUserPermissionsContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;

  const router = useRouter();
  const { podId: routerPodId } = router.query;

  useEffect(() => {
    if (open) {
      if (
        fetchedUserPermissionsContext &&
        board?.orgId in fetchedUserPermissionsContext?.orgPermissions &&
        !org &&
        board?.orgData?.modules?.pod
      ) {
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
      if (shouldRedirect) {
        router.push(`/pod/${pod?.id}/boards`, undefined, {
          shallow: true,
        });
      }
    },
    refetchQueries: ['getOrgById', 'getOrgPods'],
  });

  const submitMutation = useCallback(() => {
    if (canCreatePod) {
      const podInput = {
        name: title,
        username: title?.toLowerCase().split(' ').join(''),
        description: podDescriptionText,
        orgId: org,
        privacyLevel: isPublicEntity ? PRIVACY_LEVEL.public : PRIVACY_LEVEL.private,
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
  }, [podDescriptionText, title, org, canCreatePod, errors, createPod, isPublicEntity]);

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
            title="Org"
            value={org}
            setValue={setOrg}
            labelText="Choose Org"
            labelIcon={<CreateDaoIcon />}
            options={filterDAOptions}
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
