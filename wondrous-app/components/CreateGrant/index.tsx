import { useMutation, useQuery } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { ErrorText } from 'components/Common';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { TaskModalCard } from 'components/Common/TaskViewModal/styles';
import {
  CreateEntityDropdown,
  filterOptionsWithPermission,
  filterOrgUsersForAutocomplete,
  formDirty,
  getPrivacyLevel,
  GrantCreateModalProps,
  privacyOptions,
  useContextValue,
  useGetAvailableUserPods,
  useGetOrgUsers,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import PodSearch from 'components/CreateEntity/CreateEntityModal/PodSearch';
import {
  CreateEntityAttachment,
  CreateEntityAttachmentIcon,
  CreateEntityCancelButton,
  CreateEntityCreateTaskButton,
  CreateEntityDefaultDaoImage,
  CreateEntityError,
  CreateEntityHeader,
  CreateEntityHeaderArrowIcon,
  CreateEntityHeaderWrapper,
  CreateEntityOpenInFullIcon,
  CreateEntityPrivacyIconWrapper,
  CreateEntityPrivacyLabel,
  CreateEntityPrivacySelect,
  CreateEntityPrivacySelectOption,
  CreateEntityPrivacySelectRender,
  CreateEntityPrivacySelectRenderLabel,
  CreateEntitySelectArrowIcon,
  CreateEntitySelectErrorWrapper,
  CreateEntityTitle,
  EditorPlaceholder,
  EditorToolbar,
  MediaUploadDiv,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { MediaItem } from 'components/CreateEntity/MediaItem';
import { deserializeRichText, RichTextEditor, useEditor } from 'components/RichText';
import Tooltip from 'components/Tooltip';
import { useFormik } from 'formik';
import { ATTACH_GRANT_MEDIA, CREATE_GRANT, REMOVE_GRANT_MEDIA, UPDATE_GRANT } from 'graphql/mutations/grant';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { ENTITIES_TYPES } from 'utils/constants';
import { hasCreateTaskPermission, transformMediaFormat } from 'utils/helpers';
import { useFullScreen, useGlobalContext, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { handleAddFile } from 'utils/media';
import * as Yup from 'yup';
import { ApplyPolicy, Categories, Dates, GrantAmount, GrantQuantity } from './Fields';
import { APPLY_POLICY_FIELDS } from './Fields/ApplyPolicy';
import {
  Form,
  GrantDescriptionMedia,
  RichTextContainer,
  GrantModalData,
  RichTextWrapper,
  GrantSectionDisplayDivWrapper,
  MediaWrapper,
} from './styles';
import { descriptionTemplate } from './utils';

const validationSchema = Yup.object().shape({
  orgId: Yup.string().required('Organization is required').typeError('Organization is required'),
  reward: Yup.object({
    paymentMethodId: Yup.string().required('Payment method is required'),
    rewardAmount: Yup.number()
      .typeError('Reward amount must be a number')
      .moreThan(0, 'Reward amount must be greater than 0')
      .lessThan(1000000000, 'Reward amount must be less than 1 billion')
      .required('Reward amount is required'),
  }).required(),
  numOfGrant: Yup.number()
    .typeError('Number of grants must be a number')
    .moreThan(0, 'Number of grants must be greater than 0')
    .lessThan(1000000000, 'Number of grants must be less than 1 billion')
    .required('Quantity of grants is required'),
  startDate: Yup.string().optional().nullable(),
  endDate: Yup.string().optional().nullable(),
  applyPolicy: Yup.string().nullable(),
  podId: Yup.string().optional().nullable(),
  title: Yup.string().required('Title is required'),
  mediaUploads: Yup.array(),
});

const CreateGrant = ({ handleClose, cancel, existingGrant, isEdit = false, setFormDirty }: GrantCreateModalProps) => {
  const router = useRouter();
  const { toggleFullScreen, isFullScreen } = useFullScreen(true);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const { userOrgs } = useGlobalContext();
  const board = orgBoard || podBoard || userBoard;
  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  const editor = useEditor();
  const [removeGrantMedia] = useMutation(REMOVE_GRANT_MEDIA);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  const [updateGrant] = useMutation(UPDATE_GRANT, {
    refetchQueries: ['getGrantOrgBoard', 'getGrantPodBoard', 'getGrantById'],
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Grant updated successfully!');
      handleClose();
    },
    onError: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Error updating grant');
    },
  });

  // TODO: move the upload to a separate component
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const [attachMedia] = useMutation(ATTACH_GRANT_MEDIA);
  const [createGrant] = useMutation(CREATE_GRANT, {
    refetchQueries: ['getGrantOrgBoard', 'getGrantPodBoard'],
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Grant created successfully!');
      handleClose();
    },
    onError: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Error creating grant');
    },
  });
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'network-only',
  });

  const inputRef: any = useRef();
  const fetchedUserPermissionsContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;

  const filteredDaoOptions = filterOptionsWithPermission(
    ENTITIES_TYPES.GRANT,
    userOrgs?.getUserOrgs,
    fetchedUserPermissionsContext,
    undefined,
    board?.podId
  );

  const grantAction = isEdit
    ? ({ variables: { input } }) =>
        updateGrant({
          variables: {
            grantId: existingGrant.id,
            input,
          },
        })
    : createGrant;

  const form = useFormik({
    initialValues: {
      reward: {
        paymentMethodId: existingGrant?.reward?.paymentMethodId || '',
        rewardAmount: existingGrant?.reward?.rewardAmount || '',
      },
      numOfGrant: existingGrant?.numOfGrant || '',
      mediaUploads: transformMediaFormat(existingGrant?.media) || [],
      startDate: existingGrant?.startDate || null,
      endDate: existingGrant?.endDate || null,
      title: existingGrant?.title || '',
      description: existingGrant
        ? deserializeRichText(existingGrant.description)
        : deserializeRichText(descriptionTemplate),
      orgId: existingGrant?.orgId || null,
      categories: existingGrant?.categories || [],
      podId: board?.podId || null,
      privacyLevel: existingGrant?.privacyLevel || null,
      applyPolicy: existingGrant?.applyPolicy || APPLY_POLICY_FIELDS[0].value,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
    onSubmit: (values) =>
      grantAction({
        variables: {
          input: {
            title: values.title,
            description: JSON.stringify(values.description),
            orgId: values.orgId,
            podId: values.podId,
            startDate: values.startDate,
            mediaUploads: values.mediaUploads,
            endDate: values.endDate,
            reward: {
              rewardAmount: parseInt(values.reward.rewardAmount, 10),
              paymentMethodId: values.reward.paymentMethodId,
            },
            privacyLevel: values.privacyLevel,
            applyPolicy: values.applyPolicy,
            categories: values.categories,
            numOfGrant: parseInt(values.numOfGrant, 10),
          },
        },
      }),
  });

  useEffect(() => {
    if (setFormDirty) {
      setFormDirty(formDirty(form));
    }
  }, [form, setFormDirty]);

  const { data: orgUsersData, search, hasMoreOrgUsers, fetchMoreOrgUsers } = useGetOrgUsers(form.values.orgId);

  const pods = useGetAvailableUserPods(form.values.orgId);

  useContextValue(!form.values.orgId && router?.pathname.includes('/dashboard') && filteredDaoOptions[0]?.value, () =>
    form.setFieldValue('orgId', filteredDaoOptions[0]?.value)
  );

  useContextValue(
    !form.values.orgId &&
      hasCreateTaskPermission({
        userPermissionsContext: fetchedUserPermissionsContext,
        orgId: board?.orgId,
        podId: board?.podId,
      }) &&
      board?.orgId,
    () => form.setFieldValue('orgId', board?.orgId)
  );

  const handleEntityDropdownChange = (orgId) => {
    form.setValues({
      ...form.initialValues,
      startDate: form.values.startDate,
      endDate: form.values.endDate,
      title: form.values.title,
      description: form.values.description,
      orgId,
    });
    form.setErrors({});
  };

  const handleOnchangePodId = (podId) => {
    form.setValues({
      ...form.values,
      privacyLevel: getPrivacyLevel(podId, pods),
      podId,
    });
    form.setErrors({});
  };

  const isInPrivatePod = getPrivacyLevel(form.values.podId, pods) === privacyOptions.private.value;

  useEffect(() => {
    if (existingGrant?.privacyLevel !== null && existingGrant?.privacyLevel !== undefined) {
      form.setFieldValue('privacyLevel', existingGrant?.privacyLevel);
    } else if (podBoard) {
      if (isInPrivatePod) {
        form.setFieldValue('privacyLevel', privacyOptions.private.value);
      } else if (podBoard?.privacyLevel === privacyOptions.public.value) {
        form.setFieldValue('privacyLevel', privacyOptions.public.value);
      }
    } else if (orgBoard) {
      if (orgBoard?.orgData?.privacyLevel === privacyOptions.public.value) {
        form.setFieldValue('privacyLevel', privacyOptions.public.value);
      } else {
        form.setFieldValue('privacyLevel', privacyOptions.private.value);
      }
    } else {
      form.setFieldValue('privacyLevel', privacyOptions.public.value);
    }
  }, [isInPrivatePod, existingGrant?.privacyLevel, orgBoard, podBoard]);

  const handleExistingMediaAttach = async (event) => {
    const fileToAdd = await handleAddFile({
      event,
      filePrefix: 'tmp/task/new/',
      mediaUploads: form.values.mediaUploads,
      setMediaUploads: (mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads),
      setFileUploadLoading,
    });
    if (existingGrant) {
      attachMedia({
        variables: {
          grantId: existingGrant.id,
          input: {
            mediaUploads: [fileToAdd],
          },
        },
        onCompleted: (data) => {
          const task = data?.attachTaskMedia || data?.attachTaskProposalMedia;
          form.setFieldValue('mediaUploads', transformMediaFormat(task?.media));
          setFileUploadLoading(false);
        },
      });
    }
  };

  return (
    <Form onSubmit={form.handleSubmit}>
      <TaskModalCard fullScreen={isFullScreen} data-cy="modal-create-grant">
        <CreateEntityHeader>
          <CreateEntityHeaderWrapper>
            <CreateEntitySelectErrorWrapper>
              <CreateEntityDropdown
                name="orgId"
                options={filteredDaoOptions}
                onChange={handleEntityDropdownChange}
                value={form.values.orgId}
                DefaultImageComponent={CreateEntityDefaultDaoImage}
                error={form.errors.orgId}
                onFocus={() => form.setFieldError('orgId', undefined)}
              />
              {form.errors.orgId && <CreateEntityError>{form.errors.orgId}</CreateEntityError>}
            </CreateEntitySelectErrorWrapper>
            {form.values.orgId !== null && (
              <>
                <CreateEntityHeaderArrowIcon />
                <PodSearch
                  options={filterOptionsWithPermission(
                    ENTITIES_TYPES.GRANT,
                    pods,
                    fetchedUserPermissionsContext,
                    form.values.orgId
                  )}
                  value={form.values.podId}
                  onChange={handleOnchangePodId}
                />
              </>
            )}
          </CreateEntityHeaderWrapper>
          <CreateEntityHeaderWrapper>
            <Tooltip title="Full screen" placement="top">
              <Box>
                <CreateEntityOpenInFullIcon onClick={toggleFullScreen} />
              </Box>
            </Tooltip>
          </CreateEntityHeaderWrapper>
        </CreateEntityHeader>
        <GrantModalData fullScreen={isFullScreen}>
          <GrantDescriptionMedia fullScreen={isFullScreen}>
            <CreateEntityTitle
              type="text"
              onChange={form.handleChange('title')}
              value={form.values.title}
              name="title"
              placeholder="Enter a title"
              minRows={1}
              maxRows={3}
              error={form.errors?.title}
              onFocus={() => form.setFieldError('title', undefined)}
              data-cy="create-entity-input-title"
              autoFocus
            />
            <CreateEntityError>{form.errors?.title}</CreateEntityError>

            <EditorToolbar ref={setEditorToolbarNode} />
            <RichTextWrapper>
              <RichTextContainer
                onClick={() => {
                  // since editor will collapse to 1 row on input, we need to emulate min-height somehow
                  // to achive it, we wrap it with EditorContainer and make it switch focus to editor on click
                  ReactEditor.focus(editor);
                  // also we need to move cursor to the last position in the editor
                  Transforms.select(editor, {
                    anchor: Editor.end(editor, []),
                    focus: Editor.end(editor, []),
                  });
                }}
              >
                <RichTextEditor
                  editor={editor}
                  onMentionChange={search}
                  initialValue={form.values.description}
                  mentionables={filterOrgUsersForAutocomplete(orgUsersData)}
                  placeholder={<EditorPlaceholder>Enter a description</EditorPlaceholder>}
                  toolbarNode={editorToolbarNode}
                  onChange={(value) => {
                    form.setFieldValue('description', value);
                  }}
                  editorContainerNode={document.querySelector('#modal-scrolling-container')}
                  onClick={(e) => {
                    // we need to stop click event propagation,
                    // since EditorContainer moves cursor to the last position in the editor on click
                    e.stopPropagation();
                  }}
                />
              </RichTextContainer>
              {form.errors?.description && <ErrorText>{form.errors?.description}</ErrorText>}
            </RichTextWrapper>
          </GrantDescriptionMedia>
          <MediaWrapper show>
            <MediaUploadDiv>
              {form.values.mediaUploads?.length > 0 &&
                form.values.mediaUploads.map((mediaItem) => (
                  <MediaItem
                    key={mediaItem?.uploadSlug}
                    mediaUploads={form.values.mediaUploads}
                    setMediaUploads={(mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads)}
                    mediaItem={mediaItem}
                    removeMediaItem={() => {
                      if (existingGrant) {
                        removeGrantMedia({
                          variables: {
                            grantId: existingGrant.id,
                            slug: mediaItem?.uploadSlug || mediaItem?.slug,
                          },
                        });
                      }
                    }}
                  />
                ))}
              <CreateEntityAttachment onClick={() => inputRef?.current?.click()}>
                <CreateEntityAttachmentIcon />
                Add Attachment
                {fileUploadLoading && <FileLoading />}
              </CreateEntityAttachment>
            </MediaUploadDiv>
            <input type="file" hidden ref={inputRef} onChange={handleExistingMediaAttach} />
          </MediaWrapper>
          <GrantSectionDisplayDivWrapper fullScreen={isFullScreen}>
            <GrantAmount
              value={form.values.reward}
              onChange={form.setFieldValue}
              setError={form.setFieldError}
              orgId={form.values.orgId}
              error={form.errors.reward}
            />
            <GrantQuantity
              value={form.values.numOfGrant}
              onChange={(value) => form.setFieldValue('numOfGrant', value)}
              setError={form.setFieldError}
              error={form.errors.numOfGrant}
            />
            <Dates
              startDate={form.values.startDate}
              endDate={form.values.endDate}
              onChange={(key, value) => form.setFieldValue(key, value)}
            />
            <ApplyPolicy
              onChange={(value) => form.setFieldValue('applyPolicy', value)}
              value={form.values.applyPolicy}
            />
            <Categories
              categories={form.values.categories}
              onChange={(value) => {
                form.setFieldValue(
                  'categories',
                  value?.map((item) => item.id)
                );
              }}
            />
          </GrantSectionDisplayDivWrapper>
        </GrantModalData>
        <CreateEntityHeader>
          <CreateEntityHeaderWrapper>
            <CreateEntityPrivacySelect
              name="privacyLevel"
              value={form.values.privacyLevel}
              onChange={(value) => {
                form.setFieldValue('privacyLevel', value);
              }}
              renderValue={(value) => (
                <Tooltip placement="top">
                  <CreateEntityPrivacySelectRender>
                    <CreateEntityPrivacySelectRenderLabel>{value?.label}</CreateEntityPrivacySelectRenderLabel>
                    <CreateEntitySelectArrowIcon />
                  </CreateEntityPrivacySelectRender>
                </Tooltip>
              )}
            >
              {Object.keys(privacyOptions).map((i) => {
                const { label, value, Icon } = privacyOptions[i];
                return (
                  <CreateEntityPrivacySelectOption key={value} value={value}>
                    <CreateEntityPrivacyIconWrapper>{Icon && <Icon />}</CreateEntityPrivacyIconWrapper>
                    <CreateEntityPrivacyLabel>{label}</CreateEntityPrivacyLabel>
                  </CreateEntityPrivacySelectOption>
                );
              })}
            </CreateEntityPrivacySelect>
          </CreateEntityHeaderWrapper>
          <CreateEntityHeaderWrapper>
            {false ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <CreateEntityCancelButton onClick={cancel}>Cancel</CreateEntityCancelButton>
                <CreateEntitySelectErrorWrapper>
                  <CreateEntityCreateTaskButton type="submit" data-cy="create-entity-button-submit">
                    {isEdit ? 'Update' : 'Create'} grant
                  </CreateEntityCreateTaskButton>
                  {!isEmpty(form.errors) && <CreateEntityError>Please check your input fields</CreateEntityError>}
                </CreateEntitySelectErrorWrapper>
              </>
            )}
          </CreateEntityHeaderWrapper>
        </CreateEntityHeader>
      </TaskModalCard>
    </Form>
  );
};

export default CreateGrant;
