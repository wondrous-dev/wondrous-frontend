import React from 'react'
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg'

const StandAlone = ({ style }) => (
  <Svg width={(style && style.width) || '36'} height={(style && style.width) || '36'} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <G clip-path="url(#clip0)">
  <Path d="M1.07219 9.08582L0.623765 10.5437L0.414113 11.2248C0.345712 11.447 0.553881 11.6552 0.776094 11.5868L1.45716 11.3771L2.91511 10.9287L1.07219 9.08582Z" fill="#DC8744"/>
  <Path d="M1.45628 11.3771L0.775217 11.5867C0.553004 11.6552 0.344858 11.447 0.413259 11.2248L0.622912 10.5437L1.45628 11.3771Z" fill="#3A556A"/>
  <Path d="M1.99284 10.0072L9.67102 2.32898L8.74962 1.40758L1.07144 9.08577L1.99284 10.0072Z" fill="#FCD462"/>
  <Path d="M2.91435 10.9285L10.5925 3.25037L9.67113 2.32897L1.99295 10.0071L2.91435 10.9285Z" fill="#F6C358"/>
  <Path d="M10.593 3.25023L8.75012 1.40735L9.66969 0.487779C9.78637 0.371098 9.97554 0.371098 10.0922 0.487779L11.5126 1.90815C11.6292 2.02483 11.6292 2.214 11.5126 2.33066L10.593 3.25023Z" fill="#E56353"/>
  <Path d="M9.81149 4.03104L10.1187 3.72388L8.27573 1.88097L7.96857 2.18813L9.81149 4.03104Z" fill="#EBF0F3"/>
  <Path d="M9.19698 4.64506L9.50415 4.33789L7.66124 2.49499L7.35407 2.80215L9.19698 4.64506Z" fill="#EBF0F3"/>
  </G>
  <Defs>
  <ClipPath id="clip0">
  <Rect width="11.2" height="11.2" fill="white" transform="translate(0.400024 0.400024)"/>
  </ClipPath>
  </Defs>
  </Svg>
)

export default StandAlone

