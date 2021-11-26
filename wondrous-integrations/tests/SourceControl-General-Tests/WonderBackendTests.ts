import { Label } from "../../src/SourceControl-General/Label";
import { MockProject } from "./MockProject";
import { MockTask } from "./MockTask";
import { MockWonderBackend } from "./MockWonderBackend";
import { SyncProjectWithWonder } from "../../src/SourceControl-General/WonderBackend";
import { expect } from "chai";

const TaskA = new MockTask("foo", Label.InProgress);
const TaskC = new MockTask("foo", Label.Todo);
const TaskD = new MockTask("bar", Label.InProgress);

const ProjectA = new MockProject("fooProject", { foo: TaskA, bar: TaskD });
const ProjectC = new MockProject("fooProject", { foo: TaskA });
const ProjectD = new MockProject("bazProject", { foo: TaskC, bar: TaskD });
const ProjectE = new MockProject("barProject", { foo: TaskA, bar: TaskD });

const WonderBackendA = new MockWonderBackend({
  fooProject: ProjectC,
  barProject: ProjectE,
});

describe("SyncProjectWithWonder functions properly", () => {
  it("happy path - no sync needed", () => {
    expect(SyncProjectWithWonder(ProjectC, WonderBackendA)).to.equal(true);
  });

  it("happy path - sync for one project, project not found", () => {
    expect(SyncProjectWithWonder(ProjectD, WonderBackendA)).to.equal(true);
  });

  it("happy path - sync for one project, different set of tasks", () => {
    expect(SyncProjectWithWonder(ProjectA, WonderBackendA)).to.equal(true);
  });
});
