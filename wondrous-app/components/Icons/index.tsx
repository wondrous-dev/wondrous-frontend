import React from 'react';

export const Requested = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="none" viewBox="0 0 29 29">
    <circle cx="14.328" cy="14.334" r="13.5" fill="#0F0F0F" stroke="#474747"></circle>
    <circle
      cx="14.328"
      cy="14.334"
      r="8"
      fill="url(#paint0_linear_4202_9359)"
      transform="rotate(45 14.328 14.334)"
    ></circle>
    <path
      fill="url(#paint1_linear_4202_9359)"
      fillRule="evenodd"
      d="M15.025 11.164a.7.7 0 10-1.4 0v1.125a.7.7 0 101.4 0v-1.125zm0 5.214a.7.7 0 10-1.4 0v1.125a.7.7 0 101.4 0v-1.125zm-3.864-2.744a.7.7 0 100 1.4h1.125a.7.7 0 100-1.4H11.16zm5.214 0a.7.7 0 100 1.4H17.5a.7.7 0 100-1.4h-1.125z"
      clipRule="evenodd"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_4202_9359"
        x1="21.492"
        x2="13.492"
        y1="-4.057"
        y2="22.51"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747"></stop>
        <stop offset="1" stopColor="#181818"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_4202_9359"
        x1="12.388"
        x2="20.924"
        y1="18.868"
        y2="10.885"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B820FF"></stop>
        <stop offset="1" stopColor="#fff"></stop>
      </linearGradient>
    </defs>
  </svg>
);

export const ToDo = (props) => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12.8652" cy="12.6401" r="11.5" fill="#0F0F0F" stroke="#474747" />
    <ellipse cx="12.8675" cy="12.6399" rx="2.52761" ry="2.52761" fill="url(#paint0_linear_9081_244359)" />
    <circle
      cx="13.0603"
      cy="12.6403"
      r="6.85714"
      stroke="url(#paint1_linear_9081_244359)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray="2.2 4"
    />
    <defs>
      <linearGradient
        id="paint0_linear_9081_244359"
        x1="15.1308"
        y1="6.82912"
        x2="12.6032"
        y2="15.2232"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747" />
        <stop offset="1" stopColor="#181818" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_9081_244359"
        x1="19.2005"
        y1="-3.12374"
        x2="12.3434"
        y2="19.6485"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#F93701" />
      </linearGradient>
    </defs>
  </svg>
);

export const TodoWithBorder = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="none" viewBox="0 0 29 29" {...props}>
    <circle cx="14.711" cy="14.633" r="13.5" fill="#0F0F0F" stroke="#474747"></circle>
    <circle cx="14.714" cy="14.633" r="2.949" fill="url(#paint0_linear_2348_556)"></circle>
    <circle
      cx="14.938"
      cy="14.633"
      r="8"
      stroke="url(#paint1_linear_2348_556)"
      strokeDasharray="2.2 4"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.4"
    ></circle>
    <defs>
      <linearGradient
        id="paint0_linear_2348_556"
        x1="17.355"
        x2="14.406"
        y1="7.853"
        y2="17.646"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747"></stop>
        <stop offset="1" stopColor="#181818"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_2348_556"
        x1="22.101"
        x2="14.101"
        y1="-3.759"
        y2="22.809"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff"></stop>
        <stop offset="1" stopColor="#F93701"></stop>
      </linearGradient>
    </defs>
  </svg>
);

