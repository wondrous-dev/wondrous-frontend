export default function FlagIcon({ stroke = '#00BAFF', secondStroke = '', displayBackground = true, ...rest }) {
  return (
    <svg width="19" height="19" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
      <defs>
        {/* open */}
        <linearGradient id="open0" x1="1.56641" y1="1.08301" x2="1.56641" y2="10.9172" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CCBBFF" />
          <stop offset="0.473958" stopColor="#7427FF" />
          <stop offset="1" stopColor="#00BAFF" />
        </linearGradient>
        <linearGradient id="open1" x1="4.85529" y1="1.08301" x2="1.55064" y2="12.5445" gradientUnits="userSpaceOnUse">
          <stop stopColor="#CCBBFF" />
          <stop offset="0.473958" stopColor="#7427FF" />
          <stop offset="1" stopColor="#00BAFF" />
        </linearGradient>
        {/* completed */}
        <linearGradient
          id="completed0"
          x1="1.56641"
          y1="1.08301"
          x2="1.56641"
          y2="10.9172"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#06FFA5" />
        </linearGradient>
        <linearGradient
          id="completed1"
          x1="4.85529"
          y1="1.08301"
          x2="4.85529"
          y2="7.33808"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#06FFA5" />
        </linearGradient>
      </defs>

      <path
        d="M1.34961 12.4463L1.34961 9.15386L1.34961 0.973145"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.1903 4.62136C7.24335 4.08218 4.29659 8.76537 1.34961 8.22765L1.34961 0.973145C4.29659 3.93001 7.24335 1.6642 10.1903 4.62136Z"
        stroke={secondStroke || stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

{
  /* <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.06641 10.9172L1.06641 8.09505L1.06641 1.08301" stroke="url(#paint0_linear_10912_115135)" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.64417 4.21005C6.11818 3.74789 3.59239 7.76205 1.06641 7.30115L1.06641 1.08301C3.59239 3.61746 6.11818 1.67534 8.64417 4.21005Z" stroke="url(#paint1_linear_10912_115135)" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_10912_115135" x1="1.56641" y1="1.08301" x2="1.56641" y2="10.9172" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="1" stopColor="#06FFA5"/>
</linearGradient>
<linearGradient id="paint1_linear_10912_115135" x1="4.85529" y1="1.08301" x2="4.85529" y2="7.33808" gradientUnits="userSpaceOnUse">
<stop stopColor="white"/>
<stop offset="1" stopColor="#06FFA5"/>
</linearGradient>
</defs>
</svg> */
}
