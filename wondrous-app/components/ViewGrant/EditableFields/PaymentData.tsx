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

const ViewContent = ({ toggleEditMode, reward, numOfGrant, canEdit }) => {
  return (
    <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
      <GrantPaymentData paymentData={reward} numOfGrant={numOfGrant} />
      <EditIcon stroke={palette.grey58} className="edit-icon-field" />
    </ViewFieldWrapper>
  );
};

const PaymentData = ({ reward, numOfGrant, canEdit }) => {
  const { grant } = useTaskContext();

  const [grantStyle, setGrantStyle] = useState(getGrantStyleFromGrant(numOfGrant));

  return (  
    <>
      <TaskFieldEditableContent
        editableContent={({ toggleEditMode }) => (
          <Grid display="flex" gap="12px" direction="column" width="100%">
            <GrantStyle value={grantStyle} onChange={(value) => setGrantStyle(value)} />
            {grantStyle === GRANT_STYLE_MAP.FIXED ? (
              <GrantQuantity
                value={numOfGrant}
                onChange={(value) => console.log('on value grant quantity')}
                setError={() => {}}
                error={null}
              />
            ) : null}

            <GrantAmount
              value={reward}
              onChange={(value) => console.log('on change')}
              setError={() => console.log('error')}
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
