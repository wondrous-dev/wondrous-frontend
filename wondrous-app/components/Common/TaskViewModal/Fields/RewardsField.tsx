import { Grid } from '@mui/material';
import {
  CreateEntityPaymentMethodItem,
  CreateEntityTextfieldInputRewardComponent,
  filterPaymentMethods,
  useGetPaymentMethods,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityError,
  CreateEntityLabelAddButton,
  CreateEntityPaymentMethodOption,
  CreateEntityPaymentMethodSelect,
  CreateEntityPaymentMethodSelected,
  CreateEntitySelectArrowIcon,
  CreateEntityTextfield,
  CreateEntityWrapper,
} from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import { isEmpty } from 'lodash';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import palette from 'theme/palette';
import debounce from 'lodash/debounce';
import { useOutsideAlerter } from 'utils/hooks';
import { ConnectToWallet, TaskSectionLabel } from '../helpers';
import {
  TaskSectionDisplayDiv,
  TaskSectionInfoPaymentAmount,
  TaskSectionInfoPaymentMethodChain,
  TaskSectionInfoPaymentMethodIcon,
  ViewFieldWrapper,
} from '../styles';
import { useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';
import { FIELDS } from './hooks/constants';

const CreateReward = ({ handleReward, orgId, paymentMethodId, rewardAmount, toggleEditMode, error }) => {
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(orgId, true));
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated
  const [input, setInput] = useState({
    paymentMethodId: paymentMethodId,
    rewardAmount: rewardAmount || '',
  });

  const debounceHandleReward = debounce(handleReward, 200);
  if (!activePaymentMethods?.length) {
    return null;
  }

  const onPaymentMethodChange = (value) => {
    const newInput = {
      ...input,
      paymentMethodId: value,
    };
    setInput(newInput);
    debounceHandleReward(newInput);
  };

  const onInputChange = (e) => {
    const { value } = e.target;
    const newInput = {
      rewardAmount: parseFloat(value),
      paymentMethodId: input.paymentMethodId || activePaymentMethods?.[0]?.id,
    };
    setInput(newInput);
    debounceHandleReward(newInput);
  };

  return (
    <Grid display="flex" direction="column" gap="4px">
      <CreateEntityWrapper>
        <CreateEntityPaymentMethodSelect
          name="rewards-payment-method"
          defaultValue={paymentMethodId || activePaymentMethods?.[0]?.id}
          onChange={onPaymentMethodChange}
          renderValue={(selectedItem) => {
            if (!selectedItem?.label?.props) return null;
            return (
              <CreateEntityPaymentMethodSelected>
                <CreateEntityPaymentMethodItem {...selectedItem.label.props} />
                <CreateEntitySelectArrowIcon />
              </CreateEntityPaymentMethodSelected>
            );
          }}
        >
          {activePaymentMethods.map(({ symbol, icon, id, chain }) => (
            <CreateEntityPaymentMethodOption key={id} value={id}>
              <CreateEntityPaymentMethodItem icon={icon} symbol={symbol} chain={chain} />
            </CreateEntityPaymentMethodOption>
          ))}
        </CreateEntityPaymentMethodSelect>
        <CreateEntityTextfield
          autoComplete="off"
          autoFocus
          name="rewards"
          onChange={onInputChange}
          placeholder="Enter rewards..."
          defaultValue={rewardAmount}
          fullWidth
          InputProps={{
            inputComponent: CreateEntityTextfieldInputRewardComponent,
            endAdornment: (
              <CreateEntityAutocompletePopperRenderInputAdornment
                position="end"
                onClick={() => {
                  handleReward(null);
                  toggleEditMode();
                }}
              >
                <CreateEntityAutocompletePopperRenderInputIcon />
              </CreateEntityAutocompletePopperRenderInputAdornment>
            ),
          }}
          onFocus={() => {}}
        />
      </CreateEntityWrapper>
      {error ? <CreateEntityError>{error}</CreateEntityError> : null}
    </Grid>
  );
};

const Rewards = ({ fetchedTask, user, canEdit, shouldDisplay }) => {
  const rewards = fetchedTask?.rewards;
  const ref = useRef();
  const { submit, error } = useSubmit({ field: FIELDS.REWARDS });

  const values = useMemo(
    () =>
      rewards.map((reward) => ({
        paymentMethodId: reward.paymentMethodId,
        rewardAmount: reward.rewardAmount,
      })),
    [rewards]
  );

  // const handleReward = async (value) => {
  //   console.log(value);
  // !value
  //   ? values.splice(idx, 1)
  //   : (values[idx] = {
  //       ...values[idx],
  //       ...value,
  //     });
  // console.log(values, ' values');
  // await submit(values);
  // };

  const handleReward = async (value) => {
    !value
      ? values.splice(0, 1)
      : (values[0] = {
          ...values[0],
          ...value,
        });
    await submit(values);
  };

  if (!shouldDisplay) return null;

  const { rewardAmount, symbol, icon, chain, paymentMethodId } = rewards[0] || {};

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Rewards</TaskSectionLabel>
        <TaskFieldEditableContent
          editableContent={({ toggleEditMode }) => (
            <CreateReward
              orgId={fetchedTask?.orgId}
              error={error}
              paymentMethodId={paymentMethodId}
              rewardAmount={rewardAmount}
              toggleEditMode={toggleEditMode}
              handleReward={handleReward}
            />
          )}
          canAddItem={canEdit && !rewards?.length}
          addContent={({ toggleAddMode }) => (
            <CreateReward
              orgId={fetchedTask?.orgId}
              error={error}
              paymentMethodId={null}
              rewardAmount={''}
              toggleEditMode={toggleAddMode}
              handleReward={handleReward}
            />
          )}
          ViewContent={({ toggleEditMode }) => (
            <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
              <Grid gap="6px" display="flex" justifyContent="center" alignItems="center">
                <TaskSectionInfoPaymentMethodIcon src={icon} />
                <TaskSectionInfoPaymentAmount>
                  {rewardAmount} {symbol}
                </TaskSectionInfoPaymentAmount>
                <TaskSectionInfoPaymentMethodChain> on {chain}</TaskSectionInfoPaymentMethodChain>
                {user ? <ConnectToWallet user={user} /> : null}
              </Grid>
              <EditIcon stroke={palette.grey58} className="edit-icon-field" />
            </ViewFieldWrapper>
          )}
        />
    </TaskSectionDisplayDiv>
  );
};

export default Rewards;
