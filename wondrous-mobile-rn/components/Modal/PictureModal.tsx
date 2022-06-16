import React from 'react'
import { SafeAreaView, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import Cancel from '../../assets/images/cancel'
import palette from 'theme/palette'

import { SafeImage } from '../../storybook/stories/Image'
import { spacingUnit } from '../../utils/common'

const PictureModal = ({ picture, isVisible, setModalVisible }) => {
  return (
    <Modal
    isVisible={isVisible}
    backdropOpacity={0.9}
    onBackdropPress={() => {
      setModalVisible(false)
    }}
    >
      <SafeAreaView style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Cancel color={palette.white} style={{
          marginBottom: spacingUnit,
          width: spacingUnit * 4,
          height: spacingUnit * 4,
          alignSelf: 'flex-start'
        }} onPress={() => setModalVisible(false)}/>
        <SafeImage style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height - (spacingUnit * 25),
          borderRadius: spacingUnit * 0.5
        }}  src={picture} />
      </SafeAreaView>
    </Modal>
  )
}

export default PictureModal
