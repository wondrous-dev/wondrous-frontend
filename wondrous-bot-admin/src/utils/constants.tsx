import QuizComponent from 'components/AddFormEntity/components/QuizComponent';
import TextField from 'components/AddFormEntity/components/TextField';

export const TYPES = {
  TEXT_FIELD: 'text_field',
  TELEGRAM: 'telegram',
  QUIZ: 'quiz'
};

const telegarm = () => null
export const CONFIG = [
  {
    label: 'Text Field',
    value: TYPES.TEXT_FIELD,
  },
  
];

export const CONFIG_COMPONENTS = {
  [TYPES.TEXT_FIELD]: TextField,
  [TYPES.QUIZ]: QuizComponent,
  [TYPES.TELEGRAM]: telegarm
};

export const HEADER_HEIGHT = 68;

export const THEME_TYPES = {
  LIGHT: 'light',
  DARK: 'dark'
}

export const COMPONENT_LABELS = {
  [TYPES.TEXT_FIELD]: 'Text',
  [TYPES.TELEGRAM]: 'Telegram',
  [TYPES.QUIZ]: 'Quiz'
};