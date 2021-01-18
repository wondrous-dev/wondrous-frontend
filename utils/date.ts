import { isSameISOWeek, formatDistanceToNowStrict, format, startOfWeek, addDays, isSameISOWeekYear } from 'date-fns'

export const endOfWeekFromNow = () => addDays(startOfWeek(new Date), 7)

export const formatDueDate = (dueDate) => {
  const newDate = new Date()
  if (isSameISOWeek(dueDate, newDate)) {
    return format(dueDate, 'cccc')
  } else {
    return format(dueDate, 'P')
  }
}