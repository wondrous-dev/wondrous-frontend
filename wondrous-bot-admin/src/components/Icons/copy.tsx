export function CopyIcon({ color = '#C4C4C4' }) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" fill="none" viewBox="0 0 19 18">
        <path
          stroke={color}
          strokeLinecap="round"
          d="M15.983 6.535H8.659c-.9 0-1.628.728-1.628 1.627v7.324c0 .899.729 1.627 1.628 1.627h7.324c.898 0 1.627-.728 1.627-1.627V8.162c0-.899-.729-1.627-1.627-1.627z"
        />
        <path
          stroke={color}
          strokeLinecap="round"
          d="M3.777 11.417h-.814A1.628 1.628 0 011.336 9.79V2.466A1.627 1.627 0 012.963.838h7.324a1.627 1.627 0 011.628 1.628v.814"
        />
      </svg>
    );
  }
  
  export function CopySuccessIcon() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
        <path
          stroke="url(#paint0_linear_2581_28035)"
          strokeLinecap="round"
          d="M15.506 6.774H8.182c-.899 0-1.627.729-1.627 1.627v7.324c0 .9.728 1.628 1.627 1.628h7.324c.899 0 1.628-.729 1.628-1.628V8.401c0-.898-.73-1.627-1.628-1.627z"
        />
        <path
          stroke="url(#paint1_linear_2581_28035)"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.252 10.208l-3.703 3.707-1.111-1.11"
        />
        <path
          stroke="url(#paint2_linear_2581_28035)"
          strokeLinecap="round"
          d="M3.3 11.656h-.813A1.628 1.628 0 01.859 10.03V2.705a1.628 1.628 0 011.628-1.627H9.81a1.628 1.628 0 011.627 1.627v.814"
        />
        <defs>
          <linearGradient
            id="paint0_linear_2581_28035"
            x1="11.844"
            x2="11.844"
            y1="6.774"
            y2="17.353"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#06FFA5" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_2581_28035"
            x1="11.845"
            x2="11.845"
            y1="10.208"
            y2="13.915"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#06FFA5" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_2581_28035"
            x1="6.149"
            x2="6.149"
            y1="1.078"
            y2="11.656"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#06FFA5" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  export default CopyIcon;
  