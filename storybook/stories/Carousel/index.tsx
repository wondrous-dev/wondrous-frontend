import * as React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Swiper from 'react-native-web-swiper'
import { White } from '../../../constants/Colors'

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
      return (
        <View style={{height: 150, width: '100%', alignContent: 'center', justifyContent: 'center', marginTop: 24}}>

          <Swiper
          from={0}
            controlsProps={{
              dotsTouchable: true,
              prevPos: false,
              nextPos: false,
              dotActiveStyle: {
                backgroundColor: 'white'
              },
              dotProps: {
                badgeStyle: {
                  backgroundColor: 'rgba(255,255,255, 0.3)'
                }
              }
            }}
          >
            {
              this.state.entries.map(item => {
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