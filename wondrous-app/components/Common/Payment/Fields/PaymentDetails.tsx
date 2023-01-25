/*
1. token / chain
2. amount
3. user
*/

import Grid from '@mui/material/Grid';
import { ErrorText } from 'components/Common';
import InputForm from 'components/Common/InputForm/inputForm';
import { LeftArrowIconWrapper } from 'components/Common/SidebarBackButton/styles';
import { ProfilePicture } from 'components/Common/TaskViewModalAutocomplete';
import Tooltip from 'components/Tooltip';
import { ENTITIES_TYPES } from 'utils/constants';
import { useCopyAddress } from 'utils/hooks';
import { PaymentData } from 'components/Common/Payment/types';
import { CHAIN_TO_CHAIN_DIPLAY_NAME, CHAIN_LOGO } from 'utils/web3Constants';
import { generateReadablePreviewForAddress } from '../SingleWalletPayment';
import { TokenWrapper, Wrapper, Label } from './styles';

interface Props {
  rewardAmount: number;
  onChange?: (e: any) => void;
  tokenName: string;
  error: string;
  paymentData: PaymentData;
  entityType?: string;
  payee?: {
    username: string;
    profilePicture: string;
    id: string;
  };
  disabled?: boolean;
}

const PaymentDetails = ({
  rewardAmount,
  onChange,
  tokenName,
  error,
  paymentData,
  entityType,
  payee = null,
  disabled = false,
}: Props) => {
  const { copyAddress } = useCopyAddress();
  return (
    <Wrapper
      gridStyle={{
        marginTop: '24px',
      }}
      label="Payment Details"
    >
      <Grid display="flex" alignItems="center" gap="14px" width="100%">
        <Grid display="flex" alignItems="center" gap="8px" width="100%">
          <TokenWrapper>{tokenName}</TokenWrapper>
          <InputForm
            value={rewardAmount}
            style={{
              height: '32px',
            }}
            onChange={onChange}
            placeholder="Enter reward amount"
            search={false}
            disabled={disabled}
          />
        </Grid>
        <LeftArrowIconWrapper
          style={{
            transform: `rotate(180deg)`,
            borderRadius: '6px',
            height: '32px',
            width: '100%',
            maxWidth: '32px',
          }}
        />
        <Tooltip title={paymentData?.recepientAddress}>
          <TokenWrapper onClick={() => copyAddress(paymentData?.recepientAddress)}>
            {entityType === ENTITIES_TYPES.GRANT_APPLICATION ? (
              generateReadablePreviewForAddress(paymentData?.recepientAddress, 18)
            ) : (
              <>
                <ProfilePicture profilePicture={payee?.profilePicture} />

                {payee?.username}
              </>
            )}
          </TokenWrapper>
        </Tooltip>
      </Grid>
      <Grid display="flex" alignItems="center" gap="10px" width="100%">
        <Label>Chain: </Label>
        <Label style={{ color: '#FFFFFF' }}> {CHAIN_TO_CHAIN_DIPLAY_NAME[paymentData?.chain]} </Label>
      </Grid>

      {error ? <ErrorText> {error} </ErrorText> : null}
    </Wrapper>
  );
};

export default PaymentDetails;
