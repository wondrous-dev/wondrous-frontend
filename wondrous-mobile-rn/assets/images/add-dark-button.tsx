
import React from 'react'
import Svg, { Path, G } from 'react-native-svg'

const AddDarkButton = ({ style }) => (
  <Svg style={style} width={(style && style.width) || '66'} height={(style && style.height) || '66'} viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
  <G filter="url(#filter0_d)">
  <Path d="M33 46C42.9411 46 51 37.9411 51 28C51 18.0589 42.9411 10 33 10C23.0589 10 15 18.0589 15 28C15 37.9411 23.0589 46 33 46Z" fill="#2D333A"/>
  <Path fill-rule="evenodd" clip-rule="evenodd" d="M32.4936 24.2345V27.4403H29.2564C28.8386 27.4403 28.5 27.7757 28.5 28.1893C28.5 28.603 28.8386 28.9384 29.2564 28.9384H32.4936V32.1442C32.4936 32.5579 32.8323 32.8932 33.25 32.8932C33.6677 32.8932 34.0064 32.5579 34.0064 32.1442V28.9384H37.2436C37.6614 28.9384 38 28.603 38 28.1893C38 27.7757 37.6614 27.4403 37.2436 27.4403H34.0064V24.2345C34.0064 23.8208 33.6677 23.4854 33.25 23.4854C32.8323 23.4854 32.4936 23.8208 32.4936 24.2345Z" fill="white"/>
  </G>
  </Svg>

)

export default AddDarkButton
