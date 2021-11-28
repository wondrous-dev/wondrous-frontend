import { GUID } from "../../src/Common/GUID";
import { Label } from "../../src/SourceControl-General/Label";
import { Task } from "../../src/SourceControl-General/Task";

export class MockTask implements Task {
  id: GUID;
  title: string;
  label: Label;

  constructor(title: string, label: Label) {
    this.id = new GUID();
    this.title = title;
    this.label = label;
  }

  updateLabel(newLabel: Label): boolean {
    this.label = newLabel;
    return true;
  }
}
