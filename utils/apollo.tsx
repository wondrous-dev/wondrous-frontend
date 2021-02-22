import React from 'react'

export const updateUsageProgress = ({ user, newKey, newValue=true  }) => {
  if (user) {
    const newUser = {
      ...user
    }
    const newUsageProgress = user.usageProgress ? {
      ...user.usageProgress
    } : {
      projectCreated: null,
      projectCategorySelected: null,
      signupCompleted: null,
      goalCreated: null,
      taskCreated: null,
      askCreated: null,
      taskCompleted: null,
      goalCompleted: null
    }
    newUsageProgress[newKey] = newValue
    newUser.usageProgress = newUsageProgress
    return [newUser]
  }
}