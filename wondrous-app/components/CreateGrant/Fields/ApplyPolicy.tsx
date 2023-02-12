import TypeSelector from './TypeSelector';

export const APPLY_POLICY_FIELDS = [
  {
    name: 'Anyone',
    value: 'everyone',
  },
  {
    name: 'Members',
    value: 'only_org_members',
  },
];

const ApplyPolicy = ({ onChange, value, label = "Eligibility" }) => (
  <TypeSelector onChange={onChange} config={APPLY_POLICY_FIELDS} value={value} label={label} />
);

export default ApplyPolicy;