export const InProgress = (props) => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.6152 12.709C23.6152 19.0603 18.4665 24.209 12.1152 24.209C5.76396 24.209 0.615234 19.0603 0.615234 12.709C0.615234 6.35771 5.76396 1.20898 12.1152 1.20898C18.4665 1.20898 23.6152 6.35771 23.6152 12.709Z"
      fill="#0F0F0F"
      stroke="#474747"
    />
    <ellipse cx="12.1116" cy="12.7083" rx="2.52761" ry="2.52761" fill="url(#paint0_linear_9081_244370)" />
    <path
      d="M12.104 5.11678C11.9366 5.11939 11.7771 5.18831 11.6605 5.30841C11.5439 5.42851 11.4797 5.58998 11.482 5.75737V8.28518C11.4808 8.36892 11.4962 8.45206 11.5275 8.52977C11.5587 8.60748 11.6051 8.67821 11.6639 8.73784C11.7227 8.79748 11.7927 8.84484 11.87 8.87716C11.9472 8.90948 12.0302 8.92613 12.1139 8.92613C12.1977 8.92613 12.2806 8.90948 12.3578 8.87716C12.4351 8.84484 12.5052 8.79748 12.564 8.73784C12.6228 8.67821 12.6691 8.60748 12.7003 8.52977C12.7316 8.45206 12.747 8.36892 12.7459 8.28518V5.75737C12.747 5.67282 12.7312 5.5889 12.6993 5.51057C12.6675 5.43225 12.6202 5.36111 12.5604 5.30138C12.5005 5.24165 12.4293 5.19453 12.3509 5.16282C12.2725 5.13111 12.1886 5.11546 12.104 5.11678ZM15.5995 6.04866C15.4861 6.04786 15.3746 6.07758 15.2767 6.13469C15.1788 6.19181 15.098 6.27421 15.0429 6.37327L13.7789 8.56165C13.7335 8.6336 13.703 8.71398 13.6894 8.79798C13.6757 8.88199 13.6792 8.96788 13.6995 9.05052C13.7199 9.13315 13.7567 9.21082 13.8079 9.27887C13.859 9.34692 13.9233 9.40394 13.997 9.44653C14.0707 9.48911 14.1522 9.51637 14.2367 9.52668C14.3212 9.53698 14.4068 9.53012 14.4886 9.5065C14.5704 9.48288 14.6465 9.44299 14.7125 9.38922C14.7785 9.33546 14.8329 9.26892 14.8725 9.19361L16.1364 7.00523C16.1936 6.9097 16.2245 6.80077 16.2261 6.68945C16.2276 6.57814 16.1997 6.46838 16.1453 6.3713C16.0908 6.27422 16.0116 6.19326 15.9158 6.1366C15.8199 6.07995 15.7108 6.04961 15.5995 6.04866ZM8.60978 6.04989C8.50022 6.05412 8.39365 6.08678 8.30053 6.14465C8.20741 6.20253 8.13095 6.28364 8.07866 6.38C8.02637 6.47637 8.00004 6.58468 8.00227 6.6943C8.00451 6.80392 8.03521 6.91107 8.09138 7.00523L9.35529 9.19361C9.39492 9.26892 9.44935 9.33546 9.51532 9.38922C9.58129 9.44299 9.65744 9.48288 9.7392 9.5065C9.82096 9.53012 9.90665 9.53698 9.99113 9.52668C10.0756 9.51637 10.1571 9.48911 10.2308 9.44653C10.3045 9.40394 10.3688 9.34692 10.42 9.27887C10.4711 9.21082 10.5079 9.13315 10.5283 9.05052C10.5486 8.96788 10.5521 8.88199 10.5384 8.79798C10.5248 8.71398 10.4943 8.6336 10.4489 8.56165L9.18496 6.37327C9.12818 6.27162 9.04442 6.18763 8.94292 6.13056C8.84143 6.0735 8.72614 6.04558 8.60978 6.04989ZM6.11036 8.59621C6.08937 8.59558 6.06836 8.59599 6.04742 8.59745C5.91117 8.60595 5.78135 8.65833 5.67735 8.74675C5.57336 8.83518 5.50079 8.9549 5.4705 9.088C5.44021 9.22111 5.45383 9.36044 5.50932 9.48516C5.56481 9.60987 5.65919 9.71327 5.77834 9.77989L7.96672 11.0438C8.03866 11.0893 8.11905 11.1197 8.20305 11.1334C8.28706 11.147 8.37295 11.1436 8.45558 11.1232C8.53822 11.1028 8.61589 11.066 8.68394 11.0149C8.75199 10.9638 8.80901 10.8994 8.85159 10.8258C8.89418 10.7521 8.92144 10.6705 8.93174 10.5861C8.94205 10.5016 8.93519 10.4159 8.91157 10.3341C8.88795 10.2524 8.84806 10.1762 8.79429 10.1103C8.74053 10.0443 8.67399 9.98985 8.59867 9.95022L6.41029 8.68632C6.31946 8.6316 6.21632 8.60061 6.11036 8.59621ZM18.1619 8.59745C18.041 8.5935 17.9214 8.62434 17.8175 8.68632L15.6291 9.95022C15.5538 9.98985 15.4873 10.0443 15.4335 10.1103C15.3798 10.1762 15.3399 10.2524 15.3162 10.3341C15.2926 10.4159 15.2858 10.5016 15.2961 10.5861C15.3064 10.6705 15.3336 10.7521 15.3762 10.8258C15.4188 10.8994 15.4758 10.9638 15.5439 11.0149C15.6119 11.066 15.6896 11.1028 15.7722 11.1232C15.8549 11.1436 15.9408 11.147 16.0248 11.1334C16.1088 11.1197 16.1891 11.0893 16.2611 11.0438L18.4495 9.77989C18.5696 9.71231 18.6643 9.60732 18.7192 9.48092C18.7742 9.35451 18.7862 9.21362 18.7537 9.07971C18.7211 8.94579 18.6457 8.82619 18.5388 8.73913C18.432 8.65207 18.2996 8.60231 18.1619 8.59745ZM5.16244 12.0769C5.0787 12.0757 4.99555 12.0912 4.91784 12.1224C4.84013 12.1536 4.76941 12.2 4.70977 12.2588C4.65013 12.3176 4.60278 12.3877 4.57045 12.4649C4.53813 12.5422 4.52148 12.6251 4.52148 12.7088C4.52148 12.7926 4.53813 12.8755 4.57045 12.9528C4.60278 13.03 4.65013 13.1001 4.70977 13.1589C4.76941 13.2177 4.84013 13.264 4.91784 13.2953C4.99555 13.3265 5.0787 13.342 5.16244 13.3408H7.69024C7.77398 13.342 7.85713 13.3265 7.93484 13.2953C8.01255 13.264 8.08327 13.2177 8.14291 13.1589C8.20255 13.1001 8.2499 13.03 8.28223 12.9528C8.31455 12.8755 8.33119 12.7926 8.33119 12.7088C8.33119 12.6251 8.31455 12.5422 8.28223 12.4649C8.2499 12.3877 8.20255 12.3176 8.14291 12.2588C8.08327 12.2 8.01255 12.1536 7.93484 12.1224C7.85713 12.0912 7.77398 12.0757 7.69024 12.0769H5.16244ZM16.5376 12.0769C16.4538 12.0757 16.3707 12.0912 16.293 12.1224C16.2153 12.1536 16.1445 12.2 16.0849 12.2588C16.0253 12.3176 15.9779 12.3877 15.9456 12.4649C15.9133 12.5422 15.8966 12.6251 15.8966 12.7088C15.8966 12.7926 15.9133 12.8755 15.9456 12.9528C15.9779 13.03 16.0253 13.1001 16.0849 13.1589C16.1445 13.2177 16.2153 13.264 16.293 13.2953C16.3707 13.3265 16.4538 13.342 16.5376 13.3408H19.0654C19.1491 13.342 19.2323 13.3265 19.31 13.2953C19.3877 13.264 19.4584 13.2177 19.518 13.1589C19.5777 13.1001 19.625 13.03 19.6574 12.9528C19.6897 12.8755 19.7063 12.7926 19.7063 12.7088C19.7063 12.6251 19.6897 12.5422 19.6574 12.4649C19.625 12.3877 19.5777 12.3176 19.518 12.2588C19.4584 12.2 19.3877 12.1536 19.31 12.1224C19.2323 12.0912 19.1491 12.0757 19.0654 12.0769H16.5376ZM15.9612 14.2838C15.9402 14.2831 15.9192 14.2836 15.8982 14.285C15.762 14.2935 15.6321 14.3459 15.5281 14.4343C15.4242 14.5227 15.3516 14.6425 15.3213 14.7756C15.291 14.9087 15.3046 15.048 15.3601 15.1727C15.4156 15.2974 15.51 15.4008 15.6291 15.4675L17.8175 16.7314C17.8895 16.7768 17.9698 16.8073 18.0538 16.8209C18.1378 16.8346 18.2237 16.8311 18.3064 16.8108C18.389 16.7904 18.4667 16.7536 18.5347 16.7024C18.6028 16.6513 18.6598 16.587 18.7024 16.5133C18.745 16.4396 18.7722 16.3581 18.7825 16.2736C18.7928 16.1892 18.786 16.1035 18.7624 16.0217C18.7387 15.9399 18.6989 15.8638 18.6451 15.7978C18.5913 15.7318 18.5248 15.6774 18.4495 15.6378L16.2611 14.3739C16.1703 14.3192 16.0671 14.2882 15.9612 14.2838ZM8.31109 14.285C8.19016 14.2811 8.07064 14.3119 7.96672 14.3739L5.77834 15.6378C5.70303 15.6774 5.63649 15.7318 5.58272 15.7978C5.52896 15.8638 5.48907 15.9399 5.46545 16.0217C5.44183 16.1035 5.43497 16.1892 5.44527 16.2736C5.45558 16.3581 5.48284 16.4396 5.52542 16.5133C5.568 16.587 5.62503 16.6513 5.69308 16.7024C5.76113 16.7536 5.8388 16.7904 5.92143 16.8108C6.00407 16.8311 6.08996 16.8346 6.17396 16.8209C6.25797 16.8073 6.33835 16.7768 6.41029 16.7314L8.59867 15.4675C8.71879 15.3999 8.81352 15.2949 8.86844 15.1685C8.92336 15.0421 8.93545 14.9012 8.90288 14.7673C8.87031 14.6334 8.79486 14.5138 8.68802 14.4267C8.58119 14.3396 8.44882 14.2899 8.31109 14.285ZM9.91195 15.8995C9.79858 15.8987 9.68708 15.9284 9.58914 15.9855C9.4912 16.0426 9.41043 16.125 9.35529 16.2241L8.09138 18.4124C8.04592 18.4844 8.01545 18.5648 8.0018 18.6488C7.98816 18.7328 7.99162 18.8187 8.01198 18.9013C8.03234 18.9839 8.06918 19.0616 8.12029 19.1297C8.17141 19.1977 8.23573 19.2547 8.30942 19.2973C8.3831 19.3399 8.46463 19.3672 8.54911 19.3775C8.63359 19.3878 8.71928 19.3809 8.80104 19.3573C8.8828 19.3337 8.95895 19.2938 9.02493 19.24C9.0909 19.1863 9.14533 19.1197 9.18496 19.0444L10.4489 16.856C10.506 16.7605 10.537 16.6516 10.5385 16.5402C10.5401 16.4289 10.5122 16.3192 10.4577 16.2221C10.4032 16.125 10.324 16.0441 10.2282 15.9874C10.1324 15.9307 10.0233 15.9004 9.91195 15.8995ZM14.2973 15.9007C14.1878 15.9049 14.0812 15.9376 13.9881 15.9955C13.895 16.0533 13.8185 16.1344 13.7662 16.2308C13.7139 16.3272 13.6876 16.4355 13.6898 16.5451C13.6921 16.6547 13.7228 16.7619 13.7789 16.856L15.0429 19.0444C15.0825 19.1197 15.1369 19.1863 15.2029 19.24C15.2689 19.2938 15.345 19.3337 15.4268 19.3573C15.5085 19.3809 15.5942 19.3878 15.6787 19.3775C15.7632 19.3672 15.8447 19.3399 15.9184 19.2973C15.9921 19.2547 16.0564 19.1977 16.1075 19.1297C16.1586 19.0616 16.1955 18.9839 16.2158 18.9013C16.2362 18.8187 16.2397 18.7328 16.226 18.6488C16.2124 18.5648 16.1819 18.4844 16.1364 18.4124L14.8725 16.2241C14.8157 16.1224 14.732 16.0384 14.6305 15.9814C14.529 15.9243 14.4137 15.8964 14.2973 15.9007ZM12.104 16.4919C11.9366 16.4945 11.7771 16.5634 11.6605 16.6835C11.5439 16.8036 11.4797 16.9651 11.482 17.1325V19.6603C11.4808 19.744 11.4962 19.8272 11.5275 19.9049C11.5587 19.9826 11.6051 20.0533 11.6639 20.113C11.7227 20.1726 11.7927 20.22 11.87 20.2523C11.9472 20.2846 12.0302 20.3013 12.1139 20.3013C12.1977 20.3013 12.2806 20.2846 12.3578 20.2523C12.4351 20.22 12.5052 20.1726 12.564 20.113C12.6228 20.0533 12.6691 19.9826 12.7003 19.9049C12.7316 19.8272 12.747 19.744 12.7459 19.6603V17.1325C12.747 17.048 12.7312 16.964 12.6993 16.8857C12.6675 16.8074 12.6202 16.7362 12.5604 16.6765C12.5005 16.6168 12.4293 16.5697 12.3509 16.538C12.2725 16.5062 12.1886 16.4906 12.104 16.4919Z"
      fill="url(#paint1_linear_9081_244370)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_9081_244370"
        x1="14.3749"
        y1="6.89748"
        x2="11.8473"
        y2="15.2916"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747" />
        <stop offset="1" stopColor="#181818" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_9081_244370"
        x1="12.1139"
        y1="5.1167"
        x2="12.1139"
        y2="20.3013"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#FFD653" />
      </linearGradient>
    </defs>
  </svg>
);

