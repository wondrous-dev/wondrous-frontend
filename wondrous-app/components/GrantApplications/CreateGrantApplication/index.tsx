import {
  TaskModalCard,
  TaskModalTaskData,
  TaskModalTitleDescriptionMedia,
  TaskSectionDisplayDiv,
  TaskSectionDisplayDivWrapper,
} from 'components/Common/TaskViewModal/styles';
import {
  CreateEntityAttachment,
  CreateEntityAttachmentIcon,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityError,
  CreateEntityHeader,
  CreateEntityHeaderWrapper,
  CreateEntityLabel,
  CreateEntityLabelWrapper,
  CreateEntityOpenInFullIcon,
  CreateEntitySelectErrorWrapper,
  CreateEntityTitle,
  CreateEntityWrapper,
  EditorContainer,
  EditorPlaceholder,
  CreateEntityCancelButton,
  EditorToolbar,
  MediaUploadDiv,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { handleAddFile } from 'utils/media';
import { deserializeRichText, extractMentions, RichTextEditor, useEditor } from 'components/RichText';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useTaskContext } from 'utils/hooks';
import { useMe, withAuth } from 'components/Auth/withAuth';
import { Tooltip, Box, Grid, CircularProgress } from '@mui/material';
import { Form } from 'components/CreateGrant/styles';
import ArrowBackIcon from 'components/Icons/Sidebar/arrowBack.svg';
import { ErrorText } from 'components/Common';
import { filterOrgUsersForAutocomplete } from 'components/CreateEntity/CreatePodModal';
import { Transforms, Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import { useRef, useState } from 'react';
import { useGetOrgUsers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { GrantAmount } from 'components/CreateGrant/Fields';
import { GrantTextField, GrantTextFieldInput } from 'components/CreateGrant/Fields/styles';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import { MediaItem } from 'components/CreateEntity/MediaItem';
import { isEmpty } from 'lodash';
import { HeaderTypography, IconWrapper, ActionButton, FooterButtonsWrapper, RichTextContainer } from './styles';
import { descriptionTemplate } from './utils';
import { useMutation } from '@apollo/client';
import { CREATE_GRANT_APPLICATION, UPDATE_GRANT_APPLICATION } from 'graphql/mutations';
import { transformMediaFormat } from 'utils/helpers';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  paymentAddress: yup.string().required('Wallet address is required'),
  mediaUploads: yup.array(),
});

