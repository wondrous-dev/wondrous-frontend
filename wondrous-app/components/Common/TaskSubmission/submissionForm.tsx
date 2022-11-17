import { useMutation, useQuery } from '@apollo/client';
import { filterOrgUsersForAutocomplete } from 'components/CreateEntity/CreatePodModal';
import PlusIcon from 'components/Icons/plus';
import { deserializeRichText, isBlankValue, plainTextToRichText, RichTextEditor, useEditor } from 'components/RichText';
import { Formik } from 'formik';
import {
  ATTACH_SUBMISSION_MEDIA,
  CREATE_TASK_SUBMISSION,
  REMOVE_SUBMISSION_MEDIA,
  UPDATE_TASK_SUBMISSION,
} from 'graphql/mutations/taskSubmission';
import { SEARCH_ORG_USERS } from 'graphql/queries/org';
import isEmpty from 'lodash/isEmpty';
import { useContext, useRef, useState } from 'react';
import { ReactEditor } from 'slate-react';
import { transformMediaFormat } from 'utils/helpers';
import { handleAddFile } from 'utils/media';
import * as Yup from 'yup';
import { SnackbarAlertContext } from '../SnackbarAlert';
import {
  SubmissionDescriptionEditor,
  SubmissionDescriptionEditorEditorToolbar,
  SubmissionDisplayText,
  SubmissionDivider,
  SubmissionForm,
  SubmissionFormBackButton,
  SubmissionFormBackIcon,
  SubmissionFormBackText,
  SubmissionFormButtonWrapper,
  SubmissionFormCancel,
  SubmissionFormDescription,
  SubmissionFormError,
  SubmissionFormField,
  SubmissionFormLink,
  SubmissionFormLinkCloseIcon,
  SubmissionFormLinkEndAdornment,
  SubmissionFormLinkIcon,
  SubmissionFormLinkStartAdornment,
  SubmissionFormLinksWrapper,
  SubmissionFormLinkWrapper,
  SubmissionFormMediaItem,
  SubmissionFormMediaItemWrapper,
  SubmissionFormNewLink,
  SubmissionFormSubmit,
  SubmissionFormTitle,
  SubmissionFormUploadFileButton,
  SubmissionFormUploadFileButtonText,
  SubmissionFormUploadFileLoading,
  SubmissionFormWrapper,
} from './styles';

const removeLinkType = ({ displayName, url }) => ({ displayName, url });

const newLinkValue = ({ value, index, links }) => {
  const copiedLinks = [...links];
  copiedLinks[index] = { url: value, displayName: value };
  return copiedLinks;
};

const clearErrorOnFocus =
  ({ formik, index }) =>
  () => {
    formik.setFieldError('descriptionText', '');
    if (formik.errors?.link && formik.errors?.link[index]) {
      const errors = [...formik.errors?.link];
      errors[index] = undefined;
      formik.setFieldError('link', errors);
    }
  };

const removeLinkField =
  ({ formik, indexToRemove }) =>
  () => {
    const copiedLinks = [...formik.values.link];
    const newLinks = copiedLinks.filter((link, index) => index !== indexToRemove);
    formik.setFieldValue('link', newLinks);
    clearErrorOnFocus({ formik, index: indexToRemove })();
  };

const handleInputOnChange = async ({
  event,
  mediaUploads,
  submissionToEdit,
  attachTaskSubmissionMedia,
  setMediaUploads,
  setLoading,
}) => {
  setLoading(true);
  const fileToAdd = await handleAddFile({
    event,
    filePrefix: 'tmp/task/new/',
    mediaUploads,
    setMediaUploads: (i) => setMediaUploads(i),
  });
  if (submissionToEdit) {
    attachTaskSubmissionMedia({
      variables: {
        submissionId: submissionToEdit?.id,
        input: {
          mediaUploads: [fileToAdd],
        },
      },
      refetchQueries: () => ['getTaskSubmissionsForTask', 'attachTaskSubmissionMedia'],
    });
  }
  setLoading(false);
};

const handleRemoveItem =
  ({ mediaItem, removeTaskSubmissionMedia, submissionToEdit }) =>
  () => {
    if (!submissionToEdit?.id) return;
    removeTaskSubmissionMedia({
      variables: {
        submissionId: submissionToEdit?.id,
        slug: mediaItem?.uploadSlug,
      },
      refetchQueries: ['removeTaskSubmissionMedia', 'getTaskSubmissionsForTask'],
    });
  };

