import { useMutation, useQuery } from '@apollo/client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { SafeAreaView, View, StyleSheet, Pressable, TouchableWithoutFeedback, Keyboard, Dimensions, ScrollView } from 'react-native'
import { Header } from '../../components/Header'
import { White, Black, Red400, Green400, Grey400, Blue400 } from '../../constants/Colors'
import { GET_REVIEW_STATS } from '../../graphql/queries/review'
import { ButtonText, ErrorText, Paragraph, Subheading } from '../../storybook/stories/Text'
import { spacingUnit } from '../../utils/common'
import { PrimaryButton } from '../../storybook/stories/Button'
import { withAuth } from '../../components/withAuth'
import { CREATE_REVIEW } from '../../graphql/mutations'
import Sad from '../../assets/images/emoji/sad'
import SlightFrown from '../../assets/images/emoji/slightFrown'
import Neutral from '../../assets/images/emoji/neutral'
import Smile from '../../assets/images/emoji/smile'
import StarEyes from '../../assets/images/emoji/starEyes'

import { TextEditor } from '../../storybook/stories/TextEditor'
import { TextEditorContext } from '../../utils/contexts'

const createReviewStyles = StyleSheet.create({
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacingUnit * 4
  },
  emoji: {
    width: 28,
    height: 28,
    marginBottom: spacingUnit * 4,
  },
  emojiPressable: {
    marginLeft: spacingUnit  * 3,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    paddingTop: 8
  },
  descriptionBox: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: Grey400,
    minHeight: spacingUnit * 11,
    padding: spacingUnit * 2,
    color: Black,
    borderRadius: 4,
    width: Dimensions.get('window').width - (4 * spacingUnit)
  },
  renderSuggestion: {
    marginLeft: 0,
    width: Dimensions.get('window').width - (4 * spacingUnit)
  }
})

const CreateReview = ({ navigation, route }) => {
  const [createReview] = useMutation(CREATE_REVIEW)
  const [description, setDescription] = useState('')
  const [reviewScore, setReviewScore] = useState(null)
  const { 
    tab
  } = route.params
  const [createRreview, { error: createErr }] = useMutation(CREATE_REVIEW)
  const [error, setError] = useState('')
  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: White
    }}>
      <Header />
      <TouchableWithoutFeedback 
      onPress={() => Keyboard.dismiss()} style={{
        flex: 1
      }}>
      <ScrollView style={{
        marginTop: spacingUnit * 5,
        alignItems: 'center'
      }}>
        <View style={{
          padding: spacingUnit * 2,
          alignItems: 'center',
        }}>
        <Subheading color={Black} style={{
          textAlign: 'center',
          marginBottom: spacingUnit * 3
        }}>
         How do you feel about your progress this week?
        </Subheading>
        <View style={createReviewStyles.emojiRow}>
          <Pressable style={{
            ...createReviewStyles.emojiPressable,
            ...{
              marginLeft: 0,
            },
            ...(reviewScore === 1 && {
              backgroundColor: Blue400
            })
          }} onPress={() => setReviewScore(1)}>
            <Sad style={createReviewStyles.emoji} />
          </Pressable>
          <Pressable style={{
            ...createReviewStyles.emojiPressable,
            ...(reviewScore === 2 && {
              backgroundColor: Blue400
            })
            }} onPress={() => setReviewScore(2)}>
            <SlightFrown style={createReviewStyles.emoji} />
          </Pressable>
          <Pressable style={{
            ...createReviewStyles.emojiPressable,
            ...(reviewScore === 3 && {
              backgroundColor: Blue400
            })
            }} onPress={() => setReviewScore(3)}>
            <Neutral style={createReviewStyles.emoji} />
          </Pressable>
          <Pressable style={{
            ...createReviewStyles.emojiPressable,
            ...(reviewScore === 4 && {
              backgroundColor: Blue400
            })
            }} onPress={() => setReviewScore(4)} >
            <Smile style={createReviewStyles.emoji} />
          </Pressable>
          <Pressable style={{
            ...createReviewStyles.emojiPressable,
            ...(reviewScore === 5 && {
              backgroundColor: Blue400
            })
            }} onPress={() => setReviewScore(5)}>
            <StarEyes style={createReviewStyles.emoji} />
          </Pressable>
        </View>
        <TextEditorContext.Provider value={{
            content: description,
            setContent: setDescription,
            placeholder: 'E.g. This week was pretty productive! I completed goals A and B for my main project. But I should have slept better.'
          }}>
            <View>
          <TextEditor multiline style={createReviewStyles.descriptionBox}
          renderSuggestionStyle={createReviewStyles.renderSuggestion}
          />
          </View>
          </TextEditorContext.Provider>
      </View>
      <PrimaryButton
              style={{
                alignSelf: 'center',
                marginTop: spacingUnit * 3.5 
              }}
              onPress={async () => {
                if (description && reviewScore) {
                  await createReview({
                    variables: {
                      input: {
                        description,
                        reviewScore
                      }
                    }
                  })
                  navigation.push('Root', {
                    screen: tab || 'Profile',
                    params: {
                      screen: 'HouseKeeping'
                    }
                  })
                } else {
                  setError('Please click on an emoji and write a brief reflection on your week.')
                }
              }}
            >
              <ButtonText color={White}> Continue </ButtonText>
            </PrimaryButton>
            {
              !!(error) &&
              <ErrorText style={{
                marginTop: spacingUnit * 0.5
              }}>
                {error}
              </ErrorText>
            }
      </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default withAuth(CreateReview)