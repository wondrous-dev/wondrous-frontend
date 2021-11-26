import { Label } from "../../src/SourceControl-General/Label";
import { Task } from "../../src/SourceControl-General/Task";

export class MockTask implements Task {
  title: string;
  label: Label;

  constructor(title: string, label: Label) {
    this.title = title;
    this.label = label;
  }

  updateLabel(newLabel: Label): boolean {
    this.label = newLabel;
    return true;
  }
}
