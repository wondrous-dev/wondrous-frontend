import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { CREATE_POST } from '../../../graphql/mutations/post';
import { PostType, PostVerbType } from '../../../types/post';
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
} from './styles';

const maxLength = 380;

export const KudosForm = (props) => {
  const { open, onClose, submission } = props;
  const [textarea, setTextarea] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [error, setError] = useState(false);
  const [createPost] = useMutation(CREATE_POST);
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
    } else {
      await createPost({
        variables: { input },
      })
        .then(() => {
          handleOnClose();
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <KudosFormModal open={open} fullWidth={true} maxWidth={'sm'} onClose={handleOnClose}>
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
            <KudosFormCancelButton onClick={handleOnClose}>Maybe Later</KudosFormCancelButton>
            <KudosFormSubmitButton
              onClick={() =>
                handleSubmit({
                  content: textarea,
                  objectId: submission?.taskId,
                  type: PostType.QUOTE,
                  orgId: submission?.orgId,
                  podId: submission?.podId,
                  intent: PostVerbType.KUDOS,
                })
              }
            >
              Post feedback to activity board
            </KudosFormSubmitButton>
          </KudosFormButtonWrapper>
        </KudosFormBackground>
      </KudosFormBorder>
    </KudosFormModal>
  );
};
