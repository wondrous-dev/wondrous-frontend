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
import { useState, useRef, useEffect, useCallback } from 'react';
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
import { FIELDS, useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';

const CreateReward = ({ handleReward, orgId, paymentMethodId, rewardAmount, toggleEditMode }) => {
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(orgId, true));
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated

  const debounceHandleReward = debounce(handleReward, 200);
  if (!activePaymentMethods?.length) {
    return null;
  }

  const onPaymentMethodChange = (value) => {
    debounceHandleReward({
      paymentMethodId: value,
    });
  };

  const onInputChange = (e) => {
    const { value } = e.target;
    const inputObj: { rewardAmount: string; paymentMethodId?: string } = {
      rewardAmount: value,
    };
    if (!paymentMethodId) {
      inputObj.paymentMethodId = activePaymentMethods?.[0]?.id;
    }
    debounceHandleReward(inputObj);
  };

  return (
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
  );
};

const RewardField = ({ rewardAmount, symbol, icon, chain, user, handleReward, orgId, paymentMethodId, canEdit }) => {
  return (
    <TaskFieldEditableContent
      editableContent={({ toggleEditMode }) => (
        <CreateReward
          orgId={orgId}
          paymentMethodId={paymentMethodId}
          rewardAmount={rewardAmount}
          toggleEditMode={toggleEditMode}
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
  );
};

const Rewards = ({ fetchedTask, user, canEdit, shouldDisplay }) => {
  const rewards = fetchedTask?.rewards;
  const [showAdd, setShowAdd] = useState(false);
  const ref = useRef();
  const { submit, error } = useSubmit({ field: FIELDS.REWARDS });
  
  const values = rewards.map((reward) => ({
    paymentMethodId: reward.paymentMethodId,
    rewardAmount: reward.rewardAmount,
  }));
  
  const handleReward = (idx) => async (value) => {
    !value
    ? values.splice(idx, 1)
    : (values[idx] = {
      ...values[idx],
      ...value,
    });
    console.log(values);
    
    await submit(values);
  };
  
  useOutsideAlerter(ref, () => setShowAdd(false));
  
  if(!shouldDisplay) return null;
  
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Rewards</TaskSectionLabel>
      {rewards.map((reward, index) => {
        const { rewardAmount, symbol, icon, chain, paymentMethodId } = reward;
        return (
          <RewardField
            rewardAmount={rewardAmount}
            symbol={symbol}
            icon={icon}
            key={paymentMethodId + rewardAmount}
            chain={chain}
            user={user}
            paymentMethodId={paymentMethodId}
            orgId={fetchedTask?.orgId}
            canEdit={canEdit}
            handleReward={handleReward(index)}
          />
        );
      })}
      {!rewards?.length && !showAdd && canEdit ? (
        <CreateEntityLabelAddButton onClick={() => setShowAdd(true)} data-cy="button-add-assignee">
          <CreateEntityAddButtonIcon />
          <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
        </CreateEntityLabelAddButton>
      ) : null}
      {showAdd ? (
        <CreateReward
          orgId={fetchedTask?.orgId}
          paymentMethodId={null}
          rewardAmount=""
          handleReward={handleReward(rewards.length)}
          toggleEditMode={() => setShowAdd(false)}
        />
      ) : null}
    </TaskSectionDisplayDiv>
  );
};

export default Rewards;
