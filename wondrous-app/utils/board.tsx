export const addProposalItem = (newItem, columns) => {
  columns[0].section.tasks = [newItem, ...columns[0].section.tasks]
  return columns
}

export const updateProposalItem = (updatedItem, columns) => {
  columns[0].section.tasks = columns[0].section.tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem
    }
    return task
  })
  return columns
}

export const removeProposalItem = (itemId, columns) => {
  columns[0].section.tasks = columns[0].section.tasks.filter(
    (task) => task.id !== itemId
  )
  return columns
}

export const addTaskItem = (newItem, columns) => {
  columns[0].tasks = [newItem, ...columns[0].tasks]
  return columns
}

export const updateTaskItem = (updatedItem, columns) => {
  columns[0].tasks = columns[0].tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem
    }
    return task
  })
  return columns
}

export const removeTaskItem = (itemId, columns) => {
  columns[0].tasks = columns[0].tasks.filter((task) => task.id !== itemId)
  return columns
}

export const addSubmissionItem = (newItem, columns) => {
  columns[1].section.tasks = [newItem, ...columns[1].section.tasks]
  return columns
}

export const updateSubmissionItem = (updatedItem, columns) => {
  columns[1].section.tasks = columns[1].section.tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem
    }
    return task
  })
  return columns
}

export const removeSubmissionItem = (itemId, columns) => {
  columns[1].section.tasks = columns[1].section.tasks.filter(
    (task) => task.id !== itemId
  )
  return columns
}

export const addInProgressTask = (newItem, columns) => {
  columns[1].tasks = [newItem, ...columns[1].tasks]
  return columns
}

export const updateInProgressTask = (updatedItem, columns) => {
  columns[1].tasks = columns[1].tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem
    }
    return task
  })
  return columns
}
export const removeInProgressTask = (itemId, columns) => {
  columns[1].tasks = columns[1].tasks.filter((task) => task.id !== itemId)
  return columns
}

export const addArchiveItem = (newItem, columns) => {
  columns[2].section.tasks = [newItem, ...columns[2].section.tasks]
  return columns
}

export const updateArchiveItem = (updatedItem, columns) => {
  columns[2].section.tasks = columns[2].section.tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem
    }
    return task
  })
  return columns
}

export const removeArchiveItem = (itemId, columns) => {
  columns[2].section.tasks = columns[2].section.tasks.filter(
    (task) => task.id !== itemId
  )
  return columns
}

export const addCompletedItem = (newItem, columns) => {
  columns[2].tasks = [newItem, ...columns[2].tasks]
  return columns
}

export const updateCompletedItem = (updatedItem, columns) => {
  columns[2].tasks = columns[2].tasks.map((task) => {
    if (task.id === updatedItem.id) {
      return updatedItem
    }
    return task
  })
  return columns
}

export const removeCompletedItem = (itemId, columns) => {
  columns[2].tasks = columns[2].tasks.filter((task) => task.id !== itemId)
  return columns
}
