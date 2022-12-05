import { useState } from 'react';
import AddIcon from 'components/Icons/add.svg';
import {
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CustomAddOptionButton,
  CustomAddOptionButtonText,
  CustomProposalContainer,
  CustomProposalInput,
} from './styles';

export default function CustomProposal(props) {
  const { form } = props;
  const customProposalChoices = form?.values?.customProposalChoices;
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
      <CustomAddOptionButton
        onClick={() => {
          form?.setFieldValue('customProposalChoices', [...customProposalChoices, '']);
        }}
      >
        <AddIcon />
        <CustomAddOptionButtonText>Add Option</CustomAddOptionButtonText>
      </CustomAddOptionButton>
    </CustomProposalContainer>
  );
}
