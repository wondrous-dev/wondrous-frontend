import { Milestone } from "../../src/SourceControl-General/Milestone";
import { Project } from "../../src/SourceControl-General/Project";
import { Task } from "../../src/SourceControl-General/Task";

export class MockProject implements Project {
  title: string;
  tasks: { [key: string]: Task };
  milestones: { [key: string]: Milestone };

  constructor(
    title: string,
    tasks: { [key: string]: Task },
    milestones: { [key: string]: Milestone }
  ) {
    this.title = title;
    this.tasks = tasks;
    this.milestones = milestones;
  }

  sync(): boolean {
    return true;
  }
}