export const Approved = (props) => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12.25" cy="12.7095" r="11.5" fill="#1C1C1C" stroke="#474747" />
      <ellipse cx="12.2469" cy="12.7093" rx="6.85632" ry="6.85632" fill="url(#paint0_linear_9092_245040)" />
      <path
        d="M12.2491 5.85449C10.4898 5.85449 8.73103 6.52263 7.39643 7.85723C4.72723 10.5264 4.72723 14.8934 7.39643 17.5626C10.0656 20.2318 14.4326 20.2318 17.1018 17.5626C19.771 14.8934 19.771 10.5264 17.1018 7.85723C15.7672 6.52263 14.0084 5.85449 12.2491 5.85449ZM12.2491 7.22584C13.6566 7.22584 15.0636 7.76015 16.1313 8.82777C18.2665 10.963 18.2665 14.4568 16.1313 16.5921C13.9954 18.7273 10.5022 18.7273 8.36697 16.5921C6.23175 14.4561 6.23175 10.963 8.36697 8.82777C9.43492 7.76015 10.8417 7.22584 12.2491 7.22584Z"
        fill="#06FFA5"
      />
      <path
        d="M10.5972 15.2197L8.88103 13.5035C8.58914 13.2116 8.58914 12.7371 8.88103 12.4452C9.17292 12.1533 9.64743 12.1533 9.93932 12.4452L11.1263 13.6322L14.5587 10.1999C14.8506 9.90798 15.3251 9.90798 15.617 10.1999C15.9089 10.4918 15.9089 10.9663 15.617 11.2582L11.6555 15.2197C11.3636 15.5116 10.8891 15.5116 10.5972 15.2197Z"
        fill="#06FFA5"
      />
      <defs>
        <linearGradient
          id="paint0_linear_9092_245040"
          x1="18.3865"
          y1="-3.05285"
          x2="11.5301"
          y2="19.7167"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#474747" />
          <stop offset="1" stopColor="#181818" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const Rejected = () => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12.918" cy="12.7095" r="11.5" fill="#1C1C1C" stroke="#474747" />
    <ellipse cx="12.9169" cy="12.7093" rx="6.85632" ry="6.85632" fill="url(#paint0_linear_9092_245051)" />
    <path
      d="M12.9177 5.85205C11.1578 5.85205 9.39829 6.52044 8.06319 7.85554C5.393 10.5257 5.393 14.8943 8.06319 17.5645C10.7334 20.2347 15.102 20.2347 17.7722 17.5645C20.4424 14.8943 20.4424 10.5257 17.7722 7.85554C16.4371 6.52044 14.6776 5.85205 12.9177 5.85205ZM12.9177 7.22391C14.3257 7.22391 15.7333 7.75842 16.8013 8.82643C18.9373 10.9625 18.9373 14.4576 16.8013 16.5936C14.6646 18.7296 11.1701 18.7296 9.03409 16.5936C6.89807 14.4569 6.89807 10.9625 9.03409 8.82643C10.1024 7.75842 11.5097 7.22391 12.9177 7.22391ZM10.5387 9.62702C10.3688 9.62702 10.1988 9.70005 10.0533 9.84561C9.76215 10.1367 9.76215 10.5254 10.0533 10.8165L11.9468 12.71L10.0533 14.6036C9.76215 14.8947 9.76215 15.2833 10.0533 15.5745C10.3444 15.8656 10.733 15.8656 11.0242 15.5745L12.9177 13.6809L14.8112 15.5745C15.1023 15.8656 15.491 15.8656 15.7821 15.5745C16.0732 15.2833 16.0732 14.8947 15.7821 14.6036L13.8886 12.71L15.7821 10.8165C16.0732 10.5254 16.0732 10.1367 15.7821 9.84561C15.491 9.55449 15.1023 9.55449 14.8112 9.84561L12.9177 11.7391L11.0242 9.84561C10.8786 9.70005 10.7087 9.62702 10.5387 9.62702Z"
      fill="#F93701"
    />
    <defs>
      <linearGradient
        id="paint0_linear_9092_245051"
        x1="19.0564"
        y1="-3.05285"
        x2="12.2"
        y2="19.7167"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747" />
        <stop offset="1" stopColor="#181818" />
      </linearGradient>
    </defs>
  </svg>
);
export const MembershipRequest = (props) => (
  <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14.5703" cy="14.2695" r="13.5" fill="#0F0F0F" stroke="#474747" />
    <circle cx="14.5703" cy="14.2695" r="8" fill="url(#paint0_linear_2374_11665)" />
    <circle
      cx="14.5727"
      cy="14.269"
      r="2.79144"
      stroke="url(#paint1_linear_2374_11665)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="14.5728" cy="8.6275" r="0.84625" fill="url(#paint2_linear_2374_11665)" />
    <circle cx="14.5728" cy="19.9112" r="0.84625" fill="url(#paint3_linear_2374_11665)" />
    <defs>
      <linearGradient
        id="paint0_linear_2374_11665"
        x1="21.7339"
        y1="-4.1219"
        x2="13.7339"
        y2="22.4457"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747" />
        <stop offset="1" stopColor="#181818" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2374_11665"
        x1="17.0723"
        y1="7.85166"
        x2="14.2808"
        y2="17.1219"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#FF6DD7" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_2374_11665"
        x1="15.3306"
        y1="6.68203"
        x2="14.4843"
        y2="9.49239"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#FF6DD7" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_2374_11665"
        x1="15.3306"
        y1="17.9657"
        x2="14.4843"
        y2="20.7761"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#FF6DD7" />
      </linearGradient>
    </defs>
  </svg>
);

export const Proposal = (props) => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12.584" cy="12.7095" r="11.5" fill="#0F0F0F" stroke="#474747" />
    <circle
      cx="12.584"
      cy="12.7097"
      r="6.85714"
      transform="rotate(45 12.584 12.7097)"
      fill="url(#paint0_linear_9092_243957)"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.2839 9.99248C13.2839 9.60588 12.9705 9.29248 12.5839 9.29248C12.1973 9.29248 11.8839 9.60588 11.8839 9.99248V10.9565C11.8839 11.3431 12.1973 11.6565 12.5839 11.6565C12.9705 11.6565 13.2839 11.3431 13.2839 10.9565V9.99248ZM13.2839 14.462C13.2839 14.0754 12.9705 13.762 12.5839 13.762C12.1973 13.762 11.8839 14.0754 11.8839 14.462V15.426C11.8839 15.8126 12.1973 16.126 12.5839 16.126C12.9705 16.126 13.2839 15.8126 13.2839 15.426V14.462ZM9.87187 12.0096C9.48528 12.0096 9.17188 12.323 9.17188 12.7096C9.17188 13.0962 9.48528 13.4096 9.87187 13.4096H10.8359C11.2225 13.4096 11.5359 13.0962 11.5359 12.7096C11.5359 12.323 11.2225 12.0096 10.8359 12.0096H9.87187ZM14.3414 12.0096C13.9548 12.0096 13.6414 12.323 13.6414 12.7096C13.6414 13.0962 13.9548 13.4096 14.3414 13.4096H15.3054C15.692 13.4096 16.0054 13.0962 16.0054 12.7096C16.0054 12.323 15.692 12.0096 15.3054 12.0096H14.3414Z"
      fill="url(#paint1_linear_9092_243957)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_9092_243957"
        x1="18.7242"
        y1="-3.05441"
        x2="11.8671"
        y2="19.7178"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747" />
        <stop offset="1" stopColor="#181818" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_9092_243957"
        x1="10.8733"
        y1="16.713"
        x2="18.4102"
        y2="9.66455"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#B820FF" />
        <stop offset="1" stopColor="white" />
      </linearGradient>
    </defs>
  </svg>
);

