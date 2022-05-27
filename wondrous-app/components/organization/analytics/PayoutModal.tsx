import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { Typography } from '@mui/material';
import { Tab } from '@material-ui/core';
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
import CSVModal, { EXPORT_PAYMENT_CSV_TYPE } from './CSVModal';
import {
  ContributorRowText,
  ContributorTaskModalRow,
  PayoutPaymentModal,
  TaskCountText,
  TaskCountWrapper,
  PayContributorButton,
} from './styles';
import { SafeImage } from '../../Common/Image';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import { White, Grey800 } from '../../../theme/colors';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_WALLET, GET_POD_WALLET } from 'graphql/queries/wallet';
import { GET_PAYMENT_METHODS_FOR_ORG, GET_SUBMISSIONS_PAYMENT_INFO } from 'graphql/queries/payment';
import { parseUserPermissionContext } from 'utils/helpers';
import usePrevious, { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { PERMISSIONS, TASK_STATUS_DONE } from 'utils/constants';
import { useMe } from '../../Auth/withAuth';
import { useRouter } from 'next/router';
import { DAOIcon } from '../../Icons/dao';
import { OrganisationsCardNoLogo } from '../../profile/about/styles';
import { OfflinePayment } from '../../Common/Payment/OfflinePayment/OfflinePayment';
import { BatchWalletPayment } from '../../Common/Payment/BatchWalletPayment';
import Link from 'next/link';
import { GET_POD_BY_ID, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { cutString } from 'utils/helpers';
import { isEqual } from 'lodash';
import { format } from 'date-fns';
import { calculatePoints, UserRowPictureStyles } from '.';
import { filterPaymentMethods } from 'components/CreateEntity/createEntityModal';
import {
  CreateFormMainBlockTitle,
  CreateFormRewardCurrency,
  CreateRewardAmountDiv,
  CreateModalOverlay,
} from 'components/CreateEntity/styles';
import InputForm from 'components/Common/InputForm/inputForm';
import CloseModalIcon from 'components/Icons/closeModal';
import TaskStatus from 'components/Icons/TaskStatus';

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

interface PaymentData {
  // tokenAddress: string;
  // isEthTransfer: Boolean;
  // amount: string;
  // recepientAddress: string;
  // chain: string;
  // decimal: number;
}

export const exportPaymentCSV = ({ paymentsData, exportCSVType, fromTime, toTime, isPod = false }) => {
  let headers = [];
  if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.UTOPIA) {
    headers = ['Name', 'Wallet', 'Amount', 'Pay-out Token', 'Chain'];
  } else if (exportCSVType === EXPORT_PAYMENT_CSV_TYPE.PARCEL) {
    headers = ['Name(Optional)', 'Address/ENS', 'Amount', 'Token Address/Token Symbol', 'Chain'];
  }
  const rows = [[headers]];
  if (!paymentsData?.contributorTaskData) {
    return;
  }
  const { contributorTaskData, userToPaymentMethod, userToRewardAmount } = paymentsData;

  contributorTaskData.forEach((contributor) => {
    const assigneeId = contributor?.assigneeId
    const assigneeUsername = contributor?.assigneeUsername || '';
    const wallet = contributor?.assigneeWallet;
    const paymentMethod = userToPaymentMethod[assigneeId];
    const paymentAmount = userToRewardAmount[assigneeId] || 0;
    if (!assigneeId || !paymentMethod) {
      return
    }
    console.log(paymentMethod)
    console.log(paymentAmount)

    let tokenOrSymbol;
    if (paymentMethod.tokenAddress === '0x0000000000000000000000000000000000000000') {
      tokenOrSymbol = paymentMethod.symbol
    }
    let newRow = [
      assigneeUsername,
      wallet,
      paymentAmount,
      tokenOrSymbol,
    ];
    rows.push(newRow);

  });
  let csvContent = 'data:text/csv;charset=utf-8,';
  rows.forEach(function (rowArray) {
    let row = rowArray.join(',');
    csvContent += row + '\r\n';
  });
  var encodedUri = encodeURI(csvContent);
  var link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute(
    'download',
    `wonderverse_contributor_data_${format(new Date(fromTime), 'MM/dd/yyyy')}_to_${format(
      new Date(toTime),
      'MM/dd/yyyy'
    )}.csv`
  );
  document.body.appendChild(link); // Required for FF
  link.click();
};

const ContributorTaskRowElement = (props) => {
  const {
    index,
    contributorTask,
    paymentMethods,
    setUserToPaymentMethod,
    setUserToRewardAmount,
    userToPaymentMethod,
    userToRewardAmount,
  } = props;
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [rewardAmount, setRewardAmount] = useState(null);
  useEffect(() => {
    if (rewardAmount) {
      delete userToRewardAmount[contributorTask?.assigneeId];
      setUserToRewardAmount({ [contributorTask?.assigneeId]: rewardAmount, ...userToRewardAmount });
    }
  }, [rewardAmount]);

  useEffect(() => {
    if (selectedPaymentMethodId) {
      delete userToPaymentMethod[contributorTask?.assigneeId];
      const selectedPaymentMethod = paymentMethods.find((paymentMethod) => {
        return paymentMethod.id === selectedPaymentMethodId;
      });
      setUserToPaymentMethod({ [contributorTask?.assigneeId]: selectedPaymentMethod, ...userToPaymentMethod });
    }
  }, [selectedPaymentMethodId]);

  const handleRewardAmountChange = (value) => {
    setRewardAmount(value);
  };
  return (
    <ContributorTaskModalRow key={index}>
      <>
        {contributorTask?.profilePicture ? (
          <SafeImage src={contributorTask?.profilePicture} style={UserRowPictureStyles} />
        ) : (
          <DefaultUserImage style={UserRowPictureStyles} />
        )}
        <ContributorRowText>{contributorTask?.assigneeUsername}</ContributorRowText>
        <TaskCountWrapper
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TaskStatus
            style={{
              width: '24px',
              height: '24px',
              marginRight: '4px',
            }}
            status={TASK_STATUS_DONE}
          />
          <TaskCountText>
            {contributorTask?.tasks?.length}
            <span
              style={{
                color: 'rgba(108, 108, 108, 1)',
                marginLeft: '4px',
              }}
            >
              {contributorTask?.tasks?.length === 1 ? 'task' : 'tasks'}
            </span>
          </TaskCountText>
        </TaskCountWrapper>
        <TaskCountWrapper
          style={{
            background: 'none',
            marginLeft: '12px',
          }}
        >
          <TaskCountText>
            {calculatePoints(contributorTask?.tasks)}
            <span
              style={{
                color: 'rgba(108, 108, 108, 1)',
                marginLeft: '4px',
              }}
            >
              {calculatePoints(contributorTask?.tasks) ? 'point' : 'points'}
            </span>
          </TaskCountText>
        </TaskCountWrapper>
        <div
          style={{
            flex: 1,
          }}
        />
        <CreateFormRewardCurrency
          labelText="Choose token"
          options={paymentMethods}
          labelStyle={{
            paddingTop: '0',
            marginTop: '-4px',
          }}
          name="reward-currency"
          setValue={setSelectedPaymentMethodId}
          value={selectedPaymentMethodId}
          hideLabel={true}
          innerStyle={{
            marginTop: '15px',
            background: '#171717',
          }}
          formSelectStyle={{
            marginRight: '12px',
          }}
        />

        <InputForm
          type={'number'}
          style={{
            width: 'auto',
            background: '#171717',
          }}
          min="0"
          placeholder="Enter reward amount"
          search={false}
          value={rewardAmount}
          onChange={(e) => handleRewardAmountChange(e.target.value)}
          endAdornment={
            <CloseModalIcon
              style={{
                marginRight: '8px',
                cursor: 'pointer',
              }}
              onClick={() => {
                setSelectedPaymentMethodId('');
                setRewardAmount(0);
              }}
            />
          }
        />
      </>
    </ContributorTaskModalRow>
  );
};
export const PayoutModal = (props) => {
  const { podId, orgId, open, handleClose, chain, fromTime, toTime, contributorTaskData } = props;
  const [wallets, setWallets] = useState([]);
  const [fetchPaymentMethod, setFetchPaymentMethod] = useState(false);
  const [userToPaymentMethod, setUserToPaymentMethod] = useState({});
  const [userToRewardAmount, setUserToRewardAmount] = useState({});
  const [csvModal, setCSVModal] = useState(false);
  const paymentsData = {
    contributorTaskData,
    userToPaymentMethod,
    userToRewardAmount,
  };
  const [getPaymentMethods, { data: paymentMethodData }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG, {
    onCompleted: () => {
      setFetchPaymentMethod(true);
    },
  });
  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
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
                podId: podId,
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
          console.error('failed to fetch wallet: ' + err?.message);
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

  useEffect(() => {
    if (open) {
      if (!fetchPaymentMethod) {
        getPaymentMethods({
          variables: {
            orgId,
          },
        });
        setFetchPaymentMethod(true);
      }
    }
  }, [open]);
  const paymentMethods = filterPaymentMethods(paymentMethodData?.getPaymentMethodsForOrg);
  return (
    <Modal open={open} onClose={handleClose}>
      <PayoutPaymentModal>
        <CreateModalOverlay
          open={csvModal}
          onClose={() => setCSVModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <CSVModal
            open={csvModal}
            handleClose={() => setCSVModal(false)}
            fromTime={fromTime}
            toTime={toTime}
            exportPaymentCSV={exportPaymentCSV}
            paymentsData={paymentsData}
            isPod={false}
          />
        </CreateModalOverlay>

        <PaymentTitleDiv>
          <PaymentTitleTextDiv>
            <PaymentTitleText>Pay Contributors</PaymentTitleText>
            <PaymentDescriptionText>
              Customize payouts from {format(fromTime, 'yyyy-MM-dd')} to {format(toTime, 'yyyy-MM-dd')}{' '}
            </PaymentDescriptionText>
          </PaymentTitleTextDiv>
        </PaymentTitleDiv>
        {contributorTaskData?.map((contributorTask, index) => {
          if (contributorTask?.assigneeId) {
            return (
              <ContributorTaskRowElement
                index={index}
                userToPaymentMethod={userToPaymentMethod}
                userToRewardAmount={userToRewardAmount}
                setUserToPaymentMethod={setUserToPaymentMethod}
                setUserToRewardAmount={setUserToRewardAmount}
                contributorTask={contributorTask}
                paymentMethods={paymentMethods}
              />
            );
          }
        })}
        <PaymentMethodWrapper>
          <div
            style={{
              marginTop: '16px',
            }}
          >
            <PayContributorButton
              style={{
                marginLeft: 0,
              }}
            >
              Create Payments
            </PayContributorButton>
            <PayContributorButton
              style={{
                marginLeft: 0,
              }}
              onClick={() => setCSVModal(true)}
            >
              Export CSV
            </PayContributorButton>
          </div>
        </PaymentMethodWrapper>
      </PayoutPaymentModal>
    </Modal>
  );
};
