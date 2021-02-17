import React from 'react'
import { View, Dimensions, StyleSheet, Pressable } from 'react-native'
import Modal from 'react-native-modal'
import Clipboard from 'expo-clipboard'

import { Grey300, Black, Grey150, White} from '../../constants/Colors'
import { Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { SecondaryButton } from '../../storybook/stories/Button'
import { spacingUnit } from '../../utils/common'
import Celebration from '../../assets/images/celebrations/signupConfetti.svg'
import { SvgImage } from '../../storybook/stories/Image'
import { TwitterShare, FacebookShare, CopyLink, LinkedinShare } from '../../assets/images/share'
import { tweetNow, linkedinShare, postOnFacebook  } from '../Share'

const modalStyles = StyleSheet.create({
  fixedContainer: {
    backgroundColor: White,
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get("window").width,
    alignSelf: 'center',
    flex: 1,
    borderTopLeftRadius: spacingUnit * 3,
  },
  confetti: {
    marginBottom: spacingUnit * 4
  }
})

export const CompleteCongratsModal = ({ shareContent, shareUrl,  message, isVisible, setModalVisible }) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={() => setModalVisible(false)}>
      <View style={{
        ...modalStyles.fixedContainer,
        ...{
          padding: spacingUnit * 2,
          paddingTop: spacingUnit * 5,
          alignItems: 'center',
          height: Dimensions.get('window').height / 1.5,
        }
      }}>
        <SvgImage width="60" height="60" srcElement={Celebration} style={modalStyles.confetti} />
        <Subheading style={{
          fontSize: 28,
          marginBottom: spacingUnit * 2,
          fontFamily: 'Rubik SemiBold',
          textAlign: 'center'

        }} color={Black}>
          {message}
        </Subheading>
        <Paragraph color={Black} style={{
          fontSize: 20
        }}>
          Share your accomplishment!
        </Paragraph>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: spacingUnit * 4
        }}>
           <Pressable style={{
             flex: 1
           }} onPress={() => {
              tweetNow({ twitterShareURL: shareUrl, tweetContent: shareContent })
            }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <TwitterShare />
              <Paragraph color={Black} style={{
                marginTop: spacingUnit * 0.5
              }}>
                Twitter
              </Paragraph>
            </View>
            </Pressable>
            <Pressable style={{
             flex: 1
           }} onPress={() => {
              linkedinShare({ linkedinShareUrl: shareUrl, linkedinContent: shareContent })
            }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <LinkedinShare />
              <Paragraph color={Black} style={{
                marginTop: spacingUnit * 0.5
              }}>
                Linkedin
              </Paragraph>
            </View>
            </Pressable>
            <Pressable style={{
             flex: 1
           }} onPress={() => {
              postOnFacebook({ facebookShareURL: shareUrl, postContent: shareContent })
            }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <FacebookShare />
              <Paragraph style={{
                marginTop: spacingUnit * 0.5
              }}>
                Facebook
              </Paragraph>
            </View>
            </Pressable>
            <Pressable style={{
             flex: 1
           }} onPress={() => {
              Clipboard.setString(url)
              setModalVisible(false)
            }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <CopyLink />
              <Paragraph style={{
                marginTop: spacingUnit * 0.5
              }}>
                Copy Link
              </Paragraph>
            </View>
            </Pressable>
        </View>
        <SecondaryButton style={{
            backgroundColor: Grey150,
            marginTop: spacingUnit * 4,
            alignSelf: 'center',
            maxWidth: Dimensions.get('window').width - (spacingUnit * 6),
            marginBottom: spacingUnit * 3,
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

export const TaskCongratsModal = ({ user, isVisible, setModalVisible,  }) => {
  const message = 'Well done! You finished your first task!'
  const shareContent = 'Finished my first task on Wonder! Follow my journey here'
  const shareUrl = `https://wonderapp.co/app/user/${user.id}`
  return <CompleteCongratsModal message={message} shareContent={shareContent} shareUrl={shareUrl} isVisible={isVisible} setModalVisible={setModalVisible} />
}

export const GoalCongratsModal = ({ user, isVisible, setModalVisible }) => {
  const message = 'Well done! You finished your first goal!'
  const shareContent = 'Finished my first goal on Wonder! Follow my journey here'
  const shareUrl = `https://wonderapp.co/app/user/${user.id}`
  console.log('set', setModalVisible)
  return <CompleteCongratsModal message={message} shareContent={shareContent} shareUrl={shareUrl} isVisible={isVisible} setModalVisible={setModalVisible} />
}

export const FlexRowContentModal = ({ isVisible, headerText, children, setModalVisible, centered, cancelButtonStyle, flexDirection='row', ...props }) => {

  return (
    <Modal isVisible={isVisible} onBackdropPress={() => setModalVisible(false)} {...props}>
      <View style={modalStyles.fixedContainer}>
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