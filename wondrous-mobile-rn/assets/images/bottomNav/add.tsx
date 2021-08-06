import React from 'react'
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg'

const Add = ({ style }) => (
  <Svg width={(style && style.width) || "62"} height={(style && style.width) || "62"} viewBox="0 0 62 62" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
  <G filter="url(#filter0_d)">
  <Path d="M31 42C39.8366 42 47 34.8366 47 26C47 17.1634 39.8366 10 31 10C22.1634 10 15 17.1634 15 26C15 34.8366 22.1634 42 31 42Z" fill="#42A5F5"/>
  <Path fill-rule="evenodd" clip-rule="evenodd" d="M30.4093 25.4092V21.6324C30.4093 21.1451 30.8043 20.75 31.2917 20.75C31.7791 20.75 32.1741 21.1451 32.1741 21.6324V25.4092H35.9509C36.4383 25.4092 36.8333 25.8043 36.8333 26.2916C36.8333 26.779 36.4383 27.1741 35.9509 27.1741H32.1741V30.9509C32.1741 31.4383 31.7791 31.8333 31.2917 31.8333C30.8043 31.8333 30.4093 31.4383 30.4093 30.9509V27.1741H26.6324C26.1451 27.1741 25.75 26.779 25.75 26.2916C25.75 25.8043 26.1451 25.4092 26.6324 25.4092H30.4093Z" fill="white"/>
  </G>
  <Defs>
  {/* <filter id="filter0_d" x="0" y="0" width="62" height="62" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
  <feOffset dy="5"/>
  <feGaussianBlur stdDeviation="7.5"/>
  <feColorMatrix type="matrix" values="0 0 0 0 0.447059 0 0 0 0 0.396078 0 0 0 0 0.890196 0 0 0 0.5 0"/>
  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
  </filter> */}
  </Defs>
  </Svg>
)

export default Add

