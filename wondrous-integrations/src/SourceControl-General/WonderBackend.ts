import { Project } from "./Project";

// TODO: consider whether we want to have a projects field here. Essentially
//       acts like a cache which comes with its own complexities. The alternative
//       would be to query all at sync time instead of updating on the fly, i.e.
//       updating DB and this cache at the same time.
export interface WonderBackend {
  projects: { [key: string]: Project };
  updateProject(sourceOfTruthProject: Project): Project;
  sync(): boolean;
}

// TODO: determine if this is the correct semantics... often not great to hide
// errors like this or write offensive OO side-effect filled methods.
export function GetOrAddWonderBackendProject(
  wonderBackend: WonderBackend,
  project: Project
): Project {
  if (project.title in wonderBackend.projects) {
    return wonderBackend.projects[project.title];
  } else {
    return wonderBackend.updateProject(project);
  }
}
