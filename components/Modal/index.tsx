import React from 'react'
import { View, Dimensions } from 'react-native'
import Modal from 'react-native-modal'

import { Grey300, Black, Grey150, White} from '../../constants/Colors'
import { RegularText, Subheading } from '../../storybook/stories/Text'
import { SecondaryButton } from '../../storybook/stories/Button'
import { spacingUnit } from '../../utils/common'


export const FlexRowContentModal = ({ isVisible, headerText, children, setModalVisible, centered, cancelButtonStyle, flexDirection='row', ...props }) => {

  return (
    <Modal isVisible={isVisible} onBackdropPress={() => setModalVisible(false)} {...props}>
      <View style={{
        backgroundColor: White,
        position: 'absolute',
        bottom: 0,
        width: Dimensions.get("window").width,
        alignSelf: 'center',
        flex: 1,
        borderTopLeftRadius: spacingUnit * 3,
        borderTopRightRadius: spacingUnit * 3,
      }}>
        <Subheading color={Black} style={{
          padding: spacingUnit * 2,
          paddingLeft: spacingUnit * 3
        }}>
          {headerText}
        </Subheading>
        <View
          style={{
            borderBottomColor: Grey300,
            borderBottomWidth: 1,
            marginBottom: spacingUnit
          }}
        />
        <View style={{
          flexDirection,
          justifyContent: centered ? 'center' : 'space-between',
          padding: spacingUnit * 2,
          paddingLeft: spacingUnit * 3,
        }}>
          { children }
        </View>
        <SecondaryButton style={{
            backgroundColor: Grey150,
            marginTop: spacingUnit * 4,
            alignSelf: 'center',
            maxWidth: Dimensions.get('window').width - (spacingUnit * 6),
            marginBottom: spacingUnit * 3,
            ...cancelButtonStyle
          }} onPress={() => setModalVisible(false)}>
            <RegularText color={Black} style={{
              fontFamily: 'Rubik SemiBold'
            }}>
            Cancel
            </RegularText>
          </SecondaryButton>
      </View>
    </Modal>
  )
}