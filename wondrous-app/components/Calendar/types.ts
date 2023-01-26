import { TaskInterface } from 'types/task';

export type CalendarMonthAndWeekViewProps = {
  startDate: Date;
  tasksMap: {
    [key: string]: TaskInterface[];
  };
};
