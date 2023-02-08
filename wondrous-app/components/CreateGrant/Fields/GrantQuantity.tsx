import { Grid } from '@mui/material';
import { TaskSectionDisplayDiv } from 'components/Common/TaskViewModal/styles';
import {
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityError,
  CreateEntityLabel,
  CreateEntityLabelWrapper,
  CreateEntityWrapper,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { GrantTextField, GrantTextFieldInput } from './styles';

const GrantQuantity = ({ onChange, value = null, error, setError, defaultValue = null}) => (
  <TaskSectionDisplayDiv alignItems="start">
    <CreateEntityLabelWrapper>
      <CreateEntityLabel>Quantity</CreateEntityLabel>
    </CreateEntityLabelWrapper>
    <CreateEntityWrapper>
      <Grid display="flex" direction="column" gap="4px" width="100%">
        <GrantTextField
          autoComplete="off"
          autoFocus={!value}
          name="amount"
          onChange={(e) => onChange(e.target.value)}
          placeholder="How many grants are available?"
          {...(defaultValue && { defaultValue })}
          {...(value && { value })}
          fullWidth
          InputProps={{
            inputComponent: GrantTextFieldInput,
            type: 'number',

            endAdornment: (
              <CreateEntityAutocompletePopperRenderInputAdornment position="end" onClick={() => onChange('')}>
                <CreateEntityAutocompletePopperRenderInputIcon />
              </CreateEntityAutocompletePopperRenderInputAdornment>
            ),
          }}
          error={error}
          onFocus={() => setError('numOfGrant', undefined)}
        />
        {error && <CreateEntityError>{error}</CreateEntityError>}
      </Grid>
    </CreateEntityWrapper>
  </TaskSectionDisplayDiv>
);

export default GrantQuantity;
