import { Grid } from '@mui/material';
import { FIELDS } from 'components/Common/TaskViewModal/Fields/hooks/constants';
import { useSubmit } from 'components/Common/TaskViewModal/Fields/hooks/useSubmit';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { ActionButton, ViewFieldWrapper } from 'components/Common/TaskViewModal/styles';
import {
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityError,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { GrantTextField, GrantTextFieldInput } from 'components/CreateGrant/Fields/styles';
import EditIcon from 'components/Icons/editIcon';
import { useMemo, useState } from 'react';
import { useWonderWeb3 } from 'services/web3';
import palette from 'theme/palette';
import { WalletAddressViewer } from '../Fields';

const EditContent = ({ toggleEditMode, paymentAddress, error, handleChange, handleUseConnectedButton }) => (
  <Grid display="flex" direction="column" gap="14px" width="100%">
    <Grid display="flex" gap="14px" width="100%" justifyContent="space-between">
      <GrantTextField
        autoComplete="off"
        autoFocus
        name="paymentAddress"
        onChange={handleChange}
        placeholder="Enter address"
        value={paymentAddress}
        fullWidth
        InputProps={{
          inputComponent: GrantTextFieldInput,
          endAdornment: (
            <CreateEntityAutocompletePopperRenderInputAdornment position="end" onClick={toggleEditMode}>
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

const WalletAddress = ({ paymentAddress, canEdit }) => {
  const { submit, error } = useSubmit({ field: FIELDS.PAYMENT_ADDRESS });
  const wonderWeb3 = useWonderWeb3();

  const [address, setAddress] = useState(paymentAddress);

  const connectedAddress = useMemo(() => {
    const isEns = wonderWeb3?.wallet?.addressTag.includes('.eth');
    return isEns ? wonderWeb3?.wallet?.addressTag : wonderWeb3?.wallet?.address;
  }, [wonderWeb3]);

  const handleChange = (e) => setAddress(e.target.value);

  const handleUseConnectedButton = async () => setAddress(connectedAddress);

  const handleSubmit = async () => {
    const isEns = address.includes('.eth');
    const paymentAddress = isEns ? await wonderWeb3.getAddressFromENS(address) : address;
    await submit(paymentAddress);
  };

  return (
    <TaskFieldEditableContent
      onClose={handleSubmit}
      editableContent={({ toggleEditMode }) => (
        <EditContent
          toggleEditMode={toggleEditMode}
          paymentAddress={paymentAddress}
          error={error}
          handleChange={handleChange}
          handleUseConnectedButton={handleUseConnectedButton}
        />
      )}
      ViewContent={({ toggleEditMode }) => (
        <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
          <WalletAddressViewer walletAddress={paymentAddress} />
          <EditIcon stroke={palette.grey58} className="edit-icon-field" />
        </ViewFieldWrapper>
      )}
    />
  );
};

export default WalletAddress;
