import { GUID } from "../Common/GUID";
import { Label } from "./Label";

/**
 * Since Wonder is a task management suite for DAO's, not every user will be a dev.
 * Thus, we create the notion of a Task to give non-dev project managers some tools
 * to manipulate, update, modify Source Control tasks to better organize and keep
 * track of the work required to launch their project.
 *
 * As an example, consider Wonder, itself a DAO. It is utilizing a task labelling
 * strategy to incentivize and reward its contributors. Instead of requiring the
 * project manager to create a GitHub account, navigate to GitHub, learn GitHub's
 * interface
 */
export interface Task {
  id: GUID;
  title: string;
  label: Label;
  updateLabel(newLabel: Label): boolean;
}

/**
 * TasksAreEqual - "deep" semantic equality checker
 *
 * @param  {type} a: Task
 * @param  {type} b: Task
 * @return {type} boolen - whether or not the two are equal
 */
export function TasksAreEqual(a: Task, b: Task): boolean {
  return a.id === b.id && a.title === b.title && a.label === b.label;
}
