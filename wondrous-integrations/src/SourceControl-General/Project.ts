import { Task, TasksAreEqual } from "./Task";

/**
 * A project is a named entity (title) with multiple tasks. Sync typically means
 * grabbing the latest project info from the source of truth and updating the
 * data stored in this object.
 */
export interface Project {
  title: string;
  tasks: { [key: string]: Task };
  sync(): boolean;
}

/**
 * ProjectsAreEqual - Equality is defined as two projects with the same title,
 *                    same set of tasks, where tasks are equal if their status
 *                    and title is the same. We may check for a "deeper" equality
 *                    in the future, however since Wonder is mostly just a
 *                    view into SourceControl (the exception being write for
 *                    labels), we don't need much more for now.
 *
 * @param  {type} a: Project description
 * @param  {type} b: Project description
 * @return {type}            description
 */
export function ProjectsAreEqual(a: Project, b: Project): boolean {
  if (a.title !== b.title) {
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
