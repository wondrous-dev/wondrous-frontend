import { useMutation } from '@apollo/client';
import { Box, CircularProgress, Grid, Tooltip } from '@mui/material';
import { useMe, withAuth } from 'components/Auth/withAuth';
import { ErrorText } from 'components/Common';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import {
  TaskModalCard,
  TaskModalTaskData,
  TaskModalTitleDescriptionMedia,
  TaskSectionDisplayDiv,
  TaskSectionDisplayDivWrapper,
} from 'components/Common/TaskViewModal/styles';
import { useContextValue, useGetOrgUsers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityAttachment,
  CreateEntityAttachmentIcon,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityCancelButton,
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
  EditorToolbar,
  MediaUploadDiv,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { filterOrgUsersForAutocomplete } from 'components/CreateEntity/CreatePodModal';
import { MediaItem } from 'components/CreateEntity/MediaItem';
import { GrantAmount } from 'components/CreateGrant/Fields';
import { GrantTextField, GrantTextFieldInput } from 'components/CreateGrant/Fields/styles';
import {
  Form,
  GrantDescriptionMedia,
  GrantModalData,
  GrantSectionDisplayDivWrapper,
  RichTextContainer,
  RichTextWrapper,
} from 'components/CreateGrant/styles';
import ArrowBackIcon from 'components/Icons/Sidebar/arrowBack.svg';
import { deserializeRichText, extractMentions, RichTextEditor, useEditor } from 'components/RichText';
import { selectApplicationStatus } from 'components/ViewGrant/utils';
import { useFormik } from 'formik';
import {
  ATTACH_GRANT_APPLICATION_MEDIA,
  CREATE_GRANT_APPLICATION,
  REMOVE_GRANT_APPLICATION_MEDIA,
  REOPEN_GRANT_APPLICATION,
  UPDATE_GRANT_APPLICATION,
} from 'graphql/mutations';
import { isEmpty, keys } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { GRANT_APPLICATION_STATUSES } from 'utils/constants';
import { transformMediaFormat } from 'utils/helpers';
import { useTaskContext } from 'utils/hooks';
import { handleAddFile } from 'utils/media';
import * as yup from 'yup';
import { ActionButton, FooterButtonsWrapper, HeaderTypography, IconWrapper } from './styles';
import { descriptionTemplate } from './utils';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  paymentAddress: yup.string().required('Wallet address is required'),
  mediaUploads: yup.array(),
});

const CreateGrantApplication = ({ grantApplication = null, isEditMode, handleClose }) => {
  const user = useMe();
  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  const editor = useEditor();
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [createGrantApplication] = useMutation(CREATE_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantById'],
  });
  const [reopenGrantApplication] = useMutation(REOPEN_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationById'],
  });
  const [updateGrantApplication] = useMutation(UPDATE_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant', 'getGrantApplicationById'],
    onCompleted: (data) => {
      const status = selectApplicationStatus(data?.updateGrantApplication);
      if (status === GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED) {
        reopenGrantApplication({
          variables: {
            grantApplicationId: data?.updateGrantApplication?.id,
          },
        });
      }
    },
  });

  const taskContext = useTaskContext();
  const { isFullScreen, toggleCreateApplicationModal, toggleFullScreen } = taskContext;

  const grant = grantApplication?.grant || taskContext?.grant;
  const orgId = grant?.org?.id;

  const [attachGrantApplicationMedia] = useMutation(ATTACH_GRANT_APPLICATION_MEDIA);

  const [removeGrantApplicationMedia] = useMutation(REMOVE_GRANT_APPLICATION_MEDIA);

  const inputRef: any = useRef();
  const initialValues = {
    title: grantApplication?.title || '',
    description: grantApplication
      ? deserializeRichText(grantApplication.description)
      : deserializeRichText(descriptionTemplate),
    paymentAddress: grantApplication?.paymentAddress || user?.activeEthAddress || null,
    mediaUploads: transformMediaFormat(grantApplication?.media) || [],
  };

  const handleCloseAction = () => (isEditMode ? handleClose() : toggleCreateApplicationModal());

  const handleGrantApplicationSubmit = isEditMode
    ? ({ variables }) =>
        updateGrantApplication({
          variables: {
            grantApplicationId: grantApplication.id,
            input: variables.input,
          },
        })
    : createGrantApplication;

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
          },
        },
      }).then(() => handleCloseAction());
    },
  });

  useEffect(() => {
    if (isEditMode && !form.values.title && !form.values.paymentAddress) {
      keys(initialValues).forEach((key) => form.setFieldValue(key, initialValues[key]));
    }
  }, [isEditMode]);

  const { data: orgUsersData, search, hasMoreOrgUsers, fetchMoreOrgUsers } = useGetOrgUsers(orgId);

  const handleUseConnectedButton = () => form.setFieldValue('paymentAddress', user?.activeEthAddress);

  const attachMedia = async (event) => {
    const fileToAdd = await handleAddFile({
      event,
      filePrefix: 'tmp/task/new/',
      mediaUploads: form.values.mediaUploads,
      setMediaUploads: (mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads),
      setFileUploadLoading,
    });
    if (grantApplication) {
      attachGrantApplicationMedia({
        variables: {
          grantApplicationId: grantApplication?.id,
          input: {
            mediaUploads: [fileToAdd],
          },
        },
      });
    }
  };

  const removeMediaItem = (mediaItem) => {
    if (grantApplication) {
      removeGrantApplicationMedia({
        variables: {
          grantApplicationId: grantApplication?.id,
          slug: mediaItem?.uploadSlug || mediaItem?.slug,
        },
      });
    }
  };

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
            </RichTextWrapper>
            {form.errors?.description && <ErrorText>{form.errors?.description}</ErrorText>}
          </GrantDescriptionMedia>
          <GrantSectionDisplayDivWrapper fullScreen={isFullScreen}>
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
                        removeMediaItem={() => removeMediaItem(mediaItem)}
                      />
                    ))}
                  <CreateEntityAttachment onClick={() => inputRef.current.click()}>
                    <CreateEntityAttachmentIcon />
                    Add Attachment
                    {fileUploadLoading && <FileLoading />}
                  </CreateEntityAttachment>
                </MediaUploadDiv>
                <input type="file" hidden ref={inputRef} onChange={attachMedia} />
              </CreateEntityWrapper>
            </TaskSectionDisplayDiv>
          </GrantSectionDisplayDivWrapper>
        </GrantModalData>
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
