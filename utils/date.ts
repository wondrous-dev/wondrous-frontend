import { isSameISOWeek, differenceInDays, isTomorrow, isToday, formatDistanceToNowStrict, format, startOfWeek, addDays, isSameISOWeekYear, isAfter } from 'date-fns'

export const endOfWeekFromNow = () => addDays(startOfWeek(new Date), 7)

export const formatDueDate = (dueDate) => {
  const newDate = new Date()
  const formattedDate = new Date(dueDate)
  if (isToday(formattedDate)) {
    return 'today'
  } else if (isAfter(formattedDate, newDate)) {
    if (isSameISOWeek(formattedDate, newDate)) {
      if (isTomorrow(formattedDate)) {
        return 'by tomorrow'
      }
      return 'by ' +  format(formattedDate, 'cccc')
    } else {
      return 'by ' + format(formattedDate, 'P')
    }
  } else {
    const day = differenceInDays(newDate, formattedDate) === 1 ? 'day' : 'days'
    return `${differenceInDays(newDate, formattedDate)} ${day} ago`
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