export const Archived = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="11.5714" fill="#0F0F0F" stroke="#474747" strokeWidth="0.857143" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.73633 17.748V10.1447H5.56445V7.21973H18.4343V10.1447H17.2662V17.748H6.73633Z"
      fill="url(#paint0_linear_10461_243640)"
    />
    <path
      d="M17.2662 10.1421V17.747H6.73633V10.1421"
      stroke="#7A7A7A"
      strokeWidth="0.857143"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.8573 12.0769C13.7188 12.081 13.5874 12.1389 13.4908 12.2383L11.2025 14.5266L10.5133 13.8374C10.4642 13.7862 10.4054 13.7454 10.3403 13.7172C10.2752 13.6891 10.2051 13.6742 10.1342 13.6735C10.0633 13.6728 9.99295 13.6862 9.9273 13.713C9.86164 13.7398 9.80199 13.7795 9.75184 13.8296C9.70169 13.8798 9.66206 13.9394 9.63525 14.0051C9.60844 14.0707 9.59501 14.1411 9.59573 14.212C9.59645 14.2829 9.61132 14.353 9.63945 14.4181C9.66759 14.4832 9.70843 14.542 9.75959 14.5911L10.8257 15.6572C10.9256 15.7571 11.0612 15.8133 11.2025 15.8133C11.3439 15.8133 11.4794 15.7571 11.5794 15.6572L14.2446 12.992C14.3216 12.9171 14.3742 12.8207 14.3955 12.7155C14.4168 12.6102 14.4058 12.5009 14.364 12.402C14.3221 12.3031 14.2513 12.2191 14.1609 12.1611C14.0705 12.1031 13.9647 12.0737 13.8573 12.0769Z"
      fill="#7A7A7A"
    />
    <path
      d="M18.4343 7.21875H5.56445V10.1437H18.4343V7.21875Z"
      stroke="#7A7A7A"
      strokeWidth="0.857143"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_10461_243640"
        x1="17.7615"
        y1="5.3201"
        x2="17.4007"
        y2="10.5925"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747" />
        <stop offset="1" stopColor="#181818" />
      </linearGradient>
    </defs>
  </svg>
);

