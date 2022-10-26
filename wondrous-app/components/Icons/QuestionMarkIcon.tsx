import palette from 'theme/palette';

const QuestionMarkIcon = ({ strokeColor = palette.blue20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
    <path
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 16.5a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
    />
    <path
      stroke={strokeColor}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.817 6.75a2.25 2.25 0 014.373.75c0 1.5-2.25 2.25-2.25 2.25M9 12.75h.008"
    />
  </svg>
);

export default QuestionMarkIcon;
