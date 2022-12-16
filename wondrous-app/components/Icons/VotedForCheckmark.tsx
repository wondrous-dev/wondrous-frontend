export function VotedForCheckMark(props) {
  return (
    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="0.5"
        y="0.699219"
        width="14"
        height="14"
        rx="7"
        fill="#313131"
        stroke="url(#paint0_linear_21242_72497)"
      />
      <path
        d="M4 7.69933L6.625 10.3243L11.0002 5.94922"
        stroke="url(#paint1_linear_21242_72497)"
        stroke-linecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_21242_72497"
          x1="7.5"
          y1="0.699219"
          x2="7.5"
          y2="14.6992"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="white" />
          <stop offset="1" stop-color="#06FFA5" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_21242_72497"
          x1="7.50011"
          y1="5.94922"
          x2="7.50011"
          y2="10.3243"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="white" />
          <stop offset="1" stop-color="#06FFA5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function NotVotedCheckmark(props) {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1.5" y="1.69922" width="14" height="14" rx="7" fill="#313131" stroke="#313131" stroke-width="2" />
      <path
        d="M5 8.69933L7.625 11.3243L12.0002 6.94922"
        stroke="#7A7A7A"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
