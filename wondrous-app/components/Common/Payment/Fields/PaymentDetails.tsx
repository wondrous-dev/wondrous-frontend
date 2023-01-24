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
import { TokenWrapper, Wrapper } from './styles';

const PaymentDetails = ({
  rewardAmount,
  onChange,
  tokenName,
  payee,
  error,
  setChangeRewardErrorText,
  entityReward,
}) => (
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
      <TokenWrapper>
        <ProfilePicture profilePicture={payee?.profilePicture} />

        {payee?.username}
      </TokenWrapper>
    </Grid>
    {error ? <ErrorText> {error} </ErrorText> : null}
  </Wrapper>
);

export default PaymentDetails;
