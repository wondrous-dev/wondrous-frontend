import { useMemo, useState } from 'react';
import Link from 'next/link';
import format from 'date-fns/format';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import Button from 'components/Button';
import CalendarIcon from 'components/Icons/calendar';
import CopyIcon from 'components/Icons/copy';
import Ethereum from 'components/Icons/ethereumV2';
import { LinkIcon } from 'components/Icons/taskModalIcons';

import { capitalize } from 'utils/common';
import { constructGnosisRedirectUrl } from 'components/Common/Payment/SingleWalletPayment';

import palette from 'theme/palette';
import typography from 'theme/typography';
import {
  PayeeAddressTag,
  PayeeAddressTagContainer,
  PayeeProfileLink,
  StyledCheckbox,
  StyledTableCell,
  StyledTableRow,
  RewardChainHalfBox,
  PayoutItemLinkContainer,
  PayoutTaskTitleContainer,
  RewardChainHalfBoxText,
  PayoutTaskCompletionDate,
  PayoutTaskCompletionDateText,
  PayeePayButton,
} from './styles';
import { PayeeDetails, PayoutTableItem } from './PayoutTable';
import { PAYMENT_TYPES } from './constants';

const imageStyle = {
  width: '32px',
  height: '32px',
  minWidth: '32px',
  minHeight: '32px',
  borderRadius: '16px',
  marginRight: '8px',
};

interface PayoutItemProps {
  item: PayoutTableItem;
  checked?: boolean;
  org?: {
    id: string;
    username: string;
  };
  podId?: string;
  selectedItemsLength?: number;
  canViewPaymentLink?: boolean;
  handlePay?: (payeeDetails: PayeeDetails) => void;
  handleCheck?: (item: PayoutTableItem) => void;
}

const PayoutItem = (props: PayoutItemProps) => {
  const { item, checked = false, org, podId, selectedItemsLength, canViewPaymentLink, handlePay, handleCheck } = props;
  const [hasAddressBeenCopied, setHasAddressBeenCopied] = useState(false);

  let link;

  if (item?.additionalData?.manualExplorerLink) {
    link = item?.additionalData?.manualExplorerLink;
  } else if (item?.additionalData?.utopiaLink) {
    link = item?.additionalData?.utopiaLink;
  } else if (item.chain && item.safeAddress && item.safeTxHash) {
    link = constructGnosisRedirectUrl(item.chain, item.safeAddress, item.safeTxHash);
  }

  const completionDate = item?.submissionApprovedAt || item?.payedAt;

  const isPayButtonDisabled =
    selectedItemsLength > 0 ||
    !item?.amount ||
    item.paymentStatus !== PAYMENT_TYPES.UNPAID ||
    !item?.payeeActiveEthAddress;

  const address = item?.payeeActiveEthAddress;
  const addressTag = useMemo(() => {
    if (!address) {
      return '';
    }
    return `${address.slice(0, 6)}...${address.slice(address.length - 4, address.length)}`;
  }, [address]);

  const handleAddressCopy = () => {
    navigator.clipboard.writeText(address);
    setHasAddressBeenCopied(true);

    setTimeout(() => {
      setHasAddressBeenCopied(false);
    }, 1500);
  };

  const handlePayeePayButton = () => {
    if (isPayButtonDisabled) return;

    handlePay({
      podId,
      orgId: org?.username,
      assigneeId: item?.payeeId,
      assigneeUsername: item?.payeeUsername,
      taskTitle: item?.taskTitle,
      submissionId: item?.submissionId,
    });
  };

  return (
    <StyledTableRow>
      <StyledTableCell>
        <Grid display="flex" alignItems="center" gap="12px">
          <Grid display="flex" alignItems="center" gap="8px">
            <StyledCheckbox
              checked={checked}
              onChange={() => handleCheck(item)}
              inputProps={{ 'aria-label': 'controlled' }}
            />

            {item.paymentStatus === PAYMENT_TYPES.UNPAID && (
              <Button
                buttonTheme={{
                  paddingX: 16,
                  paddingY: 7,
                  background: palette.background.default,
                  borderColor: isPayButtonDisabled
                    ? palette.grey85
                    : `linear-gradient(270deg, ${palette.green30} -5.62%, ${palette.highlightPurple} 103.12%), linear-gradient(0deg, ${palette.background.default}, ${palette.background.default})`,
                  fontWeight: 500,
                  hover: {
                    background: isPayButtonDisabled ? palette.background.default : 'transparent',
                  },
                }}
                minWidth="auto"
                disabled={isPayButtonDisabled}
                onClick={handlePayeePayButton}
              >
                Pay
              </Button>
            )}

            <Link href={`/profile/${item?.payeeUsername}/about`} passHref legacyBehavior>
              <PayeeProfileLink>
                <Grid display="flex" alignItems="center" gap="6px">
                  <SafeImage
                    useNextImage={false}
                    width={32}
                    height={32}
                    src={item?.payeeProfilePicture}
                    style={imageStyle}
                    placeholderComp={<DefaultUserImage style={imageStyle} />}
                  />
                  <Typography fontFamily={typography.fontFamily} fontSize="13px" fontWeight={700} color={palette.white}>
                    {item?.payeeUsername}
                  </Typography>
                </Grid>
              </PayeeProfileLink>
            </Link>
          </Grid>
          {!!addressTag && (
            <PayeeAddressTagContainer onClick={handleAddressCopy}>
              <PayeeAddressTag hasAddressBeenCopied={hasAddressBeenCopied}>
                {hasAddressBeenCopied ? 'Address copied!' : addressTag}
              </PayeeAddressTag>
              <CopyIcon color={hasAddressBeenCopied ? palette.green30 : palette.blue20} />
            </PayeeAddressTagContainer>
          )}
        </Grid>
      </StyledTableCell>

      <StyledTableCell>
        {item?.amount ? (
          <RewardChainHalfBox isRewardBox>
            <Ethereum />
            <RewardChainHalfBoxText>
              {item?.amount} {item?.symbol}
            </RewardChainHalfBoxText>
          </RewardChainHalfBox>
        ) : (
          <RewardChainHalfBox isRewardBox hasNoReward>
            <RewardChainHalfBoxText hasNoReward>reward</RewardChainHalfBoxText>
          </RewardChainHalfBox>
        )}
      </StyledTableCell>

      <StyledTableCell>
        {item?.amount ? (
          <RewardChainHalfBox>
            <RewardChainHalfBoxText>{capitalize(item?.chain)}</RewardChainHalfBoxText>
          </RewardChainHalfBox>
        ) : (
          <RewardChainHalfBox hasNoReward>
            <RewardChainHalfBoxText hasNoReward>removed</RewardChainHalfBoxText>
          </RewardChainHalfBox>
        )}
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
        <PayoutTaskTitleContainer>{item?.taskTitle}</PayoutTaskTitleContainer>
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

export default PayoutItem;
