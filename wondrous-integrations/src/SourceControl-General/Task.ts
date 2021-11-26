import { Label } from './Label'

/*

Since Wonder is a task management suite for DAO's, not every user will be a dev.
Thus, we create the notion of a Task to give non-dev project managers some tools
to manipulate, update, modify Source Control tasks to better organize and keep
track of the work required to launch their project.

As an example, consider Wonder, itself a DAO. It is utilizing a task labelling
strategy to incentivize and reward its contributors. Instead of requiring the
project manager to create a GitHub account, navigate to GitHub, learn GitHub's
interface

*/

export interface Task {
  title: string;
  label: Label;
  updateLabel(newLabel: Label): boolean;
}


export function TasksAreEqual(a: Task, b: Task) : boolean {
  return a.title === b.title && a.label === b.label
}
