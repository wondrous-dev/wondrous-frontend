import { GUID } from "../Common/GUID";
import { Label } from "./Label";
import { Task, TasksAreEqual } from "./Task";

/**
 * A milestone is a goal or desired outcome. While a Milestone is nearly as
 * complicated as a Project, we choose to keep syncing to the Project level
 * since "Project owns Milestone." Project managers may complete a Milestone
 * or update its status from Wonder.
 */
export interface Milestone {
  id: GUID;
  title: string;
  description: string;
  dueDate: Date;
  startDate: Date;
  completionDate: Date;
  status: Label;
  tasks: { [key: string]: Task };
  updateStatus(newStatus: Label): boolean;
  complete(completionDate: Date): boolean;
}

/**
 * MilestonesAreEqual - deep equality comparison between two Milestones
 *
 * @param  {type} a: Milestone
 * @param  {type} b: Milestone
 * @return {type}              whether two Milestones are equal.
 */
export function MilestonesAreEqual(a: Milestone, b: Milestone): boolean {
  if (a.id !== b.id || a.title !== b.title || a.description !== b.description) {
    return false;
  }

  if (
    a.dueDate !== b.dueDate ||
    a.startDate !== b.startDate ||
    a.completionDate !== b.completionDate
  ) {
    return false;
  }

  if (a.tasks.length !== b.tasks.length) {
    return false;
  }

  for (let key in a.tasks) {
    if (!(key in b.tasks) || !TasksAreEqual(a.tasks[key], b.tasks[key])) {
      return false;
    }
  }

  return true;
}