export const InProgressWithBorder = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="none" viewBox="0 0 29 29" {...props}>
    <circle cx="14.695" cy="14.681" r="13.5" fill="#0F0F0F" stroke="#474747"></circle>
    <circle cx="14.695" cy="14.68" r="2.949" fill="url(#paint0_linear_4216_52108)"></circle>
    <path
      fill="url(#paint1_linear_4216_52108)"
      d="M14.682 5.823a.737.737 0 00-.726.747v2.95a.738.738 0 101.475 0V6.57a.738.738 0 00-.749-.747zM18.76 6.91a.737.737 0 00-.65.379l-1.474 2.553a.738.738 0 101.276.737l1.475-2.553a.737.737 0 00-.627-1.116zm-8.154.001A.738.738 0 0010 8.026l1.474 2.553a.737.737 0 101.276-.737l-1.474-2.553a.738.738 0 00-.671-.378zM7.69 9.882c-.025 0-.05 0-.074.002a.737.737 0 00-.314 1.38l2.553 1.474a.738.738 0 10.738-1.276L8.04 9.987a.737.737 0 00-.35-.105zm14.06.002a.737.737 0 00-.402.103l-2.553 1.475a.737.737 0 10.737 1.276l2.553-1.475a.737.737 0 00-.335-1.38zM6.584 13.943a.736.736 0 00-.69 1.022.737.737 0 00.69.453h2.949a.736.736 0 00.528-1.263.736.736 0 00-.528-.212h-2.95zm13.27 0a.736.736 0 100 1.475h2.95a.736.736 0 100-1.475h-2.95zm-.672 2.575a.737.737 0 00-.387 1.38l2.553 1.475a.738.738 0 10.737-1.276l-2.553-1.474a.737.737 0 00-.35-.105zm-8.925.001a.738.738 0 00-.402.104l-2.553 1.474a.736.736 0 10.738 1.276l2.553-1.474a.737.737 0 00-.336-1.38zm1.868 1.884a.738.738 0 00-.65.378l-1.474 2.553a.738.738 0 101.276.738l1.474-2.553a.737.737 0 00-.626-1.116zm5.116.001a.737.737 0 00-.605 1.115l1.475 2.553a.737.737 0 101.276-.738l-1.475-2.553a.737.737 0 00-.67-.377zm-2.559.69a.738.738 0 00-.726.747v2.95a.738.738 0 101.475 0v-2.95a.737.737 0 00-.749-.747z"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_4216_52108"
        x1="17.336"
        x2="14.387"
        y1="7.901"
        y2="17.694"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747"></stop>
        <stop offset="1" stopColor="#181818"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_4216_52108"
        x1="14.694"
        x2="14.694"
        y1="5.823"
        y2="23.538"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff"></stop>
        <stop offset="1" stopColor="#FFD653"></stop>
      </linearGradient>
    </defs>
  </svg>
);

