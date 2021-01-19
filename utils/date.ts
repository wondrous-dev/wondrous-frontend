import { isSameISOWeek, isTomorrow, formatDistanceToNowStrict, format, startOfWeek, addDays, isSameISOWeekYear } from 'date-fns'

export const endOfWeekFromNow = () => addDays(startOfWeek(new Date), 7)

export const formatDueDate = (dueDate) => {
  const newDate = new Date()
  if (isSameISOWeek(dueDate, newDate)) {
    if (isTomorrow(dueDate, newDate)) {
      return 'by tomorrow'
    }
    return 'by ' +  format(dueDate, 'cccc')
  } else {
    return 'by ' + format(dueDate, 'P')
  }
}