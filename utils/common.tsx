import React, { useEffect, useRef } from 'react'
import { Text } from 'react-native'
import * as Localization from 'expo-localization'
import { mentionRegEx } from 'react-native-controlled-mentions'
import regexifyString from 'regexify-string'
import { Blue400 } from '../constants/Colors'

export const spacingUnit = 8

export const capitalizeFirstLetter = (string) => {
  if (!string) {
    return ''
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0
}

export const flattenParams = (obj, accObj = {}) => {
  if (!obj) return null
  for (let key in obj) {
    if (key === 'params') {
      flattenParams(obj.params, accObj)
    } else {
      accObj[key] = obj[key]
    }
  }
  return accObj
}

export const insertComponentsIntoText = (
  regex: RegExp,
  str: string,
  replacements: {
      [key: string]: React.ReactNode
  }
) => {
  const splitRegex = new RegExp(regex);
  const parts = str.split(splitRegex);
  return parts.map(part => {
      if (replacements.hasOwnProperty(part)) {
          return replacements[part];
      }
      return part;
  });
}

export const navigateUserOnLogin = (user, navigation) => {
  if (user && user.usageProgress && user.usageProgress.signupCompleted) {
    if (user.usageProgress.askCreated) {
      navigation.navigate('Root', {
        screen: 'Dashboard'
      })
    } else {

      navigation.navigate('Root', {
        screen: 'Profile',
        params: {
          screen: 'UserProfile',
          params: {
            projectId: user.id,
            noGoingBack: true
          }
        }
      })
    }
  } else if (user) {
    navigation.navigate('Welcome')
  }
}


export const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

export const getNonWhiteSpaceLength = (string) => {
    // use the \s quantifier to remove all white space
  let remText = string.replace(/\s/g, "")

  // get the length of the string after removal
  let length = remText.length
  return length
}

export const cutString = (string, length=240, afterText='...') => {
  if (getNonWhiteSpaceLength(string) > length) {
    return string.slice(0, length) + afterText
  }
  return string
}

export const setDeepVariable = (obj, keyArr, value) => {
  let reference = obj
  for (let i = 0 ; i < keyArr.length -1; i++) {
    reference= obj[keyArr[i]]
  }

  reference[keyArr[keyArr.length - 1]] = value
  return obj
}

export const getLocale = () => {
  // await NativeModules.ExponentUtil.getCurrentLocaleAsync()
  return Localization.timezone
}

export const getMentionArray = (content) => {
  if (!content) {
    return {}
  }
  const mentionedUsers = []
  const mentionedProjects = []
  const mentions = content.match(mentionRegEx)
  if (mentions) {
    for (let mention of mentions) {
      const mentionExp = mention.matchAll(mentionRegEx)
      const { id, trigger } = [...mentionExp][0].groups
      if (trigger === '#') {
        mentionedProjects.push(id)
      } else if (trigger === '@') {
        mentionedUsers.push(id)
      }
    }
  }
  return {
    mentionedProjects,
    mentionedUsers
  }
}

export const renderMentionString = ({ content, textStyle, navigation, simple, tab }) => {
  const final = regexifyString({
    pattern: mentionRegEx,
    decorator: (match, index) => {
      const mentionExp = /(?<original>(?<trigger>.)\[(?<name>([^[]*))]\((?<id>([\d\w-]*))\))/.exec(match)
      if (!mentionExp) {
        return match
      }
      const { id, name, trigger } = mentionExp.groups
      if (simple) {
        return trigger + name
      }
      return (
          <Text style={{
            color: Blue400,
            ...textStyle
          }}
          onPress={() => navigation.navigate('Root', {
            screen: tab || 'Profile',
            params: {
              screen: trigger === '@' ? 'OtherUserProfile' : 'ProjectProfile',
              params: {
                id
              }
            }
          })}
          >{`@${name}`}
          </Text>
      )
    },
    input: content
  })
  if (simple) {
    return final.join('')
  }
  return final
}


export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