export const InReview = (props) => (
  <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="14.2542" cy="14.1227" r="13.5" fill="#0F0F0F" stroke="#474747" />
    <circle cx="11.1464" cy="14.1227" r="0.990845" fill="url(#paint0_linear_509_3000)" />
    <circle cx="14.2548" cy="14.1227" r="0.990845" fill="url(#paint1_linear_509_3000)" />
    <circle cx="17.3632" cy="14.1227" r="0.990845" fill="url(#paint2_linear_509_3000)" />
    <circle
      cx="14.2542"
      cy="14.1227"
      r="8"
      stroke="url(#paint3_linear_509_3000)"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeDasharray="3.2 3.2"
    />
    <defs>
      <linearGradient
        id="paint0_linear_509_3000"
        x1="11.1464"
        y1="13.1318"
        x2="11.1464"
        y2="15.1135"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#00BAFF" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_509_3000"
        x1="14.2548"
        y1="13.1318"
        x2="14.2548"
        y2="15.1135"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#00BAFF" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_509_3000"
        x1="17.3632"
        y1="13.1318"
        x2="17.3632"
        y2="15.1135"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#00BAFF" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_509_3000"
        x1="14.2542"
        y1="6.12268"
        x2="14.2542"
        y2="22.1227"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#00BAFF" />
      </linearGradient>
    </defs>
  </svg>
);

export const Done = (props) => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12.6152" cy="12.7095" r="11.5" fill="#0F0F0F" stroke="#474747" />
    <ellipse cx="12.8094" cy="12.7089" rx="6.85632" ry="6.85632" fill="url(#paint0_linear_9081_244391)" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.41758 12.7106C6.41758 9.2871 9.19286 6.51182 12.6163 6.51182C16.0398 6.51182 18.8151 9.2871 18.8151 12.7106C18.8151 16.1341 16.0398 18.9093 12.6163 18.9093C9.19286 18.9093 6.41758 16.1341 6.41758 12.7106ZM12.6163 5.11182C8.41966 5.11182 5.01758 8.5139 5.01758 12.7106C5.01758 16.9073 8.41966 20.3093 12.6163 20.3093C16.813 20.3093 20.2151 16.9073 20.2151 12.7106C20.2151 8.5139 16.813 5.11182 12.6163 5.11182ZM14.8039 10.2019C14.9458 10.0559 15.139 9.97084 15.3425 9.96478C15.5003 9.96013 15.6559 10.0033 15.7887 10.0885C15.9216 10.1738 16.0256 10.2972 16.0872 10.4426C16.1487 10.588 16.1649 10.7485 16.1335 10.9033C16.1022 11.058 16.0249 11.1997 15.9117 11.3097L11.9947 15.2268C11.8477 15.3737 11.6485 15.4562 11.4408 15.4562C11.233 15.4562 11.0338 15.3737 10.8869 15.2268L9.32005 13.66C9.24486 13.5878 9.18484 13.5013 9.14348 13.4056C9.10213 13.31 9.08029 13.207 9.07923 13.1028C9.07817 12.9985 9.09791 12.8952 9.13731 12.7987C9.17671 12.7022 9.23496 12.6145 9.30866 12.5408C9.38237 12.4671 9.47003 12.4088 9.56653 12.3694C9.66303 12.33 9.76642 12.3103 9.87065 12.3114C9.97487 12.3124 10.0778 12.3343 10.1735 12.3756C10.2692 12.417 10.3557 12.477 10.4278 12.5522L11.4408 13.5651L14.8039 10.2019Z"
      fill="url(#paint1_linear_9081_244391)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_9081_244391"
        x1="18.949"
        y1="-3.05333"
        x2="12.0926"
        y2="19.7162"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747" />
        <stop offset="1" stopColor="#181818" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_9081_244391"
        x1="12.6163"
        y1="5.11182"
        x2="12.6163"
        y2="20.3093"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#06FFA5" />
      </linearGradient>
    </defs>
  </svg>
);

