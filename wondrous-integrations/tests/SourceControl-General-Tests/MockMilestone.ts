import { Label } from "../../src/SourceControl-General/Label";
import { Milestone } from "../../src/SourceControl-General/Milestone";
import { Task } from "../../src/SourceControl-General/Task";

export class MockMilestone implements Milestone {
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
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.startDate = startDate;
    this.completionDate = completionDate;
    this.status = status;
    this.tasks = tasks;
  }
}