function SubmissionFormDescriptionField({ formik, orgId }) {
  const { data: orgUsersData, refetch } = useQuery(SEARCH_ORG_USERS, {
    variables: {
      orgIds: [orgId],
      searchString: '',
    },
  });
  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  const editor = useEditor();

  const handleUserMentionChange = (query) => refetch({ searchString: query });

  return (
    <SubmissionFormDescription>
      <SubmissionDescriptionEditorEditorToolbar ref={setEditorToolbarNode} />
      <SubmissionDescriptionEditor
        onClick={() => {
          ReactEditor.focus(editor);
          formik.setFieldError('descriptionText', '');
        }}
      >
        <RichTextEditor
          editor={editor}
          onMentionChange={handleUserMentionChange}
          initialValue={formik.values.descriptionText}
          mentionables={filterOrgUsersForAutocomplete(orgUsersData?.searchOrgUsers)}
          placeholder="Enter a description"
          toolbarNode={editorToolbarNode}
          onChange={(text) => formik.setFieldValue('descriptionText', text)}
          editorContainerNode={document.querySelector('#modal-scrolling-container')}
        />
      </SubmissionDescriptionEditor>
    </SubmissionFormDescription>
  );
}

function SubmissionFormLinkNewField({ formik, links }) {
  const handleOnClick = () => formik.setFieldValue('link', newLinkValue({ value: '', index: links.length, links }));
  return (
    <SubmissionFormNewLink onClick={handleOnClick}>
      <PlusIcon />
    </SubmissionFormNewLink>
  );
}

function SubmissionFormFieldErrorText({ children }) {
  if (!children) return null;
  return <SubmissionFormError>{children}</SubmissionFormError>;
}

function SubmissionFormLinkField({ formik }) {
  const links = [...formik.values.link];
  return (
    <SubmissionFormField>
      <SubmissionDisplayText>Link</SubmissionDisplayText>
      <SubmissionFormLinksWrapper>
        {links?.map((link, index) => (
          <SubmissionFormLinkWrapper key={index}>
            <SubmissionFormLink
              value={link?.url}
              onChange={(e) => formik.setFieldValue('link', newLinkValue({ value: e.target.value, index, links }))}
              placeholder="Enter link"
              onFocus={clearErrorOnFocus({ formik, index })}
              startAdornment={
                <SubmissionFormLinkStartAdornment position="start">
                  <SubmissionFormLinkIcon />
                </SubmissionFormLinkStartAdornment>
              }
              data-cy="submission-input-url"
              endAdornment={
                index > 0 && (
                  <SubmissionFormLinkEndAdornment
                    position="end"
                    onClick={removeLinkField({ formik, indexToRemove: index })}
                  >
                    <SubmissionFormLinkCloseIcon />
                  </SubmissionFormLinkEndAdornment>
                )
              }
            />
            <SubmissionFormFieldErrorText>{formik.errors?.link?.[index]?.url}</SubmissionFormFieldErrorText>
          </SubmissionFormLinkWrapper>
        ))}
        <SubmissionFormLinkNewField formik={formik} links={links} />
      </SubmissionFormLinksWrapper>
    </SubmissionFormField>
  );
}

function SubmissionsFilesList({ formik, submissionToEdit }) {
  const [removeTaskSubmissionMedia] = useMutation(REMOVE_SUBMISSION_MEDIA);
  return (
    <>
      {formik.values?.mediaUploads?.map((mediaItem) => (
        <SubmissionFormMediaItem
          key={mediaItem?.uploadSlug}
          mediaUploads={formik.values.mediaUploads}
          setMediaUploads={(arg) => formik.setFieldValue('mediaUploads', arg)}
          mediaItem={mediaItem}
          removeMediaItem={handleRemoveItem({
            mediaItem,
            removeTaskSubmissionMedia,
            submissionToEdit,
          })}
        />
      ))}
    </>
  );
}

function SubmissionFormUploadFileButtonWrapper({ onClick, loading, files }) {
  if (loading) return <SubmissionFormUploadFileLoading />;
  const buttonText = files.length > 0 ? <PlusIcon /> : `Upload a file`;
  return (
    <SubmissionFormUploadFileButton onClick={onClick}>
      <SubmissionFormUploadFileButtonText>{buttonText}</SubmissionFormUploadFileButtonText>
    </SubmissionFormUploadFileButton>
  );
}

function SubmissionFormFilesField({ formik, submissionToEdit }) {
  const [attachTaskSubmissionMedia] = useMutation(ATTACH_SUBMISSION_MEDIA);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const handleInputRef = () => {
    inputRef.current.click();
    formik.setFieldError('descriptionText', '');
  };
  return (
    <SubmissionFormField>
      <SubmissionDisplayText>Files</SubmissionDisplayText>
      <SubmissionFormMediaItemWrapper>
        <SubmissionsFilesList formik={formik} submissionToEdit={submissionToEdit} />
        <SubmissionFormUploadFileButtonWrapper
          onClick={handleInputRef}
          loading={loading}
          files={formik.values?.mediaUploads}
        />
        <input
          type="file"
          hidden
          ref={inputRef}
          onChange={(event) =>
            handleInputOnChange({
              event,
              mediaUploads: formik.values.mediaUploads,
              submissionToEdit,
              attachTaskSubmissionMedia,
              setMediaUploads: (arg) => formik.setFieldValue('mediaUploads', arg),
              setLoading,
            })
          }
        />
      </SubmissionFormMediaItemWrapper>
    </SubmissionFormField>
  );
}

