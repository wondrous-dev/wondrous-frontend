import React, { useEffect, useRef, useState, useContext } from 'react';
import Modal from '@mui/material/Modal';
import { useLazyQuery } from '@apollo/client';
import { GET_PAYMENT_METHODS_FOR_ORG, GET_SUBMISSIONS_PAYMENT_INFO } from 'graphql/queries/payment';
import { parseUserPermissionContext } from 'utils/helpers';
import { PERMISSIONS, TASK_STATUS_DONE } from 'utils/constants';
import { format } from 'date-fns';
import { filterPaymentMethods } from 'components/CreateEntity/CreateEntityModal/Helpers/utils';
import { CreateFormRewardCurrency, CreateModalOverlay } from 'components/CreateEntity/styles';
import InputForm from 'components/Common/InputForm/inputForm';
import CloseModalIcon from 'components/Icons/closeModal';
import TaskStatus from 'components/Icons/TaskStatus';
import { calculatePoints, UserRowPictureStyles } from '.';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import { SafeImage } from '../../Common/Image';
import {
  ContributorRowText,
  ContributorTaskModalRow,
  PayoutPaymentModal,
  TaskCountText,
  TaskCountWrapper,
  PayContributorButton,
  ExplainerText,
  PayOptionButtonWrapper,
} from './styles';
import CSVModal from './CSVModal';
import {
  PaymentTitleDiv,
  PaymentTitleTextDiv,
  PaymentTitleText,
  PaymentDescriptionText,
} from '../../Common/Payment/styles';
import { ErrorText } from '../../Common';
import { exportPaymentCSV } from './exportPaymentCsv';
import { RetroactivePayoutModal } from './RetroactivePayoutModal';

function ContributorTaskRowElement(props) {
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
      const selectedPaymentMethod = paymentMethods.find(
        (paymentMethod) => paymentMethod.id === selectedPaymentMethodId
      );
      setUserToPaymentMethod({ [contributorTask?.assigneeId]: selectedPaymentMethod, ...userToPaymentMethod });
    }
  }, [selectedPaymentMethodId]);

  const handleRewardAmountChange = (value) => {
    setRewardAmount(value);
  };
  return (
    <ContributorTaskModalRow key={index}>
      <>
        {contributorTask?.assigneeProfilePicture ? (
          <SafeImage
            useNextImage={false}
            src={contributorTask?.assigneeProfilePicture}
            style={UserRowPictureStyles}
            alt="Assignee profile picture"
          />
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
        {!contributorTask?.assigneeWallet && (
          <div
            style={{
              height: '70px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ErrorText>No associated wallet</ErrorText>
          </div>
        )}
        {contributorTask?.assigneeWallet && (
          <>
            <CreateFormRewardCurrency
              labelText="Choose token"
              options={paymentMethods}
              labelStyle={{
                paddingTop: '0',
              }}
              name="reward-currency"
              setValue={setSelectedPaymentMethodId}
              value={selectedPaymentMethodId}
              hideLabel
              innerStyle={{
                marginTop: 12,
                background: '#171717',
              }}
              formSelectStyle={{
                marginRight: 12,
              }}
            />

            <InputForm
              type="number"
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
        )}
      </>
    </ContributorTaskModalRow>
  );
}

export function PayoutModal(props) {
  const { podId, orgId, open, handleClose, fromTime, toTime, contributorTaskData } = props;
  const [openBatchPayModal, setOpenBatchPayModal] = useState(false);
  const [fetchPaymentMethod, setFetchPaymentMethod] = useState(false);
  const [userToPaymentMethod, setUserToPaymentMethod] = useState({});
  const [userToRewardAmount, setUserToRewardAmount] = useState({});
  const [selectedChain, setSelectedChain] = useState(null); // only relevant when doing payment through wonder
  const [errorMessage, setErrorMessage] = useState(null);
  const [csvModal, setCSVModal] = useState(false);
  const paymentsData = {
    contributorTaskData,
    userToPaymentMethod,
    userToRewardAmount,
  };
  useEffect(() => {
    setErrorMessage(null);
  }, [userToPaymentMethod, userToRewardAmount]);
  const [getPaymentMethods, { data: paymentMethodData }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG, {
    onCompleted: () => {
      setFetchPaymentMethod(true);
    },
  });
  // const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
  //   fetchPolicy: 'cache-and-network',
  // });

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

  const handleExportCSVButton = () => {
    for (let i = 0; i < contributorTaskData.length; i++) {
      const contributor = contributorTaskData[i];
      if (!contributor?.assigneeId || !contributor?.assigneeWallet) {
        // if this you can't set reward for this user, skip
        continue;
      }
      if (!userToPaymentMethod[contributor?.assigneeId] || !userToRewardAmount[contributor?.assigneeId]) {
        // if reward not selected then show error message
        const confirmed = confirm('Reward amount is not set for all users, Continue?');
        if (!confirmed) {
          return;
        }
      }
    }

    // todo make sure each user had payment method
    setCSVModal(true);
  };

  const handleCreatePaymentButton = () => {
    let chain;
    for (let i = 0; i < contributorTaskData.length; i++) {
      const contributor = contributorTaskData[i];
      if (!contributor?.assigneeId || !contributor?.assigneeWallet) {
        // if this you can't set reward for this user, skip
        continue;
      }
      if (!userToPaymentMethod[contributor?.assigneeId] || !userToRewardAmount[contributor?.assigneeId]) {
        // if reward not selected then show error message
        setErrorMessage('Must enter reward amount for all users');
        return;
      }
      if (!chain) {
        chain = userToPaymentMethod[contributor?.assigneeId]?.chain;
      } else if (chain !== userToPaymentMethod[contributor?.assigneeId]?.chain) {
        setErrorMessage('If choosing on-chain payment, must pay through the same chain');
        return;
      }
    }
    setSelectedChain(chain);
    // todo make sure each user had payment method
    setOpenBatchPayModal(true);
  };
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
        <RetroactivePayoutModal
          orgId={orgId}
          podId={podId}
          chain={selectedChain}
          handleClose={() => setOpenBatchPayModal(false)}
          open={openBatchPayModal}
          paymentsData={paymentsData}
        />
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
        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
        <PayOptionButtonWrapper>
          {/* <PayContributorButton
              style={{
                marginLeft: 0,
              }}
              onClick={handleCreatePaymentButton}
            >
              Create Payments
            </PayContributorButton> */}
          <div>
            <PayContributorButton
              style={{
                marginLeft: 10,
              }}
              onClick={handleExportCSVButton}
            >
              Export CSV
            </PayContributorButton>
            <ExplainerText>Export the above form as a Utopia/Parcel compatible CSV</ExplainerText>
          </div>
        </PayOptionButtonWrapper>
      </PayoutPaymentModal>
    </Modal>
  );
}
