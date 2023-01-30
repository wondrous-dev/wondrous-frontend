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
import { useState, useRef } from 'react';
import palette from 'theme/palette';
import { useOutsideAlerter } from 'utils/hooks';
import { ConnectToWallet, TaskSectionLabel } from '../helpers';
import {
  TaskSectionDisplayDiv,
  TaskSectionInfoPaymentAmount,
  TaskSectionInfoPaymentMethodChain,
  TaskSectionInfoPaymentMethodIcon,
  ViewFieldWrapper,
} from '../styles';
import { TaskFieldEditableContent } from './Shared';

const CreateReward = ({ orgId, paymentMethodId, rewardAmount, toggleEditMode }) => {
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(orgId, true));
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated
  // [{ rewardAmount: '', paymentMethodId: activePaymentMethods?.[0]?.id }]
  return (
    <CreateEntityWrapper>
      <CreateEntityPaymentMethodSelect
        name="rewards-payment-method"
        value={paymentMethodId || activePaymentMethods?.[0]?.id}
        onChange={(value) => {
          console.log(value);
        }}
        renderValue={(selectedItem) => {
          console.log('selected item args', selectedItem);
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
        autoFocus={rewardAmount}
        name="rewards"
        onChange={(value) => console.log('on change here', value)}
        placeholder="Enter rewards..."
        value={rewardAmount}
        fullWidth
        InputProps={{
          inputComponent: CreateEntityTextfieldInputRewardComponent,
          endAdornment: (
            <CreateEntityAutocompletePopperRenderInputAdornment
              position="end"
              onClick={() => {
                toggleEditMode();
                console.log('on empty');
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

const RewardField = ({ rewardAmount, symbol, icon, chain, user, hasContent, orgId, paymentMethodId, canEdit }) => (
  <TaskFieldEditableContent
    EditableContent={({ toggleEditMode }) => (
      <CreateReward
        orgId={orgId}
        paymentMethodId={paymentMethodId}
        rewardAmount={rewardAmount}
        toggleEditMode={toggleEditMode}
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

const Rewards = ({ fetchedTask, user, canEdit }) => {
  const rewards = fetchedTask?.rewards;
  const [showAdd, setShowAdd] = useState(false);
  const ref = useRef();
  const valuesRef = useRef();

  const handleReward = () => {};

  useOutsideAlerter(ref, () => setShowAdd(false));

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Rewards</TaskSectionLabel>
      {rewards.map((reward, index) => {
        const { rewardAmount, symbol, icon, chain, paymentMethodId } = reward;
        return (
          <RewardField
            hasContent={!!reward}
            rewardAmount={rewardAmount}
            symbol={symbol}
            icon={icon}
            key={paymentMethodId + rewardAmount}
            chain={chain}
            user={user}
            paymentMethodId={paymentMethodId}
            orgId={fetchedTask?.orgId}
            canEdit={canEdit}
          />
        );
      })}
      {!rewards?.length && !showAdd && canEdit ? (
        <CreateEntityLabelAddButton onClick={() => setShowAdd(true)} data-cy="button-add-assignee">
          <CreateEntityAddButtonIcon />
          <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
        </CreateEntityLabelAddButton>
      ) : null}
    </TaskSectionDisplayDiv>
  );
};

export default Rewards;
