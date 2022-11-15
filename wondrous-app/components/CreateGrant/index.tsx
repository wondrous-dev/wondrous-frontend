import { useMutation, useQuery } from '@apollo/client';
import {
  CreateEntityDropdown,
  filterCategoryValues,
  filterOptionsWithPermission,
  filterOrgUsersForAutocomplete,
  getPrivacyLevel,
  GrantCreateModalProps,
  privacyOptions,
  useContextValue,
  useGetAvailableUserPods,
  useGetCategories,
  useGetOrgUsers,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import PodSearch from 'components/CreateEntity/CreateEntityModal/PodSearch';
import {
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
  CreateEntityAttachment,
  CreateEntityAttachmentIcon,
  CreateEntityCancelButton,
  CreateEntityCreateTaskButton,
  CreateEntityDefaultDaoImage,
  CreateEntityDueDate,
  CreateEntityError,
  CreateEntityHeader,
  CreateEntityHeaderArrowIcon,
  CreateEntityHeaderWrapper,
  CreateEntityLabel,
  CreateEntityLabelAddButton,
  CreateEntityLabelSelectWrapper,
  CreateEntityLabelWrapper,
  CreateEntityOpenInFullIcon,
  CreateEntityPrivacyIconWrapper,
  CreateEntityPrivacyLabel,
  CreateEntityPrivacySelect,
  CreateEntityPrivacySelectOption,
  CreateEntityPrivacySelectRender,
  CreateEntityPrivacySelectRenderLabel,
  CreateEntitySelectArrowIcon,
  CreateEntitySelectErrorWrapper,
  CreateEntitySelectWrapper,
  CreateEntityTitle,
  EditorContainer,
  EditorPlaceholder,
  EditorToolbar,
  MediaUploadDiv,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { Formik, useFormik } from 'formik';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { hasCreateTaskPermission, transformMediaFormat } from 'utils/helpers';
import { useFullScreen, useGlobalContext, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import * as Yup from 'yup';
import Tooltip from 'components/Tooltip';
import Box from '@mui/material/Box';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { deserializeRichText, RichTextEditor, useEditor } from 'components/RichText';
import { ErrorText } from 'components/Common';
import {
  TaskModalCard,
  TaskModalTaskData,
  TaskModalTitleDescriptionMedia,
  TaskSectionDisplayDivWrapper,
} from 'components/Common/TaskViewModal/styles';
import Grid from '@mui/material/Grid';
import DropdownSearch from 'components/DropdownSearch';
import { CircularProgress } from '@mui/material';
import { isEmpty } from 'lodash';
import { GrantAmount, ApplyPolicy, Dates, Categories } from './Fields';
import { descriptionTemplate } from './utils';
import { Form, RichTextContainer } from './styles';
import { APPLY_POLICY_FIELDS } from './Fields/ApplyPolicy';
import { CREATE_GRANT, UPDATE_GRANT } from 'graphql/mutations/grant';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import { MediaItem } from 'components/CreateEntity/MediaItem';
import { handleAddFile } from 'utils/media';

const validationSchema = Yup.object().shape({
  orgId: Yup.string().required('Organization is required').typeError('Organization is required'),
  reward: Yup.object({
    paymentMethodId: Yup.string().required(),
    rewardAmount: Yup.number()
      .typeError('Reward amount must be a number')
      .moreThan(0, 'Reward amount must be greater than 0'),
    amount: Yup.number().moreThan(0, 'Amount must be greater than 0'),
  }),
  startDate: Yup.string().optional().nullable(),
  endDate: Yup.string().optional().nullable(),
  applyPolicy: Yup.string().nullable(),
  podId: Yup.string().optional().nullable(),
  categories: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string(),
        label: Yup.string(),
      })
    )
    .optional()
    .nullable(),
  title: Yup.string().required('Title is required'),
  mediaUploads: Yup.array(),
});

