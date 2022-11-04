import { useQuery } from '@apollo/client';
import {
  CreateEntityDropdown,
  filterOptionsWithPermission,
  filterOrgUsersForAutocomplete,
  getPrivacyLevel,
  useContextValue,
  useGetAvailableUserPods,
  useGetOrgUsers,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import PodSearch from 'components/CreateEntity/CreateEntityModal/PodSearch';
import {
  CreateEntityBody,
  CreateEntityDefaultDaoImage,
  CreateEntityError,
  CreateEntityForm,
  CreateEntityHeader,
  CreateEntityHeaderArrowIcon,
  CreateEntityHeaderWrapper,
  CreateEntityOpenInFullIcon,
  CreateEntitySelectErrorWrapper,
  CreateEntityTitle,
  EditorContainer,
  EditorPlaceholder,
  EditorToolbar,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { useFormik } from 'formik';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { hasCreateTaskPermission } from 'utils/helpers';
import { useFullScreen, useGlobalContext, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import * as Yup from 'yup';
import Tooltip from 'components/Tooltip';
import Box from '@mui/material/Box';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { extractMentions, RichTextEditor, useEditor } from 'components/RichText';
import { ErrorText } from 'components/Common';

const validationSchema = Yup.object().shape({
  orgId: Yup.string().required('Organization is required').typeError('Organization is required'),
  podId: Yup.string().optional().nullable(),
  title: Yup.string().required('Title is required'),
  reviewerIds: Yup.array().of(Yup.string().nullable()).nullable(),
  assigneeId: Yup.string().nullable(),
  claimPolicy: Yup.string().nullable(),
  claimPolicyRoles: Yup.array().of(Yup.string()).optional().nullable(),
  shouldUnclaimOnDueDateExpiry: Yup.boolean().nullable(),
  points: Yup.number()
    .typeError('Points must be a number')
    .integer('Points must be whole number')
    .moreThan(0, 'Points must be greater than 0')
    .optional()
    .nullable(),
  rewards: Yup.array()
    .of(
      Yup.object({
        paymentMethodId: Yup.string().required(),
        rewardAmount: Yup.number()
          .typeError('Reward amount must be a number')
          .moreThan(0, 'Reward amount must be greater than 0'),
      })
    )
    .optional()
    .nullable(),
  milestoneId: Yup.string()
    .nullable()
    .test(
      'emptyCheck',
      'Please enter a valid Milestone',
      (milestoneId) => milestoneId !== '' && milestoneId !== undefined
    ),
});

const CreateGrant = (props) => {
  const router = useRouter();
  const { toggleFullScreen, isFullScreen } = useFullScreen();
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const { userOrgs } = useGlobalContext();
  const board = orgBoard || podBoard || userBoard;
  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  const editor = useEditor();

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'network-only',
  });

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

  const form = useFormik({
    initialValues: {
      rewards: null,
      startDate: null,
      endDate: null,
      title: '',
      description: '',
      reviewerIds: null,
      mediaUploads: null,
      orgId: null,
      categories: null,
      podId: board?.podId || null,
      privacyLevel: null,
    },
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
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

  console.log(form.values, filteredDaoOptions[0]?.value);

  const handleEntityDropdownChange = (orgId) => {
    form.setValues({
      ...form.initialValues,
      rewards: form.values.rewards,
      startDate: form.values.startDate,
      endDate: form.values.endDate,
      title: form.values.title,
      description: form.values.description,
      mediaUploads: form.values.mediaUploads,
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

  return (
    <CreateEntityForm onSubmit={() => {}} fullScreen={isFullScreen} data-cy="modal-create-grant">
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
      <CreateEntityBody>
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
        <EditorContainer
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
        </EditorContainer>
        {form.errors?.description && <ErrorText>{form.errors?.description}</ErrorText>}
      </CreateEntityBody>
    </CreateEntityForm>
  );
};

export default CreateGrant;
