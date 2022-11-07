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
  CreateEntityDefaultDaoImage,
  CreateEntityError,
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
import { deserializeRichText, RichTextEditor, useEditor } from 'components/RichText';
import { ErrorText } from 'components/Common';
import {
  TaskModalCard,
  TaskModalTaskData,
  TaskModalTitleDescriptionMedia,
  TaskSectionDisplayDivWrapper,
} from 'components/Common/TaskViewModal/styles';
import { GrantAmount } from './Fields';
import { descriptionTemplate } from './utils';
import { Form } from './style';

// 1. grant amount - CHAIN - VALUE - AMOUNT
// 2. Start date - end date
// 3. Eligibility - Anyone / Members only
// 4. Reviewers
// 5. Category

const validationSchema = Yup.object().shape({
  orgId: Yup.string().required('Organization is required').typeError('Organization is required'),
  grantAmount: Yup.object({
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
  categories: Yup.array().of(Yup.string()).optional().nullable(),
  title: Yup.string().required('Title is required'),
  reviewerIds: Yup.array().of(Yup.string().nullable()).nullable(),
});

const CreateGrant = (props) => {
  const router = useRouter();
  const { toggleFullScreen, isFullScreen } = useFullScreen(true);
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
      grantAmount: {
        paymentMethodId: '',
        rewardAmount: 0,
        amount: 0,
      },
      startDate: null,
      endDate: null,
      title: '',
      description: deserializeRichText(descriptionTemplate),
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
    <Form onSubmit={(val) => console.log(val)}>
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
            </EditorContainer>
            {form.errors?.description && <ErrorText>{form.errors?.description}</ErrorText>}
          </TaskModalTitleDescriptionMedia>
          <TaskSectionDisplayDivWrapper fullScreen={isFullScreen}>
            <GrantAmount
              value={form.values.grantAmount}
              onChange={({ key, value }) =>
                form.setFieldValue('grantAmount', { ...form.values.grantAmount, [key]: value })
              }
              orgId={form.values.orgId}
              onReset={() => form.setFieldValue('grantAmount', { amount: '', currency: '', rewardAmount: 0 })}
              onFocus={() => form.setFieldError('grantAmount', undefined)}
              error={form.errors.grantAmount}
            />
          </TaskSectionDisplayDivWrapper>
        </TaskModalTaskData>
      </TaskModalCard>
    </Form>
  );
};

export default CreateGrant;
