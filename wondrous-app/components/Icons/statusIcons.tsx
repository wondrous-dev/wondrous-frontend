export function TodoIcon(props) {
  return (
    <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle
        cx="18.9498"
        cy="17.8946"
        r="10.2857"
        stroke="url(#paint0_linear_15597_208492)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4.71 5.14"
      />
      <circle cx="18.7157" cy="18.1461" r="7.3973" stroke="#7A7A7A" strokeWidth="1.4" />
      <circle
        cx="18.7163"
        cy="18.146"
        r="4.34128"
        stroke="url(#paint1_linear_15597_208492)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_15597_208492"
          x1="28.1601"
          y1="-5.75153"
          x2="17.8744"
          y2="28.4069"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#F93701" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_15597_208492"
          x1="22.6037"
          y1="8.16567"
          x2="18.2624"
          y2="22.5829"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#F93701" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function InProgressIcon(props) {
  const { style = {}, none } = props;

  return (
    <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <circle cx="18.6574" cy="18.0001" r="2.57143" fill="#7A7A7A" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.7679 6.35815C19.1545 6.35815 19.4679 6.67155 19.4679 7.05815V11.8215C19.4679 12.2081 19.1545 12.5215 18.7679 12.5215C18.3813 12.5215 18.0679 12.2081 18.0679 11.8215V7.05815C18.0679 6.67155 18.3813 6.35815 18.7679 6.35815ZM18.7679 23.4978C19.1545 23.4978 19.4679 23.8112 19.4679 24.1978V28.9611C19.4679 29.3477 19.1545 29.6611 18.7679 29.6611C18.3813 29.6611 18.0679 29.3477 18.0679 28.9611V24.1978C18.0679 23.8112 18.3813 23.4978 18.7679 23.4978ZM12.9451 7.91906C13.2799 7.72576 13.708 7.84048 13.9013 8.17528L16.2829 12.3004C16.4762 12.6352 16.3615 13.0633 16.0267 13.2566C15.6919 13.4499 15.2638 13.3352 15.0705 13.0004L12.6888 8.87528C12.4955 8.54048 12.6103 8.11236 12.9451 7.91906ZM21.5134 22.7623C21.8482 22.569 22.2763 22.6837 22.4696 23.0185L24.8513 27.1437C25.0446 27.4785 24.9299 27.9066 24.5951 28.0999C24.2603 28.2932 23.8322 28.1785 23.6389 27.8437L21.2572 23.7185C21.0639 23.3837 21.1786 22.9556 21.5134 22.7623ZM24.8507 8.87495C25.044 8.54015 24.9293 8.11203 24.5945 7.91873C24.2597 7.72543 23.8316 7.84015 23.6383 8.17495L21.2566 12.3001C21.0633 12.6349 21.178 13.063 21.5128 13.2563C21.8476 13.4496 22.2757 13.3349 22.469 13.0001L24.8507 8.87495ZM16.2804 23.7187C16.4737 23.3839 16.359 22.9558 16.0242 22.7625C15.6894 22.5692 15.2613 22.6839 15.068 23.0187L12.6863 27.1438C12.493 27.4787 12.6077 27.9068 12.9425 28.1001C13.2773 28.2934 13.7054 28.1787 13.8987 27.8438L16.2804 23.7187ZM28.8605 12.1837C29.0538 12.5185 28.9391 12.9467 28.6042 13.14L24.4791 15.5216C24.1443 15.7149 23.7162 15.6002 23.5229 15.2654C23.3296 14.9306 23.4443 14.5025 23.7791 14.3092L27.9042 11.9275C28.2391 11.7342 28.6672 11.8489 28.8605 12.1837ZM14.0166 20.7538C14.2099 21.0886 14.0952 21.5167 13.7604 21.71L9.63527 24.0917C9.30047 24.285 8.87235 24.1702 8.67905 23.8354C8.48575 23.5006 8.60047 23.0725 8.93527 22.8792L13.0604 20.4976C13.3952 20.3043 13.8233 20.419 14.0166 20.7538ZM29.723 18.7098C30.1096 18.7098 30.423 18.3964 30.423 18.0098C30.423 17.6232 30.1096 17.3098 29.723 17.3098H24.9597C24.5731 17.3098 24.2597 17.6232 24.2597 18.0098C24.2597 18.3964 24.5731 18.7098 24.9597 18.7098H29.723ZM12.5824 18.7096C12.969 18.7096 13.2824 18.3962 13.2824 18.0096C13.2824 17.623 12.969 17.3096 12.5824 17.3096H7.81914C7.43254 17.3096 7.11914 17.623 7.11914 18.0096C7.11914 18.3962 7.43254 18.7096 7.81914 18.7096L12.5824 18.7096ZM28.8605 23.8354C28.6672 24.1702 28.2391 24.2849 27.9043 24.0916L23.7791 21.71C23.4443 21.5167 23.3296 21.0886 23.5229 20.7537C23.7162 20.4189 24.1443 20.3042 24.4791 20.4975L28.6042 22.8792C28.9391 23.0725 29.0538 23.5006 28.8605 23.8354ZM14.0187 15.2656C13.8254 15.6004 13.3973 15.7151 13.0625 15.5218L8.93731 13.1401C8.60251 12.9468 8.48779 12.5187 8.68109 12.1839C8.87439 11.8491 9.30251 11.7344 9.63731 11.9277L13.7625 14.3094C14.0973 14.5027 14.212 14.9308 14.0187 15.2656Z"
        fill={none || 'url(#paint0_linear_15597_208466)'}
      />
      <defs>
        <linearGradient
          id="paint0_linear_15597_208466"
          x1="18.7711"
          y1="6.35815"
          x2="18.7711"
          y2="29.6611"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#FFD653" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function InReviewIcon(props) {
  const { style } = props;

  return (
    <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <circle cx="18.6571" cy="18.0001" r="7.3973" stroke="#7A7A7A" strokeWidth="1.4" />
      <circle cx="14.6587" cy="17.9983" r="1.27394" fill="url(#paint0_linear_15597_208454)" />
      <circle cx="18.6568" cy="17.9983" r="1.27394" fill="url(#paint1_linear_15597_208454)" />
      <circle cx="22.6548" cy="17.9983" r="1.27394" fill="url(#paint2_linear_15597_208454)" />
      <circle
        cx="18.6588"
        cy="18.0008"
        r="10.2857"
        stroke="url(#paint3_linear_15597_208454)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_15597_208454"
          x1="14.6587"
          y1="16.7244"
          x2="14.6587"
          y2="19.2723"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#00BAFF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_15597_208454"
          x1="18.6568"
          y1="16.7244"
          x2="18.6568"
          y2="19.2723"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#00BAFF" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_15597_208454"
          x1="22.6548"
          y1="16.7244"
          x2="22.6548"
          y2="19.2723"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#00BAFF" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_15597_208454"
          x1="18.6588"
          y1="7.71509"
          x2="18.6588"
          y2="28.2865"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#00BAFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function CompletedIcon(props) {
  const { style, fill, stroke } = props;
  return (
    <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg" {...style}>
      <path
        d="M29.0707 17.0541V18.0061C29.0694 20.2376 28.3469 22.4088 27.0108 24.196C25.6747 25.9833 23.7967 27.2907 21.6568 27.9234C19.517 28.5561 17.2299 28.4801 15.1368 27.7068C13.0436 26.9335 11.2565 25.5043 10.042 23.6323C8.82748 21.7604 8.25061 19.5459 8.39743 17.3193C8.54425 15.0927 9.40689 12.9733 10.8567 11.277C12.3065 9.58071 14.2658 8.39853 16.4424 7.90677C18.619 7.415 20.8962 7.63999 22.9344 8.54818"
        stroke={stroke || 'url(#paint0_linear_15597_208446)'}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M26.1208 17.324V18.0046C26.1198 19.5997 25.6033 21.1519 24.6482 22.4295C23.6931 23.7071 22.3506 24.6418 20.8209 25.094C19.2912 25.5463 17.6562 25.492 16.1599 24.9392C14.6636 24.3864 13.3861 23.3647 12.5178 22.0265C11.6496 20.6883 11.2372 19.1053 11.3422 17.5136C11.4472 15.9219 12.0638 14.4068 13.1002 13.1941C14.1367 11.9815 15.5373 11.1365 17.0932 10.7849C18.6492 10.4334 20.2771 10.5942 21.7342 11.2434"
        stroke="#7A7A7A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M29.0694 9.40894L19.4287 19.0593C19.0382 19.4502 18.4047 19.4503 18.0141 19.0597L15.6172 16.6628"
        stroke={stroke || 'url(#paint1_linear_15597_208446)'}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_15597_208446"
          x1="18.7229"
          y1="7.65234"
          x2="18.7229"
          y2="28.3481"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#06FFA5" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_15597_208446"
          x1="22.3433"
          y1="9.40894"
          x2="22.3433"
          y2="19.7671"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#06FFA5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ArchivedIcon(props) {
  const { style } = props;
  return (
    <svg
      style={style}
      width={style?.width || '29'}
      height={style?.height || '29'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 29 29"
    >
      <circle cx="14" cy="14" r="13.5" fill="#0F0F0F" stroke="#474747" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.85938 20.7059V11.8353H6.49219V8.42285H21.507V11.8353H20.1442V20.7059H7.85938Z"
        fill="url(#paint0_linear_3171_49207)"
      />
      <path
        d="M20.1442 11.8325V20.7049H7.85938V11.8325"
        stroke="#7A7A7A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.1672 14.0896C16.0056 14.0944 15.8523 14.162 15.7396 14.2779L13.07 16.9476L12.2659 16.1435C12.2086 16.0838 12.1399 16.0362 12.064 16.0034C11.988 15.9705 11.9063 15.9532 11.8236 15.9523C11.7408 15.9515 11.6588 15.9672 11.5822 15.9985C11.5056 16.0297 11.436 16.076 11.3775 16.1345C11.319 16.193 11.2727 16.2626 11.2415 16.3392C11.2102 16.4158 11.1945 16.4978 11.1953 16.5806C11.1962 16.6633 11.2135 16.7451 11.2464 16.821C11.2792 16.897 11.3268 16.9656 11.3865 17.0229L12.6303 18.2666C12.7469 18.3832 12.905 18.4487 13.07 18.4487C13.2349 18.4487 13.393 18.3832 13.5096 18.2666L16.619 15.1573C16.7089 15.0699 16.7703 14.9574 16.7951 14.8346C16.82 14.7118 16.8071 14.5843 16.7583 14.4689C16.7094 14.3535 16.6269 14.2555 16.5214 14.1878C16.4159 14.1202 16.2925 14.0859 16.1672 14.0896Z"
        fill="#7A7A7A"
      />
      <path
        d="M21.507 8.42188H6.49219V11.8343H21.507V8.42188Z"
        stroke="#7A7A7A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3171_49207"
          x1="20.7221"
          y1="6.20662"
          x2="20.3012"
          y2="12.3578"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#474747" />
          <stop offset="1" stopColor="#181818" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MembershipRequestIcon(props) {
  return (
    <svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14.9033" r="14" fill="#282828" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5311 11.5701C14.5311 11.1835 14.2177 10.8701 13.8311 10.8701C13.4445 10.8701 13.1311 11.1835 13.1311 11.5701V12.6948C13.1311 13.0814 13.4445 13.3948 13.8311 13.3948C14.2177 13.3948 14.5311 13.0814 14.5311 12.6948V11.5701ZM14.5311 16.7845C14.5311 16.3979 14.2177 16.0845 13.8311 16.0845C13.4445 16.0845 13.1311 16.3979 13.1311 16.7845V17.9092C13.1311 18.2958 13.4445 18.6092 13.8311 18.6092C14.2177 18.6092 14.5311 18.2958 14.5311 17.9092V16.7845ZM10.6668 14.042C10.2802 14.042 9.9668 14.3554 9.9668 14.742C9.9668 15.1286 10.2802 15.442 10.6668 15.442H11.7915C12.1781 15.442 12.4915 15.1286 12.4915 14.742C12.4915 14.3554 12.1781 14.042 11.7915 14.042H10.6668ZM15.8812 14.042C15.4946 14.042 15.1812 14.3554 15.1812 14.742C15.1812 15.1286 15.4946 15.442 15.8812 15.442H17.0059C17.3925 15.442 17.7059 15.1286 17.7059 14.742C17.7059 14.3554 17.3925 14.042 17.0059 14.042H15.8812Z"
        fill="url(#paint0_linear_13854_284888)"
      />
      <circle
        cx="14"
        cy="14.9033"
        r="8"
        stroke="url(#paint1_linear_13854_284888)"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_13854_284888"
          x1="17.3013"
          y1="5.84385"
          x2="13.4318"
          y2="18.6944"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#FF6DD7" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_13854_284888"
          x1="21.1636"
          y1="-3.48811"
          x2="13.1636"
          y2="23.0795"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#FF6DD7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ProposalsRemainingIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="none" viewBox="0 0 29 29">
      <circle cx="14.633" cy="14.801" r="13.5" fill="#0F0F0F" stroke="#474747" />
      <circle
        cx="14.633"
        cy="14.802"
        r="8"
        fill="url(#paint0_linear_5030_47421)"
        transform="rotate(45 14.633 14.802)"
      />
      <path
        fill="url(#paint1_linear_5030_47421)"
        fillRule="evenodd"
        d="M15.334 11.631a.7.7 0 10-1.4 0v1.125a.7.7 0 101.4 0V11.63zm0 5.215a.7.7 0 10-1.4 0v1.124a.7.7 0 101.4 0v-1.124zM11.47 14.1a.7.7 0 100 1.4h1.124a.7.7 0 100-1.4H11.47zm5.214 0a.7.7 0 100 1.4h1.125a.7.7 0 100-1.4h-1.125z"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient
          id="paint0_linear_5030_47421"
          x1="21.796"
          x2="13.796"
          y1="-3.59"
          y2="22.978"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#474747" />
          <stop offset="1" stopColor="#181818" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_5030_47421"
          x1="12.697"
          x2="21.232"
          y1="19.335"
          y2="11.352"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#B820FF" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AwaitingPaymentIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="none" viewBox="0 0 29 29">
      <circle cx="14.633" cy="14.801" r="13.5" fill="#0F0F0F" stroke="#474747" />
      <circle cx="14.858" cy="14.8" r="7.999" fill="url(#paint0_linear_5030_47458)" />
      <path
        fill="url(#paint1_linear_5030_47458)"
        fillRule="evenodd"
        d="M11.952 11.889a.99.99 0 11-1.401-1.401.99.99 0 011.401 1.4zm7.219 7.224a.991.991 0 11-1.401-1.401.991.991 0 011.4 1.401zm-1.396-8.624a.99.99 0 101.4 1.4.99.99 0 00-1.4-1.4zm-7.227 8.623a.991.991 0 111.402-1.4.991.991 0 01-1.402 1.4zm6.734-4.298c-.008.038-.038.069-.084.084a3.288 3.288 0 00-2.231 2.224.112.112 0 01-.107.083.112.112 0 01-.106-.083 3.259 3.259 0 00-2.231-2.224c-.046-.015-.077-.046-.084-.084h-.008v-.03h.008c.007-.038.038-.069.084-.084a3.259 3.259 0 002.23-2.223.112.112 0 01.107-.084c.046 0 .092.03.107.084a3.259 3.259 0 002.231 2.223c.046.015.076.046.084.084h.008v.03h-.008z"
        clipRule="evenodd"
      />
      <defs>
        <linearGradient
          id="paint0_linear_5030_47458"
          x1="22.021"
          x2="14.022"
          y1="-3.589"
          y2="22.975"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#474747" />
          <stop offset="1" stopColor="#181818" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_5030_47458"
          x1="14.862"
          x2="14.862"
          y1="10.197"
          y2="19.404"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fff" />
          <stop offset="1" stopColor="#06FFA5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function StatusDefaultIcon({ stroke = '#CCBBFF', style = {}, width = '18', height = '18' }) {
  return (
    <svg style={style} width={width} height={height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.00355 16.6306C13.2178 16.6306 16.6341 13.2143 16.6341 9.00013C16.6341 4.78592 13.2178 1.36963 9.00355 1.36963C4.78934 1.36963 1.37305 4.78592 1.37305 9.00013C1.37305 13.2143 4.78934 16.6306 9.00355 16.6306Z"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.00018 13.5782C11.5287 13.5782 13.5785 11.5285 13.5785 8.99993C13.5785 6.47141 11.5287 4.42163 9.00018 4.42163C6.47165 4.42163 4.42188 6.47141 4.42188 8.99993C4.42188 11.5285 6.47165 13.5782 9.00018 13.5782Z"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.00266 10.5261C9.8455 10.5261 10.5288 9.84282 10.5288 8.99998C10.5288 8.15714 9.8455 7.47388 9.00266 7.47388C8.15982 7.47388 7.47656 8.15714 7.47656 8.99998C7.47656 9.84282 8.15982 10.5261 9.00266 10.5261Z"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RejectedIcon(props) {
  return (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12.8008" r="12" fill="#0F0F0F" />
      <path
        d="M11.9997 5.94336C10.2398 5.94336 8.48032 6.61175 7.14523 7.94684C4.47503 10.617 4.47503 14.9856 7.14523 17.6558C9.81542 20.326 14.184 20.326 16.8542 17.6558C19.5244 14.9856 19.5244 10.617 16.8542 7.94684C15.5191 6.61175 13.7597 5.94336 11.9997 5.94336ZM11.9997 7.31522C13.4077 7.31522 14.8153 7.84973 15.8833 8.91774C18.0193 11.0538 18.0193 14.5489 15.8833 16.6849C13.7466 18.821 10.2521 18.821 8.11613 16.6849C5.9801 14.5482 5.9801 11.0538 8.11613 8.91774C9.18448 7.84973 10.5918 7.31522 11.9997 7.31522ZM9.62075 9.71833C9.45082 9.71833 9.28086 9.79136 9.1353 9.93692C8.84418 10.228 8.84418 10.6167 9.1353 10.9078L11.0288 12.8013L9.1353 14.6949C8.84418 14.986 8.84418 15.3746 9.1353 15.6658C9.42642 15.9569 9.81508 15.9569 10.1062 15.6658L11.9997 13.7722L13.8932 15.6658C14.1844 15.9569 14.573 15.9569 14.8641 15.6658C15.1553 15.3746 15.1553 14.986 14.8641 14.6949L12.9706 12.8013L14.8641 10.9078C15.1553 10.6167 15.1553 10.228 14.8641 9.93692C14.573 9.6458 14.1844 9.6458 13.8932 9.93692L11.9997 11.8304L10.1062 9.93692C9.96064 9.79136 9.79069 9.71833 9.62075 9.71833Z"
        fill="url(#paint0_linear_14630_214280)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_14630_214280"
          x1="18.14"
          y1="-2.96413"
          x2="11.2821"
          y2="19.8093"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#F93701" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const AwaitingReview = (props) => (
  <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="18.659" cy="18.8946" r="7.3973" stroke="#7A7A7A" strokeWidth="1.4" />
    <circle cx="14.6607" cy="18.8924" r="1.27394" fill="url(#paint0_linear_15597_208406)" />
    <circle cx="18.6587" cy="18.8926" r="1.27394" fill="url(#paint1_linear_15597_208406)" />
    <circle cx="22.6568" cy="18.8926" r="1.27394" fill="url(#paint2_linear_15597_208406)" />
    <circle
      cx="18.6588"
      cy="18.8941"
      r="10.2857"
      stroke="url(#paint3_linear_15597_208406)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeDasharray="3.8 3.8"
    />
    <defs>
      <linearGradient
        id="paint0_linear_15597_208406"
        x1="14.6607"
        y1="17.6184"
        x2="14.6607"
        y2="20.1663"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#00BAFF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_15597_208406"
        x1="18.6587"
        y1="17.6187"
        x2="18.6587"
        y2="20.1665"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#00BAFF" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_15597_208406"
        x1="22.6568"
        y1="17.6187"
        x2="22.6568"
        y2="20.1665"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#00BAFF" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_15597_208406"
        x1="18.6588"
        y1="8.6084"
        x2="18.6588"
        y2="29.1798"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#00BAFF" />
      </linearGradient>
    </defs>
  </svg>
);

export const OrgMemberships = (props) => (
  <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle
      cx="18.6569"
      cy="18.8945"
      r="10.2857"
      transform="rotate(135 18.6569 18.8945)"
      stroke="url(#paint0_linear_15597_208437)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="6.8 6.8"
    />
    <path
      d="M18.1564 12.3043C18.4658 12.1257 18.847 12.1257 19.1564 12.3043L24.1138 15.1665C24.4232 15.3451 24.6138 15.6752 24.6138 16.0325V21.7568C24.6138 22.1141 24.4232 22.4442 24.1138 22.6228L19.1564 25.485C18.847 25.6636 18.4658 25.6636 18.1564 25.485L13.199 22.6228C12.8896 22.4442 12.699 22.1141 12.699 21.7568V16.0325C12.699 15.6752 12.8896 15.3451 13.199 15.1665L18.1564 12.3043Z"
      stroke="#7A7A7A"
      strokeWidth="1.4"
    />
    <path
      d="M18.6587 15.3728L21.7088 17.1338V20.6557L18.6587 22.4167L15.6086 20.6557V17.1338L18.6587 15.3728Z"
      stroke="url(#paint1_linear_15597_208437)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_15597_208437"
        x1="27.8673"
        y1="-4.7516"
        x2="17.5816"
        y2="29.4068"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#FF6DD7" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_15597_208437"
        x1="21.8124"
        y1="10.798"
        x2="18.2905"
        y2="22.4943"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#FF6DD7" />
      </linearGradient>
    </defs>
  </svg>
);

export const PodMembershipsIcon = (props) => (
  <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <ellipse cx="18.6595" cy="14.5721" rx="5.76297" ry="1.13383" stroke="#7A7A7A" strokeWidth="1.4" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M29.6453 18.8944C29.6453 17.4061 29.3489 15.9853 28.8114 14.689C28.6633 14.3319 28.2537 14.1625 27.8966 14.3106C27.5395 14.4586 27.3701 14.8682 27.5182 15.2253C27.9864 16.3546 28.2453 17.5934 28.2453 18.8944C28.2453 20.1954 27.9864 21.4343 27.5182 22.5635C27.3701 22.9206 27.5395 23.3302 27.8966 23.4783C28.2537 23.6263 28.6633 23.4569 28.8114 23.0998C29.3489 21.8035 29.6453 20.3827 29.6453 18.8944ZM22.8649 29.0462C23.222 28.8982 23.3915 28.4886 23.2434 28.1315C23.0953 27.7744 22.6858 27.6049 22.3287 27.753C21.1994 28.2213 19.9606 28.4801 18.6595 28.4801C17.3585 28.4801 16.1197 28.2213 14.9904 27.753C14.6333 27.6049 14.2238 27.7744 14.0757 28.1315C13.9276 28.4886 14.097 28.8982 14.4542 29.0462C15.7504 29.5838 17.1713 29.8801 18.6595 29.8801C20.1478 29.8801 21.5687 29.5838 22.8649 29.0462ZM22.3287 10.0358C22.6858 10.1839 23.0953 10.0144 23.2434 9.65731C23.3915 9.3002 23.222 8.89066 22.8649 8.74257C21.5687 8.20503 20.1478 7.90869 18.6595 7.90869C17.1713 7.90869 15.7504 8.20503 14.4542 8.74257C14.097 8.89066 13.9276 9.3002 14.0757 9.65731C14.2238 10.0144 14.6333 10.1839 14.9904 10.0358C16.1197 9.5675 17.3585 9.30869 18.6595 9.30869C19.9606 9.30869 21.1994 9.5675 22.3287 10.0358ZM9.80092 15.2253C9.94901 14.8682 9.77956 14.4586 9.42245 14.3106C9.06534 14.1625 8.65579 14.3319 8.50771 14.689C7.97016 15.9853 7.67383 17.4061 7.67383 18.8944C7.67383 20.3827 7.97016 21.8035 8.50771 23.0998C8.65579 23.4569 9.06534 23.6263 9.42245 23.4783C9.77956 23.3302 9.94901 22.9206 9.80092 22.5635C9.33264 21.4343 9.07383 20.1954 9.07383 18.8944C9.07383 17.5934 9.33264 16.3546 9.80092 15.2253ZM14.6542 19.6698C14.6535 19.6697 14.657 19.6656 14.6666 19.6578C14.6597 19.6659 14.6548 19.6698 14.6542 19.6698ZM15.5555 19.3178C15.3927 19.3577 15.2516 19.3989 15.1313 19.4397C15.2516 19.4805 15.3927 19.5216 15.5555 19.5615C16.324 19.7498 17.4223 19.8735 18.661 19.8735C19.8997 19.8735 20.9979 19.7498 21.7665 19.5615C21.9292 19.5216 22.0704 19.4805 22.1907 19.4397C22.0704 19.3988 21.9292 19.3577 21.7665 19.3178C20.9979 19.1295 19.8997 19.0058 18.661 19.0058C17.4223 19.0058 16.324 19.1295 15.5555 19.3178ZM22.6678 19.6698C22.6671 19.6698 22.6623 19.6659 22.6553 19.6578C22.665 19.6656 22.6685 19.6697 22.6678 19.6698ZM22.6553 19.2216C22.6623 19.2134 22.6671 19.2095 22.6678 19.2096C22.6685 19.2097 22.665 19.2137 22.6553 19.2216ZM14.6666 19.2216C14.657 19.2137 14.6535 19.2097 14.6542 19.2096C14.6548 19.2095 14.6597 19.2134 14.6666 19.2216ZM18.661 17.6058C17.344 17.6058 16.1285 17.736 15.2223 17.958C14.7746 18.0677 14.3629 18.2092 14.0463 18.3926C13.7806 18.5466 13.3335 18.8759 13.3335 19.4397C13.3335 20.0034 13.7806 20.3328 14.0463 20.4867C14.3629 20.6702 14.7746 20.8116 15.2223 20.9213C16.1285 21.1434 17.344 21.2735 18.661 21.2735C19.978 21.2735 21.1934 21.1434 22.0997 20.9213C22.5473 20.8116 22.959 20.6702 23.2757 20.4867C23.5414 20.3328 23.9884 20.0034 23.9884 19.4397C23.9884 18.8759 23.5414 18.5466 23.2757 18.3926C22.959 18.2092 22.5473 18.0677 22.0997 17.958C21.1934 17.736 19.978 17.6058 18.661 17.6058Z"
      fill="url(#paint0_linear_15597_208427)"
    />
    <ellipse cx="18.6612" cy="24.3074" rx="2.79201" ry="1.13383" stroke="#7A7A7A" strokeWidth="1.4" />
    <defs>
      <linearGradient
        id="paint0_linear_15597_208427"
        x1="28.4967"
        y1="-6.36097"
        x2="17.511"
        y2="30.1221"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#FF6DD7" />
      </linearGradient>
    </defs>
  </svg>
);

export const ProposalIcon = (props) => (
  <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle
      cx="18.6588"
      cy="19.0406"
      r="10.2857"
      stroke="url(#paint0_linear_15597_208418)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="4.8 4.8"
    />
    <path
      d="M17.7638 12.5803C18.1331 11.8462 19.1811 11.8462 19.5504 12.5803L24.3867 22.1944C24.7212 22.8594 24.2378 23.6438 23.4934 23.6438H13.8208C13.0764 23.6438 12.5929 22.8594 12.9275 22.1944L17.7638 12.5803Z"
      stroke="#7A7A7A"
      strokeWidth="1.4"
    />
    <circle cx="18.6568" cy="19.3638" r="1.27394" fill="url(#paint1_linear_15597_208418)" />
    <defs>
      <linearGradient
        id="paint0_linear_15597_208418"
        x1="13.4951"
        y1="31.0933"
        x2="36.184"
        y2="9.87495"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B820FF" />
        <stop offset="1" stopColor="white" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_15597_208418"
        x1="18.0172"
        y1="20.8566"
        x2="20.8274"
        y2="18.2286"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B820FF" />
        <stop offset="1" stopColor="white" />
      </linearGradient>
    </defs>
  </svg>
);
