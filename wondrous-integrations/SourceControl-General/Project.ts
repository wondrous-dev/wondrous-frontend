import { Task } from './Task'

export interface Project {
  title: string;
  tasks: Task[];
  syncWithWonder(): boolean;
}
