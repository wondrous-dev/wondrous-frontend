import React from 'react'

export const updateUsageProgress = ({ user, newKey, newValue=true  }) => {
  if (user) {
    const newUsageProgress = user.usageProgress ? {
      ...user.usageProgress,
      newKey: newValue
    } : {
      newKey: newValue
    }

    return [{
      ...user,
      usageProgress: newUsageProgress
    }]
  }
}