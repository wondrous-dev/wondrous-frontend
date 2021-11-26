import { Project } from "../../src/SourceControl-General/Project";
import { Task } from "../../src/SourceControl-General/Task";

export class MockProject implements Project {
  title: string;
  tasks: { [key: string]: Task };

  constructor(title: string, tasks: { [key: string]: Task }) {
    this.title = title;
    this.tasks = tasks;
  }

  sync(): boolean {
    return true;
  }
}