const SubmissionFormSchema = Yup.object().shape({
  descriptionText: Yup.string()
    .transform((value) => (isBlankValue(value) ? '' : JSON.stringify(value)))
    .when(['mediaUploads', 'link'], {
      is: (mediaUploads, link) => isEmpty(mediaUploads) && isEmpty(link.filter((i) => i.url)),
      then: (schema) => schema.required('Please provide a description, link, or file'),
    }),
  mediaUploads: Yup.array(),
  link: Yup.array(
    Yup.object({
      url: Yup.string().url('Please enter the complete url'),
      displayName: Yup.string().url('Please enter the complete url'),
    })
  ),
});

export function TaskSubmissionForm(props) {
  const { cancelSubmissionForm, orgId, taskId, submissionToEdit } = props;
  const refetchQueries = [
    'getTaskSubmissionsForTask',
    'getOrgTaskBoardTasks',
    'getPodTaskBoardTasks',
    'getUserTaskBoardTasks',
    'getTaskById',
  ];

  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;

  const handleSubmit = ({
    submissionToEdit,
    updateTaskSubmission,
    descriptionText,
    link,
    createTaskSubmission,
    taskId,
    mediaUploads,
  }) => {
    const filteredLinks = link.filter((i) => i.url);
    const stringifiedDescription = JSON.stringify(descriptionText);

    if (submissionToEdit) {
      updateTaskSubmission({
        variables: {
          submissionId: submissionToEdit?.id,
          input: {
            description: stringifiedDescription,
            links: filteredLinks,
          },
        },
      }).then();
    } else {
      createTaskSubmission({
        variables: {
          input: {
            taskId,
            description: stringifiedDescription,
            links: filteredLinks,
            mediaUploads,
          },
        },
      });
    }
  };

  const [createTaskSubmission] = useMutation(CREATE_TASK_SUBMISSION, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(`Successfully submitted!`);
    },
    refetchQueries,
  });
  const [updateTaskSubmission] = useMutation(UPDATE_TASK_SUBMISSION, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(`Successfully updated!`);
    },
    refetchQueries,
  });
  const submissionFormSubmitText = submissionToEdit ? 'Submit edits' : 'Submit for approval';
  return (
    <SubmissionFormWrapper>
      <SubmissionFormBackButton onClick={cancelSubmissionForm}>
        <SubmissionFormBackIcon />
        <SubmissionFormBackText>Back</SubmissionFormBackText>
      </SubmissionFormBackButton>
      <SubmissionDivider />
      <Formik
        initialValues={{
          descriptionText: deserializeRichText(submissionToEdit?.description) ?? plainTextToRichText(''),
          mediaUploads: transformMediaFormat(submissionToEdit?.media) ?? [],
          link: submissionToEdit?.links?.map(removeLinkType) ?? [
            {
              url: '',
              displayName: '',
            },
          ],
        }}
        validationSchema={SubmissionFormSchema}
        validateOnChange={false}
        onSubmit={(values) => {
          handleSubmit({
            submissionToEdit,
            updateTaskSubmission,
            createTaskSubmission,
            taskId,
            ...values,
          });
          cancelSubmissionForm();
        }}
      >
        {(formik) => (
          <SubmissionForm onSubmit={formik.handleSubmit}>
            <SubmissionFormTitle>Make a submission</SubmissionFormTitle>
            <SubmissionFormFieldErrorText>{formik.errors.descriptionText}</SubmissionFormFieldErrorText>
            <SubmissionFormDescriptionField formik={formik} orgId={orgId} />
            <SubmissionFormLinkField formik={formik} />
            <SubmissionFormFilesField formik={formik} submissionToEdit={submissionToEdit} />
            <SubmissionDivider />
            <SubmissionFormButtonWrapper>
              <SubmissionFormCancel onClick={cancelSubmissionForm}>Cancel</SubmissionFormCancel>
              <SubmissionFormSubmit data-cy="submission-button-submit">{submissionFormSubmitText}</SubmissionFormSubmit>
            </SubmissionFormButtonWrapper>
          </SubmissionForm>
        )}
      </Formik>
    </SubmissionFormWrapper>
  );
}
