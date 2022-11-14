import { TaskSectionDisplayDiv } from 'components/Common/TaskViewModal/styles';
import {
  CreateEntityLabelSelectWrapper,
  CreateEntityLabelWrapper,
  CreateEntityLabel,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { ApplyPolicyItemButton, ApplyPolicyWrapper } from './styles';

export const APPLY_POLICY_FIELDS = [
  {
    name: 'Anyone',
    value: 'everyone',
  },
  {
    name: 'Members',
    value: 'onlyOrgMembersCanApply',
  },
];

const ApplyPolicyItem = ({ isActive, label, onChange }) => (
  <ApplyPolicyItemButton type="button" isActive={isActive} onClick={onChange}>
    {label}
  </ApplyPolicyItemButton>
);

const ApplyPolicy = ({ onChange, value }) => (
  <TaskSectionDisplayDiv alignItems="start">
    <CreateEntityLabelWrapper>
      <CreateEntityLabel>Eligibility</CreateEntityLabel>
    </CreateEntityLabelWrapper>
    <ApplyPolicyWrapper>
      {APPLY_POLICY_FIELDS.map((field) => (
        // <div key={field.value}>{field.name}</div>
        <ApplyPolicyItem
          key={field.value}
          isActive={value === field.value}
          label={field.name}
          onChange={() => onChange(field.value)}
        />
      ))}
    </ApplyPolicyWrapper>
  </TaskSectionDisplayDiv>
);

export default ApplyPolicy;