const CreateGrant = ({
  entityType,
  handleClose,
  cancel,
  existingGrant,
  parentTaskId,
  formValues,
  isEdit = false
}: GrantCreateModalProps) => {
  const router = useRouter();
  const { toggleFullScreen, isFullScreen } = useFullScreen(true);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const { userOrgs } = useGlobalContext();
  const board = orgBoard || podBoard || userBoard;
  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  const editor = useEditor();
  const [updateGrant] = useMutation(UPDATE_GRANT, {
    refetchQueries: ['getGrantOrgBoard', 'getGrantPodBoard', 'getGrantById']
  })

  // TODO: move the upload to a separate component 
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [createGrant] = useMutation(CREATE_GRANT, {
    refetchQueries: ['getGrantOrgBoard', 'getGrantPodBoard'],
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


  const grantAction = isEdit ? ({variables: {input}}) => updateGrant({
    variables: {
      grantId: existingGrant.id,
      input
    }
  }) : createGrant;

  const form = useFormik({
    initialValues: {
      reward: {
        paymentMethodId: existingGrant?.reward?.paymentMethodId || '',
        rewardAmount: existingGrant?.reward?.rewardAmount || '0',
      },
      numOfGrant: existingGrant?.numOfGrant || '0',
      mediaUploads: [],
      startDate: existingGrant?.startDate || null,
      endDate: existingGrant?.endDate || null,
      title: existingGrant?.title || '',
      description: existingGrant
        ? deserializeRichText(existingGrant.description)
        : deserializeRichText(descriptionTemplate),
      orgId: existingGrant?.orgId || null,
      categories: existingGrant?.categories || null,
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
            categories: values.categories?.map((category: any) => category.id),
            numOfGrant: parseInt(values.numOfGrant, 10),
          },
        },
      }).then(() => handleClose()),
  });

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
        <TaskModalTaskData fullScreen={isFullScreen}>
          <TaskModalTitleDescriptionMedia fullScreen={isFullScreen}>
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
            <CreateEntityLabelSelectWrapper show>
              <MediaUploadDiv>
                {form.values.mediaUploads?.length > 0 &&
                  form.values.mediaUploads.map((mediaItem) => (
                    <MediaItem
                      key={mediaItem?.uploadSlug}
                      mediaUploads={form.values.mediaUploads}
                      setMediaUploads={(mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads)}
                      mediaItem={mediaItem}
                      removeMediaItem={() => {
                        // if (existingGrant) {
                        //   handleMedia().remove({
                        //     variables: {
                        //       grantId: existingGrant.id,
                        //       slug: mediaItem?.uploadSlug || mediaItem?.slug,
                        //     },
                        //   });
                        // }
                      }}
                    />
                  ))}
                <CreateEntityAttachment onClick={() => inputRef?.current?.click()}>
                  <CreateEntityAttachmentIcon />
                  Add Attachment
                  {fileUploadLoading && <FileLoading />}
                </CreateEntityAttachment>
              </MediaUploadDiv>
              <input
                type="file"
                hidden
                ref={inputRef}
                onChange={async (event) => {
                  const fileToAdd = await handleAddFile({
                    event,
                    filePrefix: 'tmp/task/new/',
                    mediaUploads: form.values.mediaUploads,
                    setMediaUploads: (mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads),
                    setFileUploadLoading,
                  });
                }}
              />
            </CreateEntityLabelSelectWrapper>
          </TaskModalTitleDescriptionMedia>
          <TaskSectionDisplayDivWrapper fullScreen={isFullScreen}>
            <GrantAmount
              value={form.values.reward}
              numOfGrant={form.values.numOfGrant}
              onChange={form.setFieldValue}
              orgId={form.values.orgId}
              onReset={() => {
                form.setFieldValue('reward', { currency: '', rewardAmount: 0 })
                form.setFieldValue('numOfGrant', 0)
              }}
              onFocus={() => {
                form.setFieldError('reward', undefined)
                form.setFieldError('numOfGrant', undefined)
              }}
              error={{
                reward: form.errors.reward,
                numOfGrant: form.errors.numOfGrant,
              }}
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
              onChange={(value) => form.setFieldValue('categories', value)}
            />
          </TaskSectionDisplayDivWrapper>
        </TaskModalTaskData>
        <CreateEntityHeader>
          <CreateEntityHeaderWrapper>
            <CreateEntityPrivacySelect
              name="privacyLevel"
              value={form.values.privacyLevel}
              onChange={(value) => {
                console.log(value, 'valueprivacy')
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
