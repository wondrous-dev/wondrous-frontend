export default function CreateMilestoneIcon({ stroke = '#CCBBFF', fill = '#141414', displayBackground = true }) {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      {displayBackground && <circle cx="12.8398" cy="12.4819" r="12" fill="#141414" />}
      <path
        d="M9.60547 17.9819V14.8252V6.98193"
        stroke={stroke}
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.0816 10.4797C15.2561 9.96274 12.4309 14.4528 9.60547 13.9372V6.98193C12.4309 9.81684 15.2561 7.64449 18.0816 10.4797Z"
        stroke={stroke}
        strokeWidth="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
