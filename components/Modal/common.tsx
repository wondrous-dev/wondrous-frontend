import React, { useCallback, useEffect, useState } from 'react'
import { View, Pressable, StyleSheet, Dimensions, Platform } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { mentionRegEx } from 'react-native-controlled-mentions'

import { Black, White, Blue400, Grey400, Grey800, Grey750, Blue500, Red400, Yellow300 } from '../../constants/Colors'
import { ErrorText, Paragraph, RegularText, Subheading } from '../../storybook/stories/Text'
import { getMentionArray, spacingUnit } from '../../utils/common'
import PriorityFlame from '../../assets/images/modal/priority'
import { getFilenameAndType } from '../../utils/image'

import { capitalizeFirstLetter } from '../../utils/common'

export const PRIVACY_LEVELS = ['public', 'private', 'collaborators']

export const privacyDropdown = PRIVACY_LEVELS.map(privacy => ({
  'label': capitalizeFirstLetter(privacy),
  'value': privacy
}))

export const modalStyles = StyleSheet.create({
  fullScreenContainer: {
    backgroundColor: White,
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height),
    alignSelf: 'center',
    marginBottom: 0
  },
  topRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2,
    marginTop: spacingUnit * 3
  },
  infoContainer: {
    paddingLeft: spacingUnit * 2,
    paddingRight: spacingUnit * 2,
    marginTop: spacingUnit * 3,
    ...(Platform.OS !== 'android' && {
      zIndex: 100,
    })
  },
  inputContainer: {

  },
  createUpdateButton: {
    alignSelf: 'flex-end',
    width: spacingUnit * 10,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: Blue500,
    borderRadius: spacingUnit,
    alignItems: 'center'
  },
  title: {
    fontSize: 18
  },
  editContainer: {
    borderTopColor: Grey400,
    borderTopWidth: 1,
    marginTop: spacingUnit * 3,
    paddingTop: spacingUnit * 3
  },
  editRowContainer: {
    flexDirection: 'row',
    marginBottom: spacingUnit * 2.5,
    alignItems: 'center',
  },
  editRowTextContainer: {
    marginRight: spacingUnit * 2
  },
  editRowText: {
    color: Grey800,
    fontSize: 16,
    width: spacingUnit * 7.5
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  priorityRowItem: {
    padding: spacingUnit * 0.5,
    paddingLeft: spacingUnit * 0.75,
    paddingRight: spacingUnit * 0.75,
    flexDirection: 'row',
    marginRight: spacingUnit,
    borderRadius: 4
  },
  descriptionBox: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: Grey400,
    minHeight: spacingUnit * 9,
    padding: spacingUnit,
    color: Black,
    borderRadius: 4,
    alignSelf: 'stretch',
    flex: 1,
  },
  attachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacingUnit * 2
  },
  link: {
    fontFamily: 'Rubik Light',
    fontSize: 16
  },
  addLinkButton: {
    padding: spacingUnit
  },
  mediaRows: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacingUnit * 2
  },
  mediaItem: {
    width: spacingUnit * 12,
    height: spacingUnit * 9,
    borderRadius: 4,
    marginRight: spacingUnit
  },
  nameTextInput: {
    borderWidth: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0
  },
  renderSuggestion: {
    marginLeft: -(2 * spacingUnit)
  }
})

export const DateDisplay = ({ dueDate, onDateChange, editDate, setEditDate }) => {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center'
    }}>
      {/* <DueDateIcon /> */}
      <DateTimePicker
          testID="dateTimePicker"
          value={dueDate}
          mode={'date'}
          display="default"
          onChange={(e, date) => {
            if (date) {
              onDateChange(new Date(date))
            }
          }}
          style={{
            flex: 1,
            marginLeft: spacingUnit
          }}
        />
    </View>
  )
}

export const ModalDropdown = ({ defaultValue, items, placeholder, value, setValue, zIndex }) => {
  return (
      <DropDownPicker
      defaultValue={value}
      style={{
        backgroundColor: Grey750,
        // borderColor: 'rgba(47,46,65, 0.54)'
      }}

      containerStyle={{
        flex: 1,
        height: 40
      }}
      labelStyle={{
        color: Black,
        fontSize: 16,
        fontFamily: 'Rubik Light'
      }}
      itemStyle={{justifyContent: 'flex-start'}}
      selectedLabelStyle={{
        fontFamily: 'Rubik Light',
        fontWeight: '500'
      }}

      searchable={true}
        items={items}
      />
  )
}

export const PriorityList = ({ priority, setPriority }) => {
  const priorityHigh = priority === 'high'
  const priorityMedium = priority === 'medium'
  const priorityLow = priority === 'low'

  return (
    <View style={modalStyles.priorityRow}>
      <Pressable onPress={() => setPriority('high')} style={{
        ...modalStyles.priorityRowItem,
        ...(priorityHigh && {
          backgroundColor: Red400
        })
      }}>
        <PriorityFlame color={priorityHigh ? White : Red400} style={{
          marginRight: 0.5 * spacingUnit
        }} />
        <Paragraph color={priorityHigh ? White : Grey800}>
          High
        </Paragraph>
      </Pressable>
      <Pressable onPress={() => setPriority('medium')} style={{
        ...modalStyles.priorityRowItem,
        ...(priorityMedium && {
          backgroundColor: Yellow300
        })
      }}>
        <PriorityFlame color={priorityMedium ? White: Yellow300} style={{
          marginRight: 0.5 * spacingUnit
        }} />
        <Paragraph color={priorityMedium ? White : Grey800}>
          Medium
        </Paragraph>
      </Pressable>
      <Pressable onPress={() => setPriority('low')} style={{
        ...modalStyles.priorityRowItem,
        ...(priorityLow && {
          backgroundColor: Blue400
        })
      }}>
        <PriorityFlame color={priorityLow ? White : Blue400} style={{
          marginRight: 0.5 * spacingUnit
        }}/>
        <Paragraph color={priorityLow ? White : Grey800}>
          Low
        </Paragraph>
      </Pressable>
    </View>
  )
}

export const submit = async ({ name, detail, media, priority, dueDate, link, privacyLevel, setErrors, errors, mutation, projectId, goalId, taskId, filePrefix, firstTime }) => {
  if (!name) {
    setErrors({
      ...errors,
      nameError: 'Name is required'
    })
  } else {
    // Parse media:
    const finalMediaArr = media.map(media => {
      const {
        filename
      } = getFilenameAndType(media)
      return filePrefix + filename
    })
    const nameMentions = getMentionArray(name)
    const detailMentions = getMentionArray(detail)
    console.log('nameMentions', detailMentions, nameMentions)
    let userMentions = null
    if (nameMentions && detailMentions) {
      const mergedMentions = [...new Set([
        ...nameMentions,
        ...detailMentions
      ])]
      if (mergedMentions.length > 0) {
          userMentions = mergedMentions
      }
    } else if (nameMentions && nameMentions.length > 0) {
      userMentions = nameMentions
    } else if (detailMentions && detailMentions.length > 0) {
      userMentions = detailMentions
    }
    console.log('userMentions', userMentions)
    try {
      const result = await mutation({
        variables: {
          input: {
            name,
            detail,
            media: finalMediaArr,
            priority,
            dueDate,
            link,
            privacyLevel,
            ...(projectId && {
              projectId
            }),
            ...(goalId && {
              goalId
            }),
            ...(taskId && {
              taskId
            }),
            ...(firstTime && {
              firstTime
            }),
            ...(userMentions && {
              userMentions
            })
          }
        }
      })
      // console.log('result', result)
    } catch (err) {
      console.log('err', err)
    }
  }
}
