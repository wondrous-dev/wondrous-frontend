import { isSameISOWeek, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, isTomorrow, isToday, formatDistanceToNowStrict, format, startOfWeek, addDays, isSameISOWeekYear, isAfter } from 'date-fns'

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
    const diffDays = differenceInDays(newDate, formattedDate)
    const diffWeeks = differenceInWeeks(newDate, formattedDate)
    const diffMonths = differenceInMonths(newDate, formattedDate)
    const diffYears = differenceInYears(newDate, formattedDate)
    const day = diffDays === 1 ? 'day' : 'days'
    if (diffDays < 7) {
      return `${diffDays} ${day} ago`
    } else if (diffMonths === 0) {
      return `${diffWeeks} ${diffWeeks === 1 ? 'week': 'weeks'} ago`
    } else if (diffYears === 0) {
      return `${diffMonths} ${diffMonths === 1 ? 'month': 'months'} ago`
    } else if (diffYears > 0) {
      return `${diffYears} ${diffYears === 1 ? 'year': 'years'} ago`
    }
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

export const sortByDueDate = (arr, descending=false) => {
  arr.sort((a, b) => {
    const aDate = new Date(descending ? a.completedAt : a.dueDate)
    const bDate = new Date(descending ? b.completedAt : b.dueDate)
    if (descending) {
      if (isAfter(bDate, aDate)) {
        return 1
      }
      return -1
    } else {
      if (isAfter(bDate, aDate)) {
        return -1
      }
      return 1
    }
  })
  return arr
}