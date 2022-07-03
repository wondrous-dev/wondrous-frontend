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

export const ErrorModal = (props) => {
  const { open, onClose, text, buttonText, buttonAction } = props;
  const handleOnClose = () => {
    onClose();
  };

  return (
    <KudosFormModal open={open} fullWidth={true} maxWidth={'sm'} onClose={handleOnClose}>
      <KudosFormBorder>
        <KudosFormBackground>
          <KudosFormHeader>
            <KudosFormHeaderText>{text}</KudosFormHeaderText>
            <KudosFormHeaderCloseButton onClick={handleOnClose} />
          </KudosFormHeader>
          <KudosFormDivider />
          <KudosFormButtonWrapper>
            <KudosFormSubmitButton onClick={buttonAction}>
              <KudosFormSubmitButtonText>{buttonText}</KudosFormSubmitButtonText>
            </KudosFormSubmitButton>
          </KudosFormButtonWrapper>
        </KudosFormBackground>
      </KudosFormBorder>
    </KudosFormModal>
  );
};
