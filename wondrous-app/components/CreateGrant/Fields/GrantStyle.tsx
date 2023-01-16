import TypeSelector from './TypeSelector';

export const GRANT_STYLE_MAP = {
  VARIABLE: 'VARIABLE',
  FIXED: 'FIXED',
};

export const GRANT_STYLE_CONFIG = [
  {
    name: 'Variable',
    value: GRANT_STYLE_MAP.VARIABLE,
  },
  {
    name: 'Fixed',
    value: GRANT_STYLE_MAP.FIXED,
  },
];

export const getGrantStyleFromGrant = (numOfGrant) => {
  if (numOfGrant !== null) {
    return GRANT_STYLE_MAP.FIXED;
  }
  return GRANT_STYLE_MAP.VARIABLE;
};

const GrantStyle = ({ onChange, value }) => (
  <TypeSelector onChange={onChange} config={GRANT_STYLE_CONFIG} value={value} label="Grant Style" />
);

export default GrantStyle;
