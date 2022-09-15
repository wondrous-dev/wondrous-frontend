import { useMutation } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import { CREATE_POST, UPDATE_POST } from 'graphql/mutations/post';
import { ObjectType, PostType, PostVerbType } from 'types/post';
import { SnackbarAlertContext } from '../SnackbarAlert';
import {
  KudosFormBackground,
  KudosFormBorder,
  KudosFormButtonWrapper,
  KudosFormCancelButton,
  KudosFormDivider,
  KudosFormError,
  KudosFormHeader,
  KudosFormHeaderCloseButton,
  KudosFormHeaderText,
  KudosFormModal,
  KudosFormSubmitButton,
  KudosFormTextarea,
  KudosFormTextareaCharacterCount,
  KudosFormTextareaWrapper,
  KudosFormSubmitButtonText,
} from './styles';

const maxLength = 380;

function KudosForm(props) {
  const { open, onClose, submission, existingContent, id } = props;
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);
  const [textarea, setTextarea] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [error, setError] = useState(false);
  const [createPost] = useMutation(CREATE_POST);
  const [updatePost] = useMutation(UPDATE_POST);
  const handleChange = (e) => {
    if (error) {
      setError(false);
    }
    if (e.target.value.length <= maxLength) {
      setTextarea(e.target.value);
      setCharacterCount(e.target.value.length);
    }
  };
  const handleOnClose = () => {
    setTextarea('');
    setCharacterCount(0);
    setError(false);
    onClose();
  };
  const handleSubmit = async (input) => {
    if (characterCount < 1) {
      setError(true);
    } else if (existingContent) {
      await updatePost({
        variables: {
          input: {
            id: input.id,
            content: input.content,
          },
        },
        refetchQueries: ['getOrgFeed', 'getPodFeed'],
      })
        .then(() => {
          handleOnClose();
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage('Kudos updated successfully.');
        })
        .catch((err) => console.error(err));
    } else {
      await createPost({
        variables: { input },
        refetchQueries: ['getOrgFeed', 'getPodFeed'],
      })
        .then(() => {
          handleOnClose();
          setSnackbarAlertOpen(true);
          setSnackbarAlertMessage('Kudos posted successfully.');
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    if (open && existingContent) {
      setTextarea(existingContent);
      setCharacterCount(existingContent?.length);
    }
  }, [existingContent, open]);

  return (
    <KudosFormModal open={open} fullWidth maxWidth="sm" onClose={handleOnClose}>
      <KudosFormBorder>
        <KudosFormBackground>
          <KudosFormHeader>
            <KudosFormHeaderText>What do you want to highlight in your kudos?</KudosFormHeaderText>
            <KudosFormHeaderCloseButton onClick={handleOnClose} />
          </KudosFormHeader>
          <KudosFormTextareaWrapper noValidate autoComplete="off">
            <KudosFormTextarea
              placeholder="What did they do that deserves a shout out?"
              rows={4}
              rowsMax={8}
              onChange={handleChange}
              value={textarea}
            />
            <KudosFormTextareaCharacterCount>
              {characterCount}/{maxLength} characters
            </KudosFormTextareaCharacterCount>
          </KudosFormTextareaWrapper>
          {error && <KudosFormError>This field is required.</KudosFormError>}
          <KudosFormDivider />
          <KudosFormButtonWrapper>
            <KudosFormCancelButton data-cy="button-approve-no-kudos" onClick={handleOnClose}>
              Approve without kudos{' '}
            </KudosFormCancelButton>
            <KudosFormSubmitButton
              onClick={() =>
                handleSubmit({
                  id,
                  content: textarea,
                  objectId: submission?.id,
                  type: PostType.QUOTE,
                  orgId: submission?.orgId,
                  podId: submission?.podId,
                  intent: PostVerbType.KUDOS,
                  objectType: ObjectType.TASK_SUBMISSION,
                  userMentions: [submission?.createdBy],
                })
              }
            >
              <KudosFormSubmitButtonText>Approve and give kudos</KudosFormSubmitButtonText>
            </KudosFormSubmitButton>
          </KudosFormButtonWrapper>
        </KudosFormBackground>
      </KudosFormBorder>
    </KudosFormModal>
  );
}

export default KudosForm;
