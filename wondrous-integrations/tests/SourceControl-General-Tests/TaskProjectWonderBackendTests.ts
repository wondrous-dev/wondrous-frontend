import { Label } from "../../src/SourceControl-General/Label";
import { MockMilestone } from "./MockMilestone";
import { MockProject } from "./MockProject";
import { MockTask } from "./MockTask";
import { MockWonderBackend } from "./MockWonderBackend";
import { MilestonesAreEqual } from "../../src/SourceControl-General/Milestone";
import { ProjectsAreEqual } from "../../src/SourceControl-General/Project";
import { TasksAreEqual } from "../../src/SourceControl-General/Task";
import { SyncProjectWithWonder } from "../../src/SourceControl-General/WonderBackend";
import { expect } from "chai";

const TaskA = new MockTask("foo", Label.InProgress);
const TaskB = new MockTask("foo", Label.InProgress);
const TaskC = new MockTask("foo", Label.Todo);
const TaskD = new MockTask("bar", Label.InProgress);

const today: Date = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const MilestoneA = new MockMilestone(
  "fooMilestone",
  "",
  tomorrow,
  today,
  Label.InProgress,
  { foo: TaskA, bar: TaskD },
  null
);
const MilestoneB = new MockMilestone(
  "fooMilestone",
  "",
  tomorrow,
  today,
  Label.InProgress,
  { foo: TaskA, bar: TaskD },
  null
);
const MilestoneC = new MockMilestone(
  "fooMilestone",
  "",
  tomorrow,
  today,
  Label.InProgress,
  { foo: TaskA, bar: TaskD },
  tomorrow
);
const MilestoneD = new MockMilestone(
  "fooMilestone",
  "",
  tomorrow,
  today,
  Label.InProgress,
  { foo: TaskA },
  null
);
const MilestoneE = new MockMilestone(
  "fooMilestone",
  "",
  tomorrow,
  today,
  Label.InProgress,
  { foo: TaskC, bar: TaskD },
  null
);

const ProjectA = new MockProject(
  "fooProject",
  { foo: TaskA, bar: TaskD },
  { foo: MilestoneA }
);
const ProjectB = new MockProject(
  "fooProject",
  { foo: TaskA, bar: TaskD },
  { foo: MilestoneA }
);
const ProjectC = new MockProject(
  "fooProject",
  { foo: TaskA },
  { foo: MilestoneA }
);
const ProjectD = new MockProject(
  "fooProject",
  { foo: TaskC, bar: TaskD },
  { foo: MilestoneA }
);
const ProjectE = new MockProject(
  "barProject",
  { foo: TaskA, bar: TaskD },
  { foo: MilestoneA }
);
const ProjectF = new MockProject(
  "barProject",
  { foo: TaskA, bar: TaskD },
  { foo: MilestoneA, bar: MilestoneC }
);
const ProjectG = new MockProject(
  "barProject",
  { foo: TaskA, bar: TaskD },
  { foo: MilestoneE }
);

const WonderBackendA = new MockWonderBackend({
  fooProject: ProjectC,
  barProject: ProjectE,
});

describe("Tasks Equality", () => {
  it("equal", () => {
    expect(TasksAreEqual(TaskA, TaskA)).to.equal(true);
  });

  it("differ by id", () => {
    expect(TasksAreEqual(TaskA, TaskB)).to.equal(false);
  });

  it("differ by title", () => {
    expect(TasksAreEqual(TaskA, TaskD)).to.equal(false);
  });

  it("differ by label", () => {
    expect(TasksAreEqual(TaskB, TaskC)).to.equal(false);
  });
});

describe("Mileston Equality", () => {
  it("equal", () => {
    expect(MilestonesAreEqual(MilestoneA, MilestoneA)).to.equal(true);
  });

  it("differ by id", () => {
    expect(MilestonesAreEqual(MilestoneA, MilestoneB)).to.equal(false);
  });

  it("differ by completionDate", () => {
    expect(MilestonesAreEqual(MilestoneA, MilestoneC)).to.equal(false);
  });

  it("differ by tasks length", () => {
    expect(MilestonesAreEqual(MilestoneA, MilestoneD)).to.equal(false);
  });

  it("differ by task inequality", () => {
    expect(MilestonesAreEqual(MilestoneA, MilestoneE)).to.equal(false);
  });
});

describe("Project Equality", () => {
  it("equal", () => {
    expect(ProjectsAreEqual(ProjectA, ProjectA)).to.equal(true);
  });

  it("differ by id", () => {
    expect(ProjectsAreEqual(ProjectA, ProjectB)).to.equal(false);
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

  it("differ by milestones length", () => {
    expect(ProjectsAreEqual(ProjectA, ProjectF)).to.equal(false);
  });

  it("differ by milestones inequality", () => {
    expect(ProjectsAreEqual(ProjectA, ProjectG)).to.equal(false);
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
