import { Grid } from '@mui/material';
import { useMe } from 'components/Auth/withAuth';
import { StyledLink } from 'components/Common/text';
import {
  CreateEntityPaymentMethodItem,
  CreateEntityTextfieldInputRewardComponent,
  filterPaymentMethods,
  useGetPaymentMethods,
} from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityError,
  CreateEntityPaymentMethodOption,
  CreateEntityPaymentMethodSelect,
  CreateEntityPaymentMethodSelected,
  CreateEntitySelectArrowIcon,
  CreateEntityTextfield,
  CreateEntityWrapper,
} from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import { useMemo, useRef, useState } from 'react';
import palette from 'theme/palette';
import { ConnectToWallet, TaskSectionLabel } from '../helpers';
import {
  TaskSectionDisplayDiv,
  TaskSectionInfoPaymentAmount,
  TaskSectionInfoPaymentMethodChain,
  TaskSectionInfoPaymentMethodIcon,
  ViewFieldHoverWrapper,
  ViewFieldWrapper,
} from '../styles';
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';
import { RewardsWrapper } from './styles';

export const ViewRewards = ({ canEdit = false, rewardAmount, symbol, toggleEditMode = () => {}, icon, chain }) => {
  const user = useMe();
  return (
    <Grid display="flex" direction="column" gap="8px">
      <ViewFieldHoverWrapper $canEdit={canEdit} onClick={toggleEditMode}>
        <ViewFieldWrapper>
          <Grid gap="6px" display="flex" justifyContent="center" alignItems="center">
            <TaskSectionInfoPaymentMethodIcon src={icon} />
            <TaskSectionInfoPaymentAmount>
              {rewardAmount} {symbol}
            </TaskSectionInfoPaymentAmount>
            <TaskSectionInfoPaymentMethodChain> on {chain}</TaskSectionInfoPaymentMethodChain>
          </Grid>
        </ViewFieldWrapper>
        <EditIcon stroke={palette.grey58} className="edit-icon-field" />
      </ViewFieldHoverWrapper>
      {user ? <ConnectToWallet user={user} /> : null}
    </Grid>
  );
};

const CreateReward = ({ handleReward, orgId, paymentMethodId, rewardAmount, toggleEditMode, error }) => {
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(orgId, true));
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated
  const [input, setInput] = useState({
    paymentMethodId,
    rewardAmount: rewardAmount ? parseFloat(rewardAmount) : '',
  });
  const router = useRouter();

  const handlePaymentMethodRedirect = () => router.push(`/organization/settings/${orgId}/payment-method`);

  const debounceHandleReward = debounce(handleReward, 200);
  if (!activePaymentMethods?.length)
    return (
      <StyledLink onClick={handlePaymentMethodRedirect} style={{ cursor: 'pointer' }}>
        Set up payment method
      </StyledLink>
    );

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
    <RewardsWrapper>
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
    </RewardsWrapper>
  );
};

const Rewards = ({ fetchedTask, canEdit, shouldDisplay }) => {
  const rewards = fetchedTask?.rewards;
  const { submit, error } = useSubmit({ field: FIELDS.REWARDS });

  const values = useMemo(
    () =>
      rewards?.map((reward) => ({
        paymentMethodId: reward?.paymentMethodId,
        rewardAmount: reward?.rewardAmount,
      })),
    [rewards]
  );

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

  const { rewardAmount, symbol, icon, chain, paymentMethodId } = rewards?.[0] || {};

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
        content={rewards.length}
        addContent={({ toggleAddMode }) => (
          <CreateReward
            orgId={fetchedTask?.orgId}
            error={error}
            paymentMethodId={null}
            rewardAmount=""
            toggleEditMode={toggleAddMode}
            handleReward={handleReward}
          />
        )}
        viewContent={({ toggleEditMode }) => (
          <ViewRewards
            canEdit={canEdit}
            toggleEditMode={toggleEditMode}
            rewardAmount={rewardAmount}
            symbol={symbol}
            icon={icon}
            chain={chain}
          />
        )}
      />
    </TaskSectionDisplayDiv>
  );
};

export default Rewards;
