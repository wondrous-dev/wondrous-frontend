import { Project } from "./Project";

// TODO: consider whether we want to have a projects field here. Essentially
//       acts like a cache which comes with its own complexities.
export interface WonderBackend {
  projects: { [key: string]: Project };
  updateProject(sourceOfTruthProject: Project): Project;
}

export function SyncWonderBackend(wonderBackend: WonderBackend): boolean {
  let failed: boolean = false;
  for (const i in wonderBackend.projects) {
    if (!wonderBackend.projects[i].sync()) {
      failed = true;
    }
  }

  return failed;
}

export function GetOrAddWonderBackendProject(
  wonderBackend: WonderBackend,
  project: Project,
  trySyncOnFail: boolean = false
): Project {
  if (project.title in wonderBackend.projects) {
    return wonderBackend.projects[project.title];
  } else {
    return wonderBackend.updateProject(project);
  }

  if (trySyncOnFail) {
    SyncWonderBackend(wonderBackend);
    return GetOrAddWonderBackendProject(wonderBackend, project, false);
  }

  throw new Error("Project [" + project.title + "] not found in WonderBackend");
}
