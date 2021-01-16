import { endOfWeek, formatDistanceToNowStrict, format, startOfWeek, addDays } from 'date-fns'

export const endOfWeekFromNow = () => addDays(startOfWeek(new Date), 7)
