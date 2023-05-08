import { Checkbox } from '@mui/material';
import { StyledChipTag } from 'components/Tags/styles';
import { APPLICATION_POLICY, APPLICATION_POLICY_LABELS_MAP } from 'utils/constants';
import palette from 'theme/palette';
import { entityTypeData, Fields } from '../../Helpers';
import {
  ApplicationInputWrapper,
  CreateEntityLabelSelectWrapper,
  CreateEntityLabelWrapper,
  CreateEntityLabel,
  CreateEntitySelectWrapper,
  CreateEntityWrapper,
  CreateEntitySelect,
  CreateEntityApplicationsSelectRender,
  CreateEntitySelectArrowIcon,
  CreateEntityOption,
  CreateEntityOptionLabel,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityError,
  CreateEntityLabelAddButton,
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
  ApplicationInputUnassignContainer,
} from '../../styles';

const ApplicationsInput = ({
  entityType,
  roles,
  claimPolicy,
  setFieldValue,
  claimPolicyRoles,
  setRolesFieldValue,
  setUnclaimFieldValue,
  touched,
  shouldUnclaimOnDueDateExpiry,
}) => {
  const getRoleDataById = (id) => roles?.find((role) => role.id === id);

  return (
    <ApplicationInputWrapper>
      <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.claimPolicy)}>
        <CreateEntityLabelWrapper>
          <CreateEntityLabel>Applications</CreateEntityLabel>
        </CreateEntityLabelWrapper>
        <CreateEntitySelectWrapper style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
          {claimPolicy !== null && (
            <CreateEntityWrapper>
              <CreateEntitySelect
                name="task-applications"
                value={claimPolicy}
                style={{ width: '100%' }}
                onChange={(value) => {
                  setFieldValue(value);
                  if (
                    value === APPLICATION_POLICY.ROLES_CAN_CAN_CLAIM.value ||
                    value === APPLICATION_POLICY.ROLES_CAN_CAN_APPLY.value
                  )
                    setRolesFieldValue([roles[0]?.id]);
                }}
                renderValue={() => {
                  const isRolesSelected =
                    claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_CLAIM.value ||
                    claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_APPLY.value;
                  return (
                    <CreateEntityApplicationsSelectRender>
                      <span>{isRolesSelected ? 'Role: ' : APPLICATION_POLICY_LABELS_MAP[claimPolicy]?.title}</span>
                      <CreateEntitySelectArrowIcon />
                    </CreateEntityApplicationsSelectRender>
                  );
                }}
              >
                {Object.keys(APPLICATION_POLICY).map((policy, idx) => {
                  const appPolicy = APPLICATION_POLICY[policy];
                  return (
                    <CreateEntityOption key={idx} value={appPolicy?.value}>
                      <CreateEntityOptionLabel>{appPolicy?.title}</CreateEntityOptionLabel>
                    </CreateEntityOption>
                  );
                })}
              </CreateEntitySelect>
              {(claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_CLAIM.value ||
                claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_APPLY.value) && (
                <CreateEntitySelect
                  name="task-applications-claim-roles"
                  value={claimPolicyRoles}
                  style={{ width: '100%', height: 'fit-content' }}
                  onChange={(value) => setFieldValue(claimPolicyRoles ? [...claimPolicyRoles, value] : [value])}
                  renderValue={() => (
                    <CreateEntityApplicationsSelectRender>
                      {claimPolicyRoles?.map((role) => {
                        const roleData = getRoleDataById(role);
                        return (
                          <StyledChipTag
                            key={role}
                            style={{ margin: '2px' }}
                            deleteIcon={<div>&times;</div>}
                            onClick={() => setFieldValue(claimPolicyRoles?.filter((claimRole) => claimRole !== role))}
                            label={roleData?.name}
                            // background={option.color}
                            variant="outlined"
                          />
                        );
                      })}
                      <CreateEntitySelectArrowIcon />
                    </CreateEntityApplicationsSelectRender>
                  )}
                >
                  {roles?.map((role, roleIdx) => {
                    if (claimPolicyRoles?.includes(role.id)) return null;
                    return (
                      <CreateEntityOption key={roleIdx} value={role.id}>
                        <CreateEntityOptionLabel>{role?.name}</CreateEntityOptionLabel>
                      </CreateEntityOption>
                    );
                  })}
                </CreateEntitySelect>
              )}
            </CreateEntityWrapper>
          )}
          {claimPolicy !== null && (
            <CreateEntityAutocompletePopperRenderInputAdornment
              position="end"
              onClick={() => {
                setFieldValue(null);
                setRolesFieldValue(null);
                setUnclaimFieldValue(null);
              }}
            >
              <CreateEntityAutocompletePopperRenderInputIcon />
            </CreateEntityAutocompletePopperRenderInputAdornment>
          )}
          {touched && <CreateEntityError>{touched}</CreateEntityError>}
          {claimPolicy === null && (
            <CreateEntityLabelAddButton
              onClick={() => {
                setFieldValue(APPLICATION_POLICY.ALL_MEMBERS.value);
              }}
            >
              <CreateEntityAddButtonIcon />
              <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
            </CreateEntityLabelAddButton>
          )}
        </CreateEntitySelectWrapper>
      </CreateEntityLabelSelectWrapper>
      {claimPolicy !== null && entityTypeData[entityType].fields.includes(Fields.claimPolicy) && (
        <ApplicationInputUnassignContainer>
          <Checkbox
            checked={!!shouldUnclaimOnDueDateExpiry}
            onChange={() => setUnclaimFieldValue(!shouldUnclaimOnDueDateExpiry)}
            inputProps={{ 'aria-label': 'controlled' }}
            sx={{
              '& svg': {
                path: {
                  fill: palette.highlightPurple,
                },
              },
            }}
          />
          Remove assignee when due date is passed
        </ApplicationInputUnassignContainer>
      )}
    </ApplicationInputWrapper>
  );
};

export default ApplicationsInput;
