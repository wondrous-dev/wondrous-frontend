import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from 'graphql/queries/wallet';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { GET_POD_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { cutString } from 'utils/helpers';
import {
  PodNameTypography,
  PaymentModal,
  PaymentModalHeader,
  PaymentTitleDiv,
  PaymentTitleTextDiv,
  PaymentTitleText,
  PaymentDescriptionText,
  StyledTabs,
  PaymentMethodWrapper,
  WarningTypography,
} from '../../Common/Payment/styles';
import { CompensationAmount, CompensationPill, IconContainer } from '../../Common/Compensation/styles';
import {
  StyledTable,
  StyledTableBody,
  StyledTableCell,
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from '../../Table/styles';
import { SafeImage } from '../../Common/Image';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import { TableCellText } from './styles';
import { BatchRetroactivePayment } from './BatchRetroactivePayment';

enum ViewType {
  Paid = 'paid',
  Unpaid = 'unpaid',
}

const imageStyle = {
  width: '32px',
  height: '32px',
  borderRadius: '16px',
  marginRight: '8px',
};

export function RetroactivePayoutModal(props) {
  const { podId, orgId, open, handleClose, paymentsData, chain } = props;
  const router = useRouter();
  const [wallets, setWallets] = useState([]);

  const { contributorTaskData, userToPaymentMethod, userToRewardAmount } = paymentsData;
  const contributorData = contributorTaskData?.filter(
    (contributor) => !!contributor?.assigneeId && contributor?.assigneeWallet
  );
  const [getOrgWallet, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_WALLET, {
    onCompleted: (data) => {
      setWallets(data?.getOrgWallet);
    },
    fetchPolicy: 'network-only',
  });
  const [getPodWallet] = useLazyQuery(GET_POD_WALLET, {
    fetchPolicy: 'network-only',
  });

  const [getPodById] = useLazyQuery(GET_POD_BY_ID);
  const getWallets = useCallback(
    async (podId, orgId) => {
      if (podId) {
        try {
          const result = await getPodWallet({
            variables: {
              podId,
            },
          });
          const wallets = result?.data?.getPodWallet;
          if (!wallets || wallets?.length === 0) {
            const podResult = await getPodById({
              variables: {
                podId,
              },
            });
            const pod = podResult?.data?.getPodById;
            getOrgWallet({
              variables: {
                orgId: pod?.orgId,
              },
            });
          } else {
            setWallets(wallets);
          }
        } catch (err) {
          console.error(`failed to fetch wallet: ${err?.message}`);
        }
      } else if (orgId) {
        getOrgWallet({
          variables: {
            orgId,
          },
        });
      }
    },
    [podId, orgId]
  );
  useEffect(() => {
    getWallets(podId, orgId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podId, orgId]);

  return (
    <Modal open={open} onClose={handleClose}>
      <PaymentModal>
        <PaymentTitleDiv>
          <PaymentTitleTextDiv>
            <PaymentTitleText>Batch pay</PaymentTitleText>
            <PaymentDescriptionText>Pay the following contributors</PaymentDescriptionText>
          </PaymentTitleTextDiv>
        </PaymentTitleDiv>
        <StyledTableContainer
          style={{
            width: '100%',
          }}
        >
          <StyledTable>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableCell align="center" width="33%">
                  Receipient
                </StyledTableCell>
                <StyledTableCell align="center" width="33%">
                  Address
                </StyledTableCell>
                <StyledTableCell align="center" width="33%">
                  Payout
                </StyledTableCell>
              </StyledTableRow>
            </StyledTableHead>
            <StyledTableBody>
              {contributorData &&
                Object.keys(contributorData).map((key, index) => {
                  const contributor = contributorData[key];
                  const assigneeId = contributor?.assigneeId;
                  const paymentMethod = userToPaymentMethod[assigneeId];
                  const paymentAmount = userToRewardAmount[assigneeId] || 0;

                  return (
                    <StyledTableRow
                      style={{
                        width: '150%',
                      }}
                      key={contributor?.assigneeId}
                    >
                      <StyledTableCell>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '8px',
                          }}
                        >
                          {contributor?.assigneeProfilePicture ? (
                            <SafeImage
                              useNextImage={false}
                              src={contributor?.assigneeProfilePicture}
                              style={imageStyle}
                              alt="Assignee profile picture"
                            />
                          ) : (
                            <DefaultUserImage style={imageStyle} />
                          )}
                          <TableCellText>{contributor?.assigneeUsername}</TableCellText>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginLeft: '8px',
                          }}
                        >
                          <TableCellText>{contributor?.assigneeWallet?.substring(0, 10)}...</TableCellText>
                        </div>
                      </StyledTableCell>
                      <StyledTableCell
                        style={{
                          minWidth: '120px',
                        }}
                      >
                        <CompensationPill
                          style={{
                            backGround: 'none',
                          }}
                        >
                          <IconContainer>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <SafeImage
                              useNextImage={false}
                              src={contributor?.icon}
                              style={{
                                width: '24px',
                                height: '24px',
                              }}
                              alt="Contributor icon"
                            />
                          </IconContainer>
                          <CompensationAmount>
                            {paymentAmount} {paymentMethod?.symbol}
                          </CompensationAmount>
                        </CompensationPill>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>

        <PaymentMethodWrapper>
          <BatchRetroactivePayment
            orgId={orgId}
            podId={podId}
            payoutData={paymentsData}
            wallets={wallets}
            chain={chain}
          />
        </PaymentMethodWrapper>
      </PaymentModal>
    </Modal>
  );
}
