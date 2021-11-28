import { GUID } from "../../src/Common/GUID";
import { Label } from "../../src/SourceControl-General/Label";
import { Milestone } from "../../src/SourceControl-General/Milestone";
import { Task } from "../../src/SourceControl-General/Task";

export class MockMilestone implements Milestone {
  id: GUID;
  title: string;
  description: string;
  dueDate: Date;
  startDate: Date;
  completionDate: Date;
  status: Label;
  tasks: { [key: string]: Task };

  constructor(
    title: string,
    description: string,
    dueDate: Date,
    startDate: Date,
    status: Label,
    tasks: { [key: string]: Task },
    completionDate: Date = null
  ) {
    this.id = new GUID();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.startDate = startDate;
    this.completionDate = completionDate;
    this.status = status;
    this.tasks = tasks;
  }

  updateStatus(newStatus: Label): boolean {
    this.status = newStatus;
    return true;
  }

  // in the real world, we'd do some checking to make sure this isn't already
  // complete
  complete(completionDate: Date): boolean {
    this.completionDate = completionDate;
    return true;
  }
}