const CreateGrantApplication = ({grantApplication = null, isEditMode, handleClose}) => {
  const user = useMe();
  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  const editor = useEditor();
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [createGrantApplication] = useMutation(CREATE_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant'],
  });
  const [updateGrantApplication] = useMutation(UPDATE_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantApplicationById'],
  })

  const taskContext = useTaskContext();
  const { isFullScreen, toggleCreateApplicationModal, toggleFullScreen } = taskContext;

  const grant = grantApplication?.grant || taskContext?.grant;
  const orgId = grant?.org?.id

  const inputRef: any = useRef();
  const initialValues = {
    title: grantApplication?.title || '',
    description: grantApplication ? deserializeRichText(grantApplication.description) : deserializeRichText(descriptionTemplate),
    paymentAddress: grantApplication?.paymentAddress || user?.activeEthAddress || null,
    mediaUploads: transformMediaFormat(grantApplication?.media) || []
  };

  const handleMedia = () => ({ attach: () => {}, remove: () => {} });

  const handleCloseAction = () => isEditMode ? handleClose() : toggleCreateApplicationModal();

  const handleGrantApplicationSubmit = isEditMode ? ({variables}) => updateGrantApplication({variables: {
    grantApplicationId: grantApplication.id,
    input: variables.input
  }}): createGrantApplication;

  const form = useFormik({
    initialValues,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema,
    onSubmit: (values) => {
      const userMentions = extractMentions(values.description);
      handleGrantApplicationSubmit({
        variables: {
          input: {
            grantId: grant.id,
            title: values.title,
            mediaUploads: values.mediaUploads,
            paymentAddress: values.paymentAddress,
            description: JSON.stringify(values.description),
            userMentions,
          }
        }
      }).then(() => handleCloseAction())
    }
  });


  const { data: orgUsersData, search, hasMoreOrgUsers, fetchMoreOrgUsers } = useGetOrgUsers(orgId);

  const handleUseConnectedButton = () => form.setFieldValue('paymentAddress', user?.activeEthAddress);

  return (
    <Form onSubmit={form.handleSubmit}>
      <TaskModalCard fullScreen={isFullScreen} data-cy="modal-create-grant">
        <CreateEntityHeader>
          <CreateEntityHeaderWrapper>
            <HeaderTypography onClick={handleCloseAction}>
              <Grid container alignItems="center" gap="6px">
                <IconWrapper>
                  <ArrowBackIcon />
                </IconWrapper>
                {isEditMode ? 'Back to application' : 'Back to grant'}
              </Grid>
            </HeaderTypography>
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
          </TaskModalTitleDescriptionMedia>
          <TaskSectionDisplayDivWrapper fullScreen={isFullScreen}>
            <GrantAmount value={grant?.reward} disableInput disablePaymentSelect disableAmountOfRewards orgId={orgId} />
            <TaskSectionDisplayDiv alignItems="start">
              <CreateEntityLabelWrapper>
                <CreateEntityLabel>Wallet address</CreateEntityLabel>
              </CreateEntityLabelWrapper>
              <CreateEntityWrapper>
                <GrantTextField
                  autoComplete="off"
                  autoFocus={!form.values.paymentAddress}
                  name="paymentAddress"
                  onChange={form.handleChange}
                  placeholder="Enter address"
                  value={form.values.paymentAddress}
                  fullWidth
                  InputProps={{
                    inputComponent: GrantTextFieldInput,
                    endAdornment: (
                      <CreateEntityAutocompletePopperRenderInputAdornment
                        position="end"
                        onClick={() => form.setFieldValue('paymentAddress', '')}
                      >
                        <CreateEntityAutocompletePopperRenderInputIcon />
                      </CreateEntityAutocompletePopperRenderInputAdornment>
                    ),
                  }}
                  error={form.errors?.paymentAddress}
                  onFocus={() => form.setFieldError('paymentAddress', undefined)}
                />
                <ActionButton type="button" onClick={handleUseConnectedButton}>
                  Use connected
                </ActionButton>
              </CreateEntityWrapper>
            </TaskSectionDisplayDiv>
            <TaskSectionDisplayDiv alignItems="start">
              <CreateEntityLabelWrapper>
                <CreateEntityLabel>Include files</CreateEntityLabel>
              </CreateEntityLabelWrapper>
              <CreateEntityWrapper show>
                <MediaUploadDiv>
                  {form.values.mediaUploads?.length > 0 &&
                    form.values.mediaUploads.map((mediaItem) => (
                      <MediaItem
                        key={mediaItem?.uploadSlug}
                        mediaUploads={form.values.mediaUploads}
                        setMediaUploads={(mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads)}
                        mediaItem={mediaItem}
                        // removeMediaItem={() => {
                        //   if (existingTask) {
                        //     handleMedia().remove({
                        //       variables: {
                        //         ...(entityType === ENTITIES_TYPES.PROPOSAL
                        //           ? { proposalId: existingTask?.id }
                        //           : { taskId: existingTask?.id }),
                        //         slug: mediaItem?.uploadSlug || mediaItem?.slug,
                        //       },
                        //     });
                        //   }
                        // }}
                      />
                    ))}
                  <CreateEntityAttachment onClick={() => inputRef.current.click()}>
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
              </CreateEntityWrapper>
            </TaskSectionDisplayDiv>
          </TaskSectionDisplayDivWrapper>
        </TaskModalTaskData>
        <FooterButtonsWrapper>
          <CreateEntityHeaderWrapper>
            {false ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <CreateEntityCancelButton onClick={handleCloseAction}>Cancel</CreateEntityCancelButton>
                <CreateEntitySelectErrorWrapper>
                  <ActionButton type="submit" data-cy="create-entity-button-submit">
                    Submit application
                  </ActionButton>
                  {!isEmpty(form.errors) && <CreateEntityError>Please check your input fields</CreateEntityError>}
                </CreateEntitySelectErrorWrapper>
              </>
            )}
          </CreateEntityHeaderWrapper>
        </FooterButtonsWrapper>
      </TaskModalCard>
    </Form>
  );
};

export default withAuth(CreateGrantApplication);
