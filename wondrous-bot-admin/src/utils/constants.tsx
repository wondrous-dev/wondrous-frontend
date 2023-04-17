import QuizComponent from 'components/AddFormEntity/components/QuizComponent';
import TextComponent from 'components/AddFormEntity/components/Text';

export const TYPES = {
  TEXT_FIELD: 'text_field',
  MULTIPLE_CHOICE: 'multiple_choice',
  NUMBER: 'number',
  ATTACHMENTS: 'attachments',
};

export const CONFIG = [
  {
    label: 'Text Field',
    value: TYPES.TEXT_FIELD,
  },
];

export const CONFIG_COMPONENTS = {
  [TYPES.TEXT_FIELD]: TextComponent,
  [TYPES.MULTIPLE_CHOICE]: QuizComponent,
  [TYPES.NUMBER]: TextComponent,
  [TYPES.ATTACHMENTS]: TextComponent,
};

export const RESPOND_TYPES = {
  [TYPES.TEXT_FIELD]: 'a text',
  [TYPES.NUMBER]: 'a number',
  [TYPES.ATTACHMENTS]: 'files and/or links',
};

export const HEADER_HEIGHT = 68;

export const THEME_TYPES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const COMPONENT_LABELS = {
  [TYPES.TEXT_FIELD]: 'Text',
  [TYPES.MULTIPLE_CHOICE]: 'Quiz',
};

export const OPTIONS_VALUES = {
  MULTI: 'multi',
  SINGLE: 'single',
};