export const DoneWithBorder = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props?.style?.width || '29'}
    height={props?.style?.height || '29'}
    fill="none"
    viewBox="0 0 29 29"
    {...props}
  >
    <path
      fill="#0F0F0F"
      stroke="#474747"
      d="M28.25 14.681c0 7.456-6.044 13.5-13.5 13.5s-13.5-6.044-13.5-13.5 6.044-13.5 13.5-13.5 13.5 6.044 13.5 13.5z"
    ></path>
    <circle cx="14.976" cy="14.68" r="7.999" fill="url(#paint0_linear_4216_52139)"></circle>
    <path
      fill="url(#paint1_linear_4216_52139)"
      fillRule="evenodd"
      d="M7.404 14.682a7.349 7.349 0 1114.697 0 7.349 7.349 0 01-14.697 0zm7.348-8.748a8.749 8.749 0 100 17.497 8.749 8.749 0 000-17.497zm2.555 5.822a.914.914 0 111.292 1.292l-4.57 4.57a.914.914 0 01-1.292 0l-1.828-1.828a.913.913 0 111.292-1.292l1.182 1.182 3.924-3.924z"
      clipRule="evenodd"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_4216_52139"
        x1="22.138"
        x2="14.139"
        y1="-3.709"
        y2="22.855"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747"></stop>
        <stop offset="1" stopColor="#181818"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_4216_52139"
        x1="14.752"
        x2="14.752"
        y1="5.934"
        y2="23.431"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff"></stop>
        <stop offset="1" stopColor="#06FFA5"></stop>
      </linearGradient>
    </defs>
  </svg>
);

export const WonderCoin = (props) => (
  <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_f_498_14326)">
      <path
        d="M13.5222 9.21905C13.6193 9.18669 13.684 9.12198 13.7002 9.0411H13.7163C13.7163 9.02492 13.7163 9.02492 13.7163 9.00874C13.7163 8.99256 13.7163 8.99256 13.7163 8.97638H13.7002C13.684 8.89549 13.6193 8.83079 13.5222 8.79843C11.2412 8.15133 9.44545 6.35561 8.78217 4.07457C8.74981 3.96132 8.65275 3.89661 8.55568 3.89661C8.45862 3.89661 8.36155 3.96132 8.3292 4.07457C7.66591 6.35561 5.87019 8.15133 3.58915 8.79843C3.49208 8.83079 3.42738 8.89549 3.4112 8.97638H3.39502C3.39502 8.99256 3.39502 8.99256 3.39502 9.00874C3.39502 9.02492 3.39502 9.02492 3.39502 9.0411H3.4112C3.42738 9.12198 3.49208 9.18669 3.58915 9.21905C5.87019 9.86615 7.66591 11.6619 8.3292 13.9429C8.36155 14.0562 8.45862 14.1209 8.55568 14.1209C8.65275 14.1209 8.74981 14.0562 8.78217 13.9429C9.44545 11.678 11.2412 9.88233 13.5222 9.21905Z"
        fill="#FFD653"
      />
    </g>
    <path
      d="M13.5222 9.21905C13.6193 9.18669 13.684 9.12198 13.7002 9.0411H13.7163C13.7163 9.02492 13.7163 9.02492 13.7163 9.00874C13.7163 8.99256 13.7163 8.99256 13.7163 8.97638H13.7002C13.684 8.89549 13.6193 8.83079 13.5222 8.79843C11.2412 8.15133 9.44545 6.35561 8.78217 4.07457C8.74981 3.96132 8.65275 3.89661 8.55568 3.89661C8.45862 3.89661 8.36155 3.96132 8.3292 4.07457C7.66591 6.35561 5.87019 8.15133 3.58915 8.79843C3.49208 8.83079 3.42738 8.89549 3.4112 8.97638H3.39502C3.39502 8.99256 3.39502 8.99256 3.39502 9.00874C3.39502 9.02492 3.39502 9.02492 3.39502 9.0411H3.4112C3.42738 9.12198 3.49208 9.18669 3.58915 9.21905C5.87019 9.86615 7.66591 11.6619 8.3292 13.9429C8.36155 14.0562 8.45862 14.1209 8.55568 14.1209C8.65275 14.1209 8.74981 14.0562 8.78217 13.9429C9.44545 11.678 11.2412 9.88233 13.5222 9.21905Z"
      fill="#FFD653"
    />
    <defs>
      <filter
        id="filter0_f_498_14326"
        x="0.39502"
        y="0.896606"
        width="16.3213"
        height="16.2242"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="1.5" result="effect1_foregroundBlur_498_14326" />
      </filter>
    </defs>
  </svg>
);

export const AwaitingPayment = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="none" viewBox="0 0 29 29">
    <circle cx="14.339" cy="14.244" r="13.5" fill="#0F0F0F" stroke="#474747"></circle>
    <circle cx="14.565" cy="14.243" r="7.999" fill="url(#paint0_linear_3018_59417)"></circle>
    <path
      fill="url(#paint1_linear_3018_59417)"
      fillRule="evenodd"
      d="M11.657 11.332a.99.99 0 11-1.401-1.401.99.99 0 011.401 1.4zm7.219 7.224a.99.99 0 11-1.402-1.4.99.99 0 011.402 1.4zm-1.397-8.625a.99.99 0 101.402 1.402.99.99 0 00-1.402-1.402zm-7.226 8.624a.99.99 0 111.4-1.4.99.99 0 01-1.4 1.4zm6.734-4.298c-.008.038-.038.069-.084.084a3.287 3.287 0 00-2.231 2.223.112.112 0 01-.107.084.112.112 0 01-.106-.084 3.259 3.259 0 00-2.232-2.223c-.045-.015-.076-.046-.083-.084h-.008v-.03h.008c.007-.038.038-.069.083-.084a3.26 3.26 0 002.232-2.224.112.112 0 01.106-.083c.046 0 .091.03.107.083a3.259 3.259 0 002.23 2.224c.047.015.077.046.085.084h.007v.03h-.007z"
      clipRule="evenodd"
    ></path>
    <defs>
      <linearGradient
        id="paint0_linear_3018_59417"
        x1="21.727"
        x2="13.728"
        y1="-4.147"
        y2="22.418"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747"></stop>
        <stop offset="1" stopColor="#181818"></stop>
      </linearGradient>
      <linearGradient
        id="paint1_linear_3018_59417"
        x1="14.567"
        x2="14.567"
        y1="9.64"
        y2="18.846"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#fff"></stop>
        <stop offset="1" stopColor="#06FFA5"></stop>
      </linearGradient>
    </defs>
  </svg>
);

