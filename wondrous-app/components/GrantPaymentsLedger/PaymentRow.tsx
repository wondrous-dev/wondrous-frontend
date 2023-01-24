import { useMemo, useState } from 'react';
import Link from 'next/link';
import format from 'date-fns/format';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MoreIcon from 'components/Icons/more';

import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import Button from 'components/Button';
import CalendarIcon from 'components/Icons/calendar';
import CopyIcon from 'components/Icons/copy';
import Ethereum from 'components/Icons/ethereumV2';
import { LinkIcon } from 'components/Icons/taskModalIcons';

import { capitalize } from 'utils/common';
import { useGetEnsOrAddress } from 'utils/hooks';
import { constructGnosisRedirectUrl } from 'components/Common/Payment/SingleWalletPayment';

import palette from 'theme/palette';
import typography from 'theme/typography';
import { NoUnderlineLink } from 'components/Common/Link/links';
import {
  PayeeAddressTag,
  PayeeAddressTagContainer,
  PayeeProfileLink,
  StyledTableCell,
  StyledTableRow,
  RewardChainHalfBox,
  PayoutItemLinkContainer,
  PayoutTaskTitleContainer,
  RewardChainHalfBoxText,
  PayoutTaskCompletionDate,
  PayoutTaskCompletionDateText,
  MoreActionDiv,
} from 'components/Settings/Payouts/styles';
import { PAYMENT_STATUS } from 'utils/constants';
import { imageStyle } from 'components/GrantPaymentsLedger/styles';
import { RewardTextRightPill, RewardTextLefPill, RewardText } from 'components/Common/Payment/PaymentViewModal/styles';

interface PaymentItem {
  id: string;
  grantTitle: string;
  grantId: string;
  grantApplicationId: string;
  grantApplicationTitle: string;
  payeeId: string;
  payeeUsername: string;
  payeeProfilePicture: string;
  paymentAddress: string;
  chain: string;
  safeAddress: string;
  txHash: string;
  safeTxHash: string;
  payedAt: string;
  status: string;
  notes: string;
  amount: number;
  symbol: string;
  icon: string;
  tokenName: string;
  additionalData?: {
    manualExplorerLink?: string;
    utopiaLink?: string;
  };
}

interface PayoutItemProps {
  item: PaymentItem;
  canViewPaymentLink?: boolean;
  setPaymentDetailId?: (paymentId: string) => void;
}

const PaymentRow = (props: PayoutItemProps) => {
  const { item, canViewPaymentLink, setPaymentDetailId } = props;
  const [hasAddressBeenCopied, setHasAddressBeenCopied] = useState(false);

  let link;

  if (item?.additionalData?.manualExplorerLink) {
    link = item?.additionalData?.manualExplorerLink;
  } else if (item?.additionalData?.utopiaLink) {
    link = item?.additionalData?.utopiaLink;
  } else if (item.chain && item.safeAddress && item.safeTxHash) {
    link = constructGnosisRedirectUrl(item.chain, item.safeAddress, item.safeTxHash);
  }

  const completionDate = item?.payedAt;
  const { ENSNameOrWalletAddress } = useGetEnsOrAddress(item?.paymentAddress);

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

  return (
    <StyledTableRow>
      <StyledTableCell>
        <Grid display="flex" alignItems="center" gap="12px">
          <Grid display="flex" alignItems="center" gap="8px">
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
          </Grid>
          {!!addressDisplay && (
            <PayeeAddressTagContainer onClick={handleAddressCopy}>
              <PayeeAddressTag hasAddressBeenCopied={hasAddressBeenCopied}>
                {hasAddressBeenCopied ? 'Address copied!' : addressDisplay}
              </PayeeAddressTag>
              <CopyIcon color={hasAddressBeenCopied ? palette.green30 : palette.blue20} />
            </PayeeAddressTagContainer>
          )}
        </Grid>
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

      {canViewPaymentLink && (
        <StyledTableCell>
          {!!link && (
            <PayoutItemLinkContainer href={link} target="_blank" rel="noreferrer noopener">
              <LinkIcon />
            </PayoutItemLinkContainer>
          )}
        </StyledTableCell>
      )}

      <StyledTableCell>
        <PayoutTaskTitleContainer>{item?.grantTitle}</PayoutTaskTitleContainer>
      </StyledTableCell>

      <StyledTableCell>
        <PayoutTaskTitleContainer>{item?.grantApplicationTitle}</PayoutTaskTitleContainer>
      </StyledTableCell>

      <StyledTableCell>
        {!!completionDate && (
          <PayoutTaskCompletionDate>
            <CalendarIcon />
            <PayoutTaskCompletionDateText>{format(new Date(completionDate), 'MM-dd-yy')}</PayoutTaskCompletionDateText>
          </PayoutTaskCompletionDate>
        )}
      </StyledTableCell>
      <StyledTableCell>
        <MoreActionDiv onClick={() => setPaymentDetailId(item.id)}>
          <MoreIcon />
        </MoreActionDiv>
      </StyledTableCell>
    </StyledTableRow>
  );
};

export default PaymentRow;
