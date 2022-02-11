import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import { PayoutSettingsHeaderIcon } from '../../Icons/PayoutSettingsHeaderIcon';
import { GeneralSettingsContainer } from '../styles';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from '../../Table/styles';
import { delQuery } from '../../../utils';
import { ToggleViewButton } from '../../Common/ToggleViewButton';
import { useLazyQuery } from '@apollo/client';
import {
  GET_PAYMENTS_FOR_ORG,
  GET_PAYMENTS_FOR_POD,
  GET_UNPAID_SUBMISSIONS_FOR_ORG,
  GET_UNPAID_SUBMISSIONS_FOR_POD,
} from '../../../graphql/queries/payment';
import { SafeImage } from '../../Common/Image';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import { TableCellText } from './styles';
import { CompensationAmount, CompensationPill, IconContainer } from '../../Common/Compensation/styles';
import { GET_ORG_BY_ID } from '../../../graphql/queries';
import Link from 'next/link';
import { cutString } from '../../../utils/helpers';
import { constructGnosisRedirectUrl } from '../../Common/Payment/SingleWalletPayment';
import { White } from '../../../theme/colors';
import { CreateFormPreviewButton } from '../../CreateEntity/styles';
import { PayModal } from './modal';
import { PaymentModalContext } from '../../../utils/contexts';
enum ViewType {
  Paid = 'paid',
  Unpaid = 'unpaid',
}

const PaymentItem = (props) => {
  const { item, org, podId } = props;
  const [openModal, setOpenModal] = useState(false);
  const imageStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    marginRight: '8px',
  };
  const taskHref = org
    ? `/organization/${org?.username}/boards?task=${item.taskId}`
    : `/pod/${podId}/boards?task=${item.taskId}`;
  let link,
    linkText = null;
  if (item?.additionalData?.manualExplorerLink) {
    link = item?.additionalData?.manualExplorerLink;
    linkText = item?.additionalData?.manualExplorerLink;
  } else if (item?.additionalData?.utopiaLink) {
    link = item?.additionalData?.utopiaLink;
    linkText = item?.additionalData?.utopiaLink;
  } else if ((item.chain, item.safeAddress, item.safeTxHash)) {
    link = constructGnosisRedirectUrl(item.chain, item.safeAddress, item.safeTxHash);
    linkText = item.safeTxHash;
  }
  console.log('item', item);
  return (
    <>
      <PaymentModalContext.Provider
        value={{
          onPaymentComplete: () => {},
        }}
      >
        <PayModal
          podId={podId}
          orgId={org?.id}
          open={openModal}
          handleClose={() => setOpenModal(false)}
          assigneeId={item.payeeId}
          assigneeUsername={item.payeeUsername}
          taskTitle={item.taskTitle}
          submissionId={item.submissionId}
        />
      </PaymentModalContext.Provider>
      <StyledTableRow
        style={{
          width: '150%',
        }}
      >
        <StyledTableCell>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '8px',
            }}
          >
            {item?.payeeProfilePicture ? (
              <SafeImage src={item?.payeeProfilePicture} style={imageStyle} />
            ) : (
              <DefaultUserImage style={imageStyle} />
            )}
            <TableCellText>{item?.payeeUsername}</TableCellText>
          </div>
        </StyledTableCell>
        <StyledTableCell
          style={{
            minWidth: '120px',
          }}
        >
          <CompensationPill>
            <IconContainer>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <SafeImage
                src={item?.icon}
                style={{
                  width: '24px',
                  height: '24px',
                }}
              />
            </IconContainer>
            <CompensationAmount>
              {item?.amount} {item?.symbol}
            </CompensationAmount>
          </CompensationPill>
        </StyledTableCell>
        <StyledTableCell>
          <Link href={taskHref}>
            <a
              target="_blank"
              style={{
                color: White,
              }}
            >
              {cutString(item?.taskTitle, 30)}
            </a>
          </Link>
        </StyledTableCell>
        <StyledTableCell>
          <a
            style={{
              color: White,
            }}
            target={'_blank'}
            href={link}
          >
            {cutString(linkText, 8)}
          </a>
        </StyledTableCell>
        {item.paymentStatus !== 'paid' && (
          <StyledTableCell>
            <TableCellText>{item.paymentStatus}</TableCellText>
          </StyledTableCell>
        )}
        <StyledTableCell>
          <TableCellText>{format(new Date(item.submissionApprovedAt || item.payedAt), 'MM/dd/yyyy')}</TableCellText>
        </StyledTableCell>
        {item.paymentStatus !== 'paid' && (
          <>
            <StyledTableCell>
              {item.paymentStatus !== 'processing' && (
                <CreateFormPreviewButton
                  style={{
                    marginLeft: '0',
                  }}
                  onClick={() => setOpenModal(true)}
                >
                  {' '}
                  Pay{' '}
                </CreateFormPreviewButton>
              )}
            </StyledTableCell>
          </>
        )}
      </StyledTableRow>
    </>
  );
};

