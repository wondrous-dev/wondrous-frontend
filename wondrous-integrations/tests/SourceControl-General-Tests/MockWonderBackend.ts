import { Project } from "../../src/SourceControl-General/Project";
import { WonderBackend } from "../../src/SourceControl-General/WonderBackend";

export class MockWonderBackend implements WonderBackend {
  projects: { [key: string]: Project };

  constructor(projects: { [key: string]: Project }) {
    this.projects = projects;
  }

  updateProject(sourceOfTruthProject: Project): Project {
    this.projects[sourceOfTruthProject.title] = sourceOfTruthProject;
    return sourceOfTruthProject;
  }

  sync(): boolean {
    let failed: boolean = false;
    for (const i in this.projects) {
      if (!this.projects[i].sync()) {
        failed = true;
      }
    }

    return failed;
  }
}
