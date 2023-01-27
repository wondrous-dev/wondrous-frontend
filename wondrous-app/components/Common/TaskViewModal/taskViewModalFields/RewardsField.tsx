import { Grid } from '@mui/material';
import {
  CreateEntityPaymentMethodItem,
  handleRewardOnChange,
  CreateEntityTextfieldInputRewardComponent,
  useGetPaymentMethods,
  filterPaymentMethods,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityWrapper,
  CreateEntityPaymentMethodSelect,
  CreateEntityPaymentMethodSelected,
  CreateEntitySelectArrowIcon,
  CreateEntityPaymentMethodOption,
  CreateEntityTextfield,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
} from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import { isEmpty } from 'lodash';
import { useRef, useState } from 'react';
import palette from 'theme/palette';
import { useOutsideAlerter } from 'utils/hooks';
import { TaskSectionLabel, TaskSectionImageContent, ConnectToWallet } from '../helpers';
import {
  TaskSectionDisplayDiv,
  TaskSectionInfoPaymentWrapper,
  TaskSectionInfoPaymentMethodIcon,
  TaskSectionInfoPaymentAmount,
  TaskSectionInfoPaymentMethodChain,
  ViewFieldWrapper,
} from '../styles';

const CreateReward = ({ orgId, paymentMethodId, rewardAmount, toggleEditMode }) => {
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(orgId, true));
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated

  return (
    <CreateEntityWrapper>
      <CreateEntityPaymentMethodSelect
        name="rewards-payment-method"
        value={paymentMethodId}
        onChange={(value) => {
          console.log(value);
        }}
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
                //   form.setFieldValue('rewards', []);
              }}
            >
              <CreateEntityAutocompletePopperRenderInputIcon />
            </CreateEntityAutocompletePopperRenderInputAdornment>
          ),
        }}
        //   error={form.errors?.rewards?.[0]?.rewardAmount}
        onFocus={() => {}}
      />
    </CreateEntityWrapper>
  );
};

const RewardField = ({ rewardAmount, symbol, icon, chain, user, hasContent, orgId, paymentMethodId }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const ref = useRef();

  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  useOutsideAlerter(ref, toggleEditMode);

  if (isEditMode) {
    return (
      <div ref={ref}>
        <CreateReward
          orgId={orgId}
          paymentMethodId={paymentMethodId}
          rewardAmount={rewardAmount}
          toggleEditMode={toggleEditMode}
        />
      </div>
    );
  }

  return (
    <TaskSectionImageContent
      hasContent={hasContent}
      ContentComponent={() => (
        <ViewFieldWrapper canEdit onClick={() => setIsEditMode(true)}>
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

const Rewards = ({ fetchedTask, user, withLabel = true }) => {
  const rewards = fetchedTask?.rewards;
  if (isEmpty(rewards)) return null;
  return (
    <TaskSectionDisplayDiv>
      {withLabel ? <TaskSectionLabel>Rewards</TaskSectionLabel> : null}
      {rewards.map((reward, index) => {
        const { rewardAmount, symbol, icon, chain, paymentMethodId } = reward;
        return (
          <RewardField
            hasContent={!!reward}
            rewardAmount={rewardAmount}
            symbol={symbol}
            icon={icon}
            chain={chain}
            user={user}
            paymentMethodId={paymentMethodId}
            orgId={fetchedTask?.orgId}
          />
        );
      })}
    </TaskSectionDisplayDiv>
  );
};

export default Rewards;
