import { isSameISOWeek, isTomorrow, isToday, formatDistanceToNowStrict, format, startOfWeek, addDays, isSameISOWeekYear, isAfter } from 'date-fns'

export const endOfWeekFromNow = () => addDays(startOfWeek(new Date), 7)

export const formatDueDate = (dueDate) => {
  const newDate = new Date()
  const formattedDate = new Date(dueDate)
  if (isSameISOWeek(formattedDate, newDate)) {
    if (isToday(formattedDate)) {
      return 'today'
    }
    if (isTomorrow(formattedDate)) {
      return 'by tomorrow'
    }
    return 'by ' +  format(formattedDate, 'cccc')
  } else {
    return 'by ' + format(formattedDate, 'P')
  }
}

export const redDate = (dueDate) => {
  const formattedDueDate = new Date(dueDate)
  const newDate = new Date()
  if (!formattedDueDate) {
    return null
  }
  if (isToday(formattedDueDate) || isAfter(newDate, formattedDueDate)) {
    return true
  }
  return false
}
