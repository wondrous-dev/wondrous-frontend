import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-web-swiper'
import { White } from '../../../constants/Colors'
import { spacingUnit } from '../../../utils/common'
import { SafeImage } from '../Image'

import { Title, Subheading, Paragraph } from '../Text'

export class MyCarousel extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      entries: this.props.data,
      activeSlide: 0
    }
    
  }

  render () {
    const {
      activeDotColor,
      passiveDotColor,
      images,
      containerStyle
    } = this.props
      return (
        <View style={{
          height: images ? 400: 150, 
          width: '100%',
          alignContent: 'center',
          justifyContent: 'center',
          marginTop: 24,
        ...containerStyle
        }}>

          <Swiper
          from={0}
            controlsProps={{
              dotsTouchable: true,
              prevPos: false,
              nextPos: false,
              dotActiveStyle: {
                backgroundColor: activeDotColor && this.state.entries.length > 1 ? activeDotColor : 'white'
              },
              dotProps: {
                badgeStyle: {
                  backgroundColor: passiveDotColor || 'rgba(255,255,255, 0.3)'
                }
              }
            }}
          >
            {
              this.state.entries.map(item => {
                if (images) {
                  return <SafeImage src={item} style={{
                    flex: 1,
                    // height: 500,
                    borderRadius: 8,
                    marginBottom: spacingUnit * 4
                  }}/>
                }
                return (
                  <View key={item.subheading} style={{flex: 1}}>
                  <Subheading style={{textAlign: 'center'}}>{item.subheading}</Subheading>
                  <Paragraph color={White} style={{textAlign: 'center', marginTop: 8}}>{item.paragraph}</Paragraph>
                </View>
                )
              })
            }
          </Swiper>
        </View>
      )
  }
}