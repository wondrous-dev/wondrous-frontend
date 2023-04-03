import TextField from 'components/AddFormEntity/components/TextField';

export const TYPES = {
  TEXT_FIELD: 'text_field',
  SELECT_FIELD: 'select_field',
  CHECKBOX_FIELD: 'checkbox_field',
  MULTI_SELECT_FIELD: 'multi_select_field',
};

export const CONFIG = [
  {
    label: 'Text Field',
    value: TYPES.TEXT_FIELD,
  },
];

export const CONFIG_COMPONENTS = {
  [TYPES.TEXT_FIELD]: TextField,
};
