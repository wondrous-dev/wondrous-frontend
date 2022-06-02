export default function StarIcon({ stroke = 'url(#open)', ...rest }) {
  return (
    <svg width="21" height="21" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <path
        d="M8.17773 0.709473L10.418 5.31725L15.4277 6.06068L11.8027 9.64533L12.6582 14.7095L8.17773 12.3173L3.69723 14.7095L4.55273 9.64533L0.927734 6.06068L5.93748 5.31725L8.17773 0.709473Z"
        stroke={stroke}
        strokeWidth="1.02815"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient id="open" x1="8.17773" y1="0.709473" x2="8.17773" y2="14.7095" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CCBBFF" />
          <stop offset="0.473958" stopColor="#7427FF" />
          <stop offset="1" stopColor="#00BAFF" />
        </linearGradient>
        <linearGradient id="completed" x1="7" y1="1" x2="7" y2="13" gradientUnits="userSpaceOnUse">
          <stop stop-color="white" />
          <stop offset="1" stop-color="#06FFA5" />
        </linearGradient>
      </defs>
    </svg>
  );
}
