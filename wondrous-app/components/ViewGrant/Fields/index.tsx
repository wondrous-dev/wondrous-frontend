import { Grid, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { TaskSectionInfoCalendar, TaskSectionInfoPaymentMethodIcon } from 'components/Common/TaskViewModal/styles';
import { getInterestDisplay } from 'components/Common/UserInterestModal';
import format from 'date-fns/format';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { AmountWrapper, DataDisplayWrapper, GrantAmountWrapper } from './styles';

export const MultipleDataDisplay = ({ children }) => (
  <Grid container display="flex" gap="12px">
    {children}
  </Grid>
);

export const DataDisplay = ({ label }) => <DataDisplayWrapper>{label}</DataDisplayWrapper>;

export const Reviewers = ({ reviewers }) => (
  <MultipleDataDisplay>
    {reviewers?.map((reviewer) => (
      <Grid display="flex" gap="12px" justifyContent="center" alignItems="center">
        {reviewer?.profilePicture ? (
          <SafeImage
            src={reviewer.profilePicture}
            alt="Reviewer profile picture"
            width={24}
            height={24}
            style={{ borderRadius: '24px' }}
          />
        ) : (
          <DefaultUserImage width={24} height={24} />
        )}
        <Typography color={palette.white} fontFamily={typography.fontFamily} fontWeight={500} fontSize={13}>
          {reviewer?.username}
        </Typography>
      </Grid>
    ))}
  </MultipleDataDisplay>
);

export const GrantPaymentData = ({ paymentData: { icon, rewardAmount, symbol }, numOfGrant = null }) => (
  <GrantAmountWrapper hasNumOfGrants={!!numOfGrant}>
    <TaskSectionInfoPaymentMethodIcon src={icon} />

    <span>
      Up to {rewardAmount} {symbol}
    </span>
    {!!numOfGrant && (
      <AmountWrapper>
        <span>x{numOfGrant}</span>
      </AmountWrapper>
    )}
  </GrantAmountWrapper>
);

export const Dates = ({ startDate, endDate }) => (
  <MultipleDataDisplay>
    {[startDate, endDate].map((date, idx) => (
      <DataDisplay
        key={`${date}-${idx}`}
        label={
          <>
            <TaskSectionInfoCalendar />
            {date ? format(new Date(date), 'MM/dd/yyyy') : 'Not set'}
          </>
        }
      />
    ))}
  </MultipleDataDisplay>
);
