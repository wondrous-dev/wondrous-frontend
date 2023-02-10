import { useMemo, useState } from 'react';
import format from 'date-fns/format';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { Button as WonderButton } from 'components/Button';
import CalendarIcon from 'components/Icons/calendar';
import { CopyIcon } from 'components/Icons/copy';

import { capitalize } from 'utils/common';
import { useGetEnsOrAddress } from 'utils/hooks';

import palette from 'theme/palette';
import typography from 'theme/typography';
import { NoUnderlineLink } from 'components/Common/Link/links';
import {
  PayeeAddressTag,
  PayeeAddressTagContainer,
  PayeeProfileLink,
  StyledTableCell,
  StyledTableRow,
  PayoutTaskTitleContainer,
  PayoutTaskCompletionDate,
  PayoutTaskCompletionDateText,
} from 'components/Settings/Payouts/styles';
import { imageStyle } from 'components/GrantPaymentsLedger/styles';
import { RewardTextRightPill, RewardTextLefPill, RewardText } from 'components/Common/Payment/PaymentViewModal/styles';
import { GrantPaymentSelected } from 'components/Settings/Payouts/types';

interface UnpaidGrantApplication {
  grantTitle: string;
  grantId: string;
  grantApplicationId: string;
  grantApplicationTitle: string;
  payeeId: string;
  payeeUsername: string;
  payeeProfilePicture: string;
  paymentAddress: string;
  grantApplicationApprovedAt: string;
  paymentStatus: string;
  chain: string;
  amount: number;
  symbol: string;
  icon: string;
  tokenName: string;
  tokenAddress: string;
  decimal: number;
  safeAddress: string;
  txHash: string;
  safeTxHash: string;
}

interface PayoutItemProps {
  item: UnpaidGrantApplication;
  orgId?: string;
  podId?: string;
  canViewPaymentLink?: boolean;
  handlePay?: (paymentInfo: GrantPaymentSelected) => void;
  canPay: boolean;
}

const UnpaidApplicationRow = (props: PayoutItemProps) => {
  const { item, orgId, podId, handlePay, canPay } = props;
  const [hasAddressBeenCopied, setHasAddressBeenCopied] = useState(false);

  const { ENSNameOrWalletAddress } = useGetEnsOrAddress(item?.paymentAddress);

  const completionDate = item?.grantApplicationApprovedAt;

  const addressDisplay = useMemo(() => {
    if (!ENSNameOrWalletAddress) {
      return '';
    }
    return `${ENSNameOrWalletAddress.slice(0, 6)}...${ENSNameOrWalletAddress.slice(
      ENSNameOrWalletAddress.length - 4,
      ENSNameOrWalletAddress.length
    )}`;
  }, [ENSNameOrWalletAddress]);

  const handleAddressCopy = () => {
    navigator.clipboard.writeText(ENSNameOrWalletAddress);
    setHasAddressBeenCopied(true);

    setTimeout(() => {
      setHasAddressBeenCopied(false);
    }, 1500);
  };

  const handlePayeePayButton = () => {
    if (!canPay) return;

    handlePay({
      podId,
      orgId,
      paymentAddress: ENSNameOrWalletAddress,
      grantTitle: item.grantTitle,
      grantApplicationId: item.grantApplicationId,
      grantApplicationTitle: item.grantApplicationTitle,
      amount: item?.amount,
      symbol: item?.symbol,
    });
  };

  return (
    <StyledTableRow>
      <StyledTableCell>
        <Grid display="flex" alignItems="center" gap="12px">
          <Grid display="flex" alignItems="center" gap="8px">
            <WonderButton
              buttonTheme={{
                paddingX: 16,
                paddingY: 7,
                fontWeight: 500,
              }}
              minWidth="auto"
              color="purple"
              disabled={!canPay}
              onClick={handlePayeePayButton}
            >
              Pay
            </WonderButton>
          </Grid>
        </Grid>
      </StyledTableCell>
      <StyledTableCell>
        <NoUnderlineLink href={`/profile/${item?.payeeUsername}/about`} passHref>
          <PayeeProfileLink>
            <Grid display="flex" alignItems="center" gap="6px">
              <SafeImage
                useNextImage={false}
                width={32}
                height={32}
                src={item?.payeeProfilePicture}
                style={imageStyle}
                placeholderComp={<DefaultUserImage style={imageStyle} />}
                alt="Payee profile picture"
              />
              <Typography fontFamily={typography.fontFamily} fontSize="13px" fontWeight={700} color={palette.white}>
                {item?.payeeUsername}
              </Typography>
            </Grid>
          </PayeeProfileLink>
        </NoUnderlineLink>
      </StyledTableCell>

      <StyledTableCell>
        {!!addressDisplay && (
          <PayeeAddressTagContainer onClick={handleAddressCopy}>
            <PayeeAddressTag $hasAddressBeenCopied={hasAddressBeenCopied}>
              {hasAddressBeenCopied ? 'Address copied!' : addressDisplay}
            </PayeeAddressTag>
            <CopyIcon color={hasAddressBeenCopied ? palette.green30 : palette.blue20} />
          </PayeeAddressTagContainer>
        )}
      </StyledTableCell>

      <StyledTableCell>
        <PayoutTaskTitleContainer style={{ maxWidth: 250 }}>{item?.grantApplicationTitle}</PayoutTaskTitleContainer>
      </StyledTableCell>

      <StyledTableCell>
        <div style={{ display: 'flex' }}>
          <RewardTextLefPill>
            <RewardText>
              {item?.amount} {item?.symbol}{' '}
            </RewardText>
          </RewardTextLefPill>
          <RewardTextRightPill>
            <RewardText>{capitalize(item?.chain)}</RewardText>
          </RewardTextRightPill>
        </div>
      </StyledTableCell>

      <StyledTableCell>
        <PayoutTaskTitleContainer style={{ maxWidth: 250 }}>{item?.grantTitle}</PayoutTaskTitleContainer>
      </StyledTableCell>

      <StyledTableCell>
        {!!completionDate && (
          <PayoutTaskCompletionDate>
            <CalendarIcon />
            <PayoutTaskCompletionDateText>{format(new Date(completionDate), 'MM-dd-yy')}</PayoutTaskCompletionDateText>
          </PayoutTaskCompletionDate>
        )}
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default UnpaidApplicationRow;
