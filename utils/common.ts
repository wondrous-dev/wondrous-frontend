import React from 'react'
import { NativeModules, Platform } from 'react-native'

export const spacingUnit = 8

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
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
    if (user.usageProgress.workFlowCompleted) {
      navigation.navigate('Root', {
        screen: 'Dashboard'
      })
    } else {
      navigation.navigate('Root', {
        screen: 'Profile',
        params: {
          screen: 'ProjectProfile',
          params: {
            projectId: user.usageProgress.projectCreated,
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

export const setDeepVariable = (obj, keyArr, value) => {
  let reference = obj
  for (let i = 0 ; i < keyArr.length -1; i++) {
    reference= obj[keyArr[i]]
  }

  reference[keyArr[keyArr.length - 1]] = value
  return obj
}

export const getLocale = () => {
  if (Platform.OS === 'ios') {
    return NativeModules.SettingsManager.settings.AppleLocale ||
    NativeModules.SettingsManager.settings.AppleLanguages[0]
  } else if (Platform.OS === 'android') {
    return NativeModules.I18nManager.localeIdentifier
  }
}