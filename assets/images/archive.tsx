
import React from 'react'
import Svg, { Path } from 'react-native-svg'

const Archive = ({ style }) => (
  <Svg width={(style && style.width) || '24'} height={(style && style.height) || '24'} style={style} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <Path d="M38.0117 13.2254V37.5029C38.0117 38.3352 37.3181 38.9826 36.5319 38.9826H3.51461C2.68224 38.9826 2.03484 38.289 2.03484 37.5029V13.2254H38.0117ZM12.5319 22.5202C12.5319 23.3526 13.2256 24 14.0117 24H26.0348C26.8672 24 27.5146 23.3063 27.5146 22.5202V19.5144C27.5146 18.682 26.821 18.0347 26.0348 18.0347H14.0117C13.1793 18.0347 12.5319 18.7283 12.5319 19.5144V22.5202Z" fill="#2D333A" fill-opacity="0.54"/>
  <Path d="M1.52601 1.01733H38.5202C39.3526 1.01733 40 1.71098 40 2.4971V11.237H0V2.54335C0.0462418 1.71098 0.693642 1.01733 1.52601 1.01733Z" fill="#2D333A" fill-opacity="0.54"/>
  </Svg>
)

export default Archive
