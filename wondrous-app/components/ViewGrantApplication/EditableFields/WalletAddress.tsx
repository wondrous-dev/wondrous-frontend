import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { ActionButton, ViewFieldWrapper } from 'components/Common/TaskViewModal/styles';
import {
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityError,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { GrantTextField, GrantTextFieldInput } from 'components/CreateGrant/Fields/styles';
import EditIcon from 'components/Icons/editIcon';
import { Grid } from '@mui/material';
import palette from 'theme/palette';
import { WalletAddressViewer } from '../Fields';
import { useSubmit } from 'components/Common/TaskViewModal/Fields/hooks/useSubmit';
import { useMemo } from 'react';
import { useWonderWeb3 } from 'services/web3';

const EditContent = ({ toggleEditMode, paymentAddress }) => {
  const { submit, error } = useSubmit({ field: null });
  const wonderWeb3 = useWonderWeb3();

  const connectedAddress = useMemo(() => {
    const isEns = wonderWeb3?.wallet?.addressTag.includes('.eth');
    return isEns ? wonderWeb3?.wallet?.addressTag : wonderWeb3?.wallet?.address;
  }, [wonderWeb3]);

  const handleBlur = (e) => console.log(e);

  const handleChange = (e) => console.log(e);

  const handleUseConnectedButton = () => console.log(connectedAddress);

  return (
    <Grid display="flex" direction="column" gap="14px" width="100%">
      <Grid display="flex" gap="14px" width="100%" justifyContent="space-between">
        <GrantTextField
          autoComplete="off"
          autoFocus
          name="paymentAddress"
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="Enter address"
          value={paymentAddress}
          fullWidth
          InputProps={{
            inputComponent: GrantTextFieldInput,
            endAdornment: (
              <CreateEntityAutocompletePopperRenderInputAdornment
                position="end"
                onClick={() => console.log('set null')}
              >
                <CreateEntityAutocompletePopperRenderInputIcon />
              </CreateEntityAutocompletePopperRenderInputAdornment>
            ),
          }}
          error={error}
        />
        <ActionButton type="button" onClick={handleUseConnectedButton}>
          Use connected
        </ActionButton>
      </Grid>
      {error && <CreateEntityError>{error}</CreateEntityError>}
    </Grid>
  );
};

const WalletAddress = ({ paymentAddress, canEdit }) => (
  <TaskFieldEditableContent
    addContent={({ toggleAddMode }) => null}
    editableContent={({ toggleEditMode }) => (
      <EditContent toggleEditMode={toggleEditMode} paymentAddress={paymentAddress} />
    )}
    ViewContent={({ toggleEditMode }) => (
      <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
        <WalletAddressViewer walletAddress={paymentAddress} />
        <EditIcon stroke={palette.grey58} className="edit-icon-field" />
      </ViewFieldWrapper>
    )}
  />
);

export default WalletAddress;
