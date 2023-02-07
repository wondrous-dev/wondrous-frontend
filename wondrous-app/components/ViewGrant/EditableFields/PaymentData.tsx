import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { GrantPaymentData } from 'components/ViewGrant/Fields';
import { TaskSectionLabel } from 'components/Common/TaskViewModal/helpers';
import { ViewFieldWrapper } from 'components/Common/TaskViewModal/styles';
import EditIcon from 'components/Icons/editIcon';
import palette from 'theme/palette';
import { useTaskContext } from 'utils/hooks';
import { GrantAmount, GrantQuantity } from 'components/CreateGrant/Fields';
import GrantStyle, { getGrantStyleFromGrant, GRANT_STYLE_MAP } from 'components/CreateGrant/Fields/GrantStyle';
import { Grid } from '@mui/material';
import { useState } from 'react';
import { useSubmit } from 'components/Common/TaskViewModal/Fields/hooks/useSubmit';
import { FIELDS } from 'components/Common/TaskViewModal/Fields/hooks/constants';

const ViewContent = ({ toggleEditMode, reward, numOfGrant, canEdit }) => (
  <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode} background="transparent">
    <GrantPaymentData paymentData={reward} numOfGrant={numOfGrant} />
    <EditIcon stroke={palette.grey58} className="edit-icon-field" />
  </ViewFieldWrapper>
);

const PaymentData = ({ reward, numOfGrant, canEdit }) => {
  const { grant } = useTaskContext();

  const [grantStyle, setGrantStyle] = useState(getGrantStyleFromGrant(numOfGrant));
  const { submit, error } = useSubmit({ field: FIELDS.REWARDS });
  const { submit: submitNumOfGrant, error: numOfGrantError } = useSubmit({ field: FIELDS.NUM_OF_GRANT });

  const handleSubmitNumOfGrant = async (value) => {
    await submitNumOfGrant(parseInt(value, 10));
    console.log(value);
  };

  const handleSubmitReward = async (value) => {
    const { rewardAmount, paymentMethodId } = value;
    await submit({ rewardAmount, paymentMethodId });
  };

  const handleGrantStyle = (value) => {
    setGrantStyle(value);
    if (value === GRANT_STYLE_MAP.FIXED) {
      handleSubmitNumOfGrant(1);
    }
  };
  return (
    <>
      <TaskFieldEditableContent
        editableContent={({ toggleEditMode }) => (
          <Grid display="flex" gap="12px" direction="column" width="100%">
            <GrantStyle value={grantStyle} onChange={handleGrantStyle} />
            {grantStyle === GRANT_STYLE_MAP.FIXED ? (
              <GrantQuantity value={numOfGrant} onChange={handleSubmitNumOfGrant} setError={() => {}} error={null} />
            ) : null}

            <GrantAmount
              value={reward}
              onChange={(_, value) => handleSubmitReward(value)}
              orgId={grant?.org?.id}
              error={null}
              grantStyle={grantStyle}
              numOfGrant={grant?.numOfGrant}
            />
          </Grid>
        )}
        ViewContent={({ toggleEditMode }) => (
          <>
            <TaskSectionLabel>Grant amount</TaskSectionLabel>
            <ViewContent canEdit={canEdit} toggleEditMode={toggleEditMode} reward={reward} numOfGrant={numOfGrant} />
          </>
        )}
      />
    </>
  );
};

export default PaymentData;
