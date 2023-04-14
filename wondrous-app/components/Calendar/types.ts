import { TaskInterface } from 'types/task';

export type CalendarMonthAndWeekViewProps = {
  startDate: Date;
  setSelectedDate: (date: Date | null) => void;
  setTaskForSelectedDate: (tasks: TaskInterface[]) => void;
  tasksMap: {
    [key: string]: TaskInterface[];
  };
};
