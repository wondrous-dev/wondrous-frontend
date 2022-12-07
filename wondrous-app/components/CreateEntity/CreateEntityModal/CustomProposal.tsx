import { useState } from 'react';
import AddIcon from 'components/Icons/add.svg';
import { ErrorText } from 'components/Common';
import {
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CustomAddOptionButton,
  CustomAddOptionButtonText,
  CustomAddOptionDiv,
  CustomProposalContainer,
  CustomProposalInput,
} from './styles';

export default function CustomProposal(props) {
  const { form } = props;
  const customProposalChoices = form?.values?.customProposalChoices;

  const customProposalChoicesError = form?.errors?.customProposalChoices;

  return (
    <CustomProposalContainer>
      {customProposalChoices?.map((choice, index) => (
        <CustomProposalInput
          key={index}
          value={customProposalChoices[index]}
          placeholder={`Enter option ${index + 1}`}
          onChange={(e) => {
            const newChoicesArray = [...customProposalChoices];
            newChoicesArray[index] = e.target.value;
            form?.setFieldValue('customProposalChoices', newChoicesArray);
          }}
          endAdornment={
            <CreateEntityAutocompletePopperRenderInputAdornment
              position="end"
              onClick={() => {
                const newChoicesArray = [...customProposalChoices];
                if (newChoicesArray.length > 1) {
                  newChoicesArray.splice(index, 1);
                  form?.setFieldValue('customProposalChoices', newChoicesArray);
                }
              }}
            >
              <CreateEntityAutocompletePopperRenderInputIcon />
            </CreateEntityAutocompletePopperRenderInputAdornment>
          }
        />
      ))}
      <CustomAddOptionDiv>
        <CustomAddOptionButton
          onClick={() => {
            form?.setFieldValue('customProposalChoices', [...customProposalChoices, '']);
          }}
        >
          <AddIcon />
          <CustomAddOptionButtonText>Add Option</CustomAddOptionButtonText>
        </CustomAddOptionButton>
        {customProposalChoicesError?.length > 0 && (
          <ErrorText
            style={{
              marginLeft: '12px',
            }}
          >
            {customProposalChoicesError[0]}
          </ErrorText>
        )}
      </CustomAddOptionDiv>
    </CustomProposalContainer>
  );
}
