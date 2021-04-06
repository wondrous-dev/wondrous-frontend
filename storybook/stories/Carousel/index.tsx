import * as React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native'
import Swiper from 'react-native-web-swiper'
import { White, Orange, Grey800, Black } from '../../../constants/Colors'
import { spacingUnit } from '../../../utils/common'
import { ModalImage, SafeImage } from '../Image'
import { Video } from 'expo-av'

import { Title, Subheading, Paragraph } from '../Text'
import { MUX_URL_ENDING, MUX_URL_PREFIX } from '../../../constants'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  video: {
    alignSelf: 'center',
    width: 360,
    height: 360,
    borderRadius: spacingUnit
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export const VideoDisplay = ({ video }) => {
  return (
    <View>
    <Video
      style={styles.video}
      source={{
        uri: `${MUX_URL_PREFIX}${video}${MUX_URL_ENDING}`,
      }}
      useNativeControls
      resizeMode="contain"
      isLooping
    />

    </View>
  )
}
export class MyCarousel extends React.Component {

  constructor(props) {
    super(props)
    this.videoRef = React.createRef()
    this.state = {
      entries: this.props.data,
      activeSlide: 0,
      isPlaying: true
    }
    
  }

  render () {
    const {
      isPlaying
    } = this.state
    const {
      activeDotColor,
      passiveDotColor,
      images,
      containerStyle,
      video
    } = this.props

      return (
        <View style={{
          height: images ? 400: 130, 
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
                  backgroundColor: passiveDotColor || 'rgba(255,255,255, 0.3)',
                  ...(!images && {
                    borderColor: Orange,
                    borderWidth: 1
                  })
                }
              }
            }}
          >
            {
              this.state.entries.map(item => {
                if (item && item.video) {
                  return (
                    <VideoDisplay key={item.video} videoRef={this.videoRef} video={item.video} setState={item => this.setState(item)}  />
                  )
                }
                if (images) {
                  return <ModalImage key={item} src={item} style={{
                    flex: 1,
                    // height: 500,
                    borderRadius: 8,
                    marginBottom: spacingUnit * 4
                  }}/>
                }
                return (
                  <View key={item.subheading} style={{flex: 1, padding: spacingUnit * 2}}>
                  <Subheading color={Black} style={{textAlign: 'center', lineHeight: 30}}>{item.subheading}</Subheading>
                  {/* <Paragraph color={Black} style={{textAlign: 'center', marginTop: 8}}>{item.paragraph}</Paragraph> */}
                </View>
                )
              })
            }
          </Swiper>
        </View>
      )
  }
}