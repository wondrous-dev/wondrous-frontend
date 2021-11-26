import { Label } from "../../src/SourceControl-General/Label";
import { MockProject } from "./MockProject";
import { MockTask } from "./MockTask";
import { MockWonderBackend } from "./MockWonderBackend";
import { ProjectsAreEqual } from "../../src/SourceControl-General/Project";
import { TasksAreEqual } from "../../src/SourceControl-General/Task";
import { SyncProjectWithWonder } from "../../src/SourceControl-General/WonderBackend";
import { expect } from "chai";

const TaskA = new MockTask("foo", Label.InProgress);
const TaskB = new MockTask("foo", Label.InProgress);
const TaskC = new MockTask("foo", Label.Todo);
const TaskD = new MockTask("bar", Label.InProgress);

const ProjectA = new MockProject("fooProject", { foo: TaskA, bar: TaskD });
const ProjectB = new MockProject("fooProject", { foo: TaskA, bar: TaskD });
const ProjectC = new MockProject("fooProject", { foo: TaskA });
const ProjectD = new MockProject("fooProject", { foo: TaskC, bar: TaskD });
const ProjectE = new MockProject("barProject", { foo: TaskA, bar: TaskD });

const WonderBackendA = new MockWonderBackend({
  fooProject: ProjectC,
  barProject: ProjectE,
});

describe("Tasks Equality", () => {
  it("equal", () => {
    expect(TasksAreEqual(TaskA, TaskB)).to.equal(true);
  });

  it("differ by title", () => {
    expect(TasksAreEqual(TaskA, TaskD)).to.equal(false);
  });

  it("differ by label", () => {
    expect(TasksAreEqual(TaskB, TaskC)).to.equal(false);
  });
});

describe("Project Equality", () => {
  it("equal", () => {
    expect(ProjectsAreEqual(ProjectA, ProjectB)).to.equal(true);
  });

  it("differ by title", () => {
    expect(ProjectsAreEqual(ProjectA, ProjectE)).to.equal(false);
  });

  it("differ by tasks length", () => {
    expect(ProjectsAreEqual(ProjectA, ProjectC)).to.equal(false);
  });

  it("differ by task inequality", () => {
    expect(ProjectsAreEqual(ProjectA, ProjectD)).to.equal(false);
  });
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