const Payouts = (props) => {
  const { orgId, podId } = props;
  const [view, setView] = useState(ViewType.Unpaid);
  const router = useRouter();
  const { view: payView } = router.query;
  const listViewOptions = [
    {
      name: 'Unpaid',
      active: view === ViewType.Unpaid || view === null,
      action: () => {
        router.replace(`${delQuery(router.asPath)}?view=${ViewType.Unpaid}`);
      },
    },
    {
      name: 'Paid',
      active: view === ViewType.Paid,
      action: () => {
        router.replace(`${delQuery(router.asPath)}?view=${ViewType.Paid}`);
      },
    },
  ];

  const [getPaymentsForOrg] = useLazyQuery(GET_PAYMENTS_FOR_ORG, { fetchPolicy: 'cache-and-network' });
  const [getPaymentsForPod] = useLazyQuery(GET_PAYMENTS_FOR_POD, { fetchPolicy: 'cache-and-network' });
  const [getUnpaidSubmissionsForOrg] = useLazyQuery(GET_UNPAID_SUBMISSIONS_FOR_ORG, {
    fetchPolicy: 'cache-and-network',
  });
  const [getUnpaidSubmissionsForPod] = useLazyQuery(GET_UNPAID_SUBMISSIONS_FOR_POD, {
    fetchPolicy: 'cache-and-network',
  });
  const [paidList, setPaidList] = useState([]);
  const [unpaidList, setUnpaidList] = useState([]);
  const [getOrgById, { data: orgData }] = useLazyQuery(GET_ORG_BY_ID);
  useEffect(() => {
    if (orgId) {
      getOrgById({
        variables: {
          orgId,
        },
      });
    }
    if (orgId && view === ViewType.Unpaid) {
      getUnpaidSubmissionsForOrg({
        variables: {
          orgId,
        },
      }).then((result) => {
        const submissions = result?.data?.getUnpaidSubmissionsForOrg;
        setUnpaidList(submissions || []);
      });
    } else if (podId && view === ViewType.Unpaid) {
      getUnpaidSubmissionsForPod({
        variables: {
          podId,
        },
      }).then((result) => {
        const submissions = result?.data?.getUnpaidSubmissionsForPod;
        setUnpaidList(submissions || []);
      });
    } else if (orgId && view === ViewType.Paid) {
      getPaymentsForOrg({
        variables: {
          input: {
            orgId,
          },
        },
      }).then((result) => {
        const payments = result?.data?.getPaymentsForOrg;
        setPaidList(payments || []);
      });
    } else if (podId && view === ViewType.Paid) {
      getPaymentsForPod({
        variables: {
          input: {
            podId,
          },
        },
      }).then((result) => {
        const payments = result?.data?.getPaymentsForPod;
        setPaidList(payments || []);
      });
    }
    if (payView) {
      if (payView === ViewType.Paid) {
        setView(ViewType.Paid);
      } else if (payView === ViewType.Unpaid) {
        setView(ViewType.Unpaid);
      }
    }
  }, [orgId, podId, view, payView]);
  const org = orgData?.getOrgById;

  const paid = view === ViewType.Paid;
  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock icon={<PayoutSettingsHeaderIcon />} title="Payment Ledger" description="Manage all payouts" />
      </GeneralSettingsContainer>
      <ToggleViewButton
        options={listViewOptions}
        style={{
          marginTop: '32px',
          marginBottom: '-16px',
        }}
      />
      <StyledTableContainer
        style={{
          marginLeft: '-3%',
          width: '108%',
        }}
      >
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              <StyledTableCell align="center" width={paid ? '20%' : '16%'}>
                Assignee
              </StyledTableCell>
              <StyledTableCell align="center" width={paid ? '20%' : '16%'}>
                Payout
              </StyledTableCell>
              <StyledTableCell align="center" width="20%">
                Deliverable
              </StyledTableCell>
              <StyledTableCell align="center" width={paid ? '20%' : '16%'}>
                Link
              </StyledTableCell>
              {view === ViewType.Unpaid && <StyledTableCell width="10%">Status</StyledTableCell>}
              <StyledTableCell align="center" width="20%">
                {view === ViewType.Paid ? 'Paid at' : 'Approved at'}
              </StyledTableCell>
            </StyledTableRow>
          </StyledTableHead>
          <StyledTableBody>
            {view === ViewType.Paid ? (
              <>
                {paidList?.map((item) => (
                  <PaymentItem
                    item={{
                      ...item,
                      paymentStatus: 'paid',
                    }}
                    org={org}
                    podId={podId}
                  />
                ))}
              </>
            ) : (
              <>
                {unpaidList?.map((item) => (
                  <PaymentItem item={item} org={org} podId={podId} />
                ))}
              </>
            )}
          </StyledTableBody>
        </StyledTable>
      </StyledTableContainer>
    </SettingsWrapper>
  );
};

export default Payouts;