export const Paid = (props) => (
  <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="14.5703" cy="14.2695" r="13.5" fill="#0F0F0F" stroke="#474747" />
    <circle cx="14.7959" cy="14.2686" r="7.99904" fill="url(#paint0_linear_2374_11729)" />
    <circle cx="14.572" cy="14.2712" r="8.04856" stroke="url(#paint1_linear_2374_11729)" strokeWidth="1.4" />
    <path
      d="M17.6556 13.3343C17.4388 13.3408 17.2331 13.4314 17.0819 13.587L13.4997 17.1691L12.4209 16.0902C12.344 16.0102 12.2519 15.9462 12.15 15.9022C12.0481 15.8581 11.9384 15.8349 11.8274 15.8337C11.7164 15.8326 11.6062 15.8536 11.5035 15.8956C11.4007 15.9376 11.3073 15.9996 11.2288 16.0781C11.1503 16.1566 11.0882 16.25 11.0463 16.3528C11.0043 16.4556 10.9833 16.5657 10.9844 16.6767C10.9855 16.7877 11.0088 16.8974 11.0529 16.9993C11.0969 17.1012 11.1608 17.1933 11.2409 17.2702L12.9098 18.939C13.0663 19.0955 13.2785 19.1833 13.4997 19.1833C13.721 19.1833 13.9332 19.0955 14.0897 18.939L18.2619 14.7669C18.3824 14.6497 18.4648 14.4988 18.4981 14.334C18.5315 14.1692 18.5142 13.9981 18.4487 13.8433C18.3832 13.6884 18.2724 13.5569 18.1309 13.4661C17.9893 13.3753 17.8237 13.3294 17.6556 13.3343Z"
      fill="url(#paint2_linear_2374_11729)"
    />
    <path
      d="M15.9093 12.1366C15.96 12.1197 15.9938 12.086 16.0022 12.0438H16.0106C16.0106 12.0353 16.0106 12.0353 16.0106 12.0269C16.0106 12.0184 16.0106 12.0184 16.0106 12.01H16.0022C15.9938 11.9678 15.96 11.934 15.9093 11.9171C14.7191 11.5795 13.7821 10.6425 13.436 9.45223C13.4191 9.39314 13.3685 9.35938 13.3178 9.35938C13.2672 9.35938 13.2165 9.39314 13.1996 9.45223C12.8535 10.6425 11.9165 11.5795 10.7263 11.9171C10.6756 11.934 10.6419 11.9678 10.6334 12.01H10.625C10.625 12.0184 10.625 12.0184 10.625 12.0269C10.625 12.0353 10.625 12.0353 10.625 12.0438H10.6334C10.6419 12.086 10.6756 12.1197 10.7263 12.1366C11.9165 12.4743 12.8535 13.4113 13.1996 14.6015C13.2165 14.6606 13.2672 14.6944 13.3178 14.6944C13.3685 14.6944 13.4191 14.6606 13.436 14.6015C13.7821 13.4197 14.7191 12.4827 15.9093 12.1366Z"
      fill="url(#paint3_linear_2374_11729)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_2374_11729"
        x1="21.9587"
        y1="-4.12065"
        x2="13.9596"
        y2="22.4438"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#474747" />
        <stop offset="1" stopColor="#181818" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_2374_11729"
        x1="14.572"
        y1="6.22266"
        x2="14.572"
        y2="22.3198"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#06FFA5" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_2374_11729"
        x1="14.7495"
        y1="13.334"
        x2="14.7495"
        y2="19.1833"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#06FFA5" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_2374_11729"
        x1="13.3178"
        y1="9.35938"
        x2="13.3178"
        y2="14.6944"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#06FFA5" />
      </linearGradient>
    </defs>
  </svg>
);

export const PendingApplication = (props) => {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12.1445" cy="12.8691" r="12" fill="#0F0F0F" />
      <path
        d="M12.1241 6.01416C10.3648 6.01416 8.60603 6.6823 7.27143 8.0169C4.60223 10.6861 4.60223 15.0531 7.27143 17.7223C9.94063 20.3915 14.3076 20.3915 16.9768 17.7223C19.646 15.0531 19.646 10.6861 16.9768 8.0169C15.6422 6.6823 13.8834 6.01416 12.1241 6.01416ZM12.1241 7.38551C13.5316 7.38551 14.9386 7.91982 16.0063 8.98743C18.1415 11.1227 18.1415 14.6165 16.0063 16.7517C13.8703 18.8869 10.3772 18.8869 8.24197 16.7517C6.10674 14.6158 6.10674 11.1227 8.24197 8.98743C9.30992 7.91982 10.7167 7.38551 12.1241 7.38551Z"
        fill="url(#paint0_linear_11913_269959)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_11913_269959"
          x1="12.1241"
          y1="6.01416"
          x2="12.1241"
          y2="19.7242"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#00BAFF" />
        </linearGradient>
      </defs>
    </svg>
  );
};
