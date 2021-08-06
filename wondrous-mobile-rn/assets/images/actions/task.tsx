
import React from 'react'
import Svg, { Path, Defs, ClipPath, Rect, G } from 'react-native-svg'

const Task = ({ style }) => (
  <Svg width={(style && style.width) || "18"} height={(style && style.height) || "18"} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
  <G clip-Path="url(#clip0)">
  <Path d="M1.07987 13.9593L0.359187 16.3024L0.022245 17.397C-0.0876851 17.7541 0.246873 18.0887 0.604001 17.9787L1.69857 17.6418L4.04171 16.9211L1.07987 13.9593Z" fill="#DC8744"/>
  <Path d="M1.69756 17.6418L0.602988 17.9787C0.24586 18.0886 -0.0886598 17.7541 0.0212703 17.397L0.358212 16.3024L1.69756 17.6418Z" fill="#3A556A"/>
  <Path d="M2.55997 15.4401L14.8999 3.10011L13.4191 1.6193L1.07915 13.9592L2.55997 15.4401Z" fill="#FCD462"/>
  <Path d="M4.04093 16.9208L16.3809 4.58089L14.9 3.10008L2.56011 15.44L4.04093 16.9208Z" fill="#F6C358"/>
  <Path d="M16.3817 4.58055L13.4199 1.61878L14.8978 0.140892C15.0853 -0.046631 15.3893 -0.046631 15.5768 0.140892L17.8596 2.42362C18.0471 2.61115 18.0471 2.91518 17.8596 3.10266L16.3817 4.58055Z" fill="#E56353"/>
  <Path d="M15.126 5.83565L15.6196 5.34199L12.6578 2.38017L12.1641 2.87383L15.126 5.83565Z" fill="#EBF0F3"/>
  <Path d="M14.1387 6.82244L14.6323 6.32878L11.6705 3.36697L11.1768 3.86063L14.1387 6.82244Z" fill="#EBF0F3"/>
  </G>
  <Defs>
  <ClipPath id="clip0">
  <Rect width="18" height="18" fill="white"/>
  </ClipPath>
  </Defs>
  </Svg>
)

export default Task
