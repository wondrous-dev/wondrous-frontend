import { Project, ProjectsAreEqual } from "./Project";

// TODO: consider whether we want to have a projects field here. Essentially
//       acts like a cache which comes with its own complexities. The alternative
//       would be to query all at sync time instead of updating on the fly, i.e.
//       updating DB and this cache at the same time.
export interface WonderBackend {
  projects: { [key: string]: Project };
  updateProject(sourceOfTruthProject: Project): Project;
}

// TODO: determine if this is the correct semantics... often not great to hide
// errors like this or write offensive OO side-effect filled methods.
function GetOrAddWonderBackendProject(
  wonderBackend: WonderBackend,
  project: Project
): Project {
  if (project.title in wonderBackend.projects) {
    return wonderBackend.projects[project.title];
  } else {
    return wonderBackend.updateProject(project);
  }
}

/**
 * SyncProjectWithWonder - description
 *
 * @param  {type} project: Project             project to compare with
 * @param  {type} wonderBackend: WonderBackend the backend to sync
 * @return {type}                              whether or not this succeeded
 */
export function SyncProjectWithWonder(
  project: Project,
  wonderBackend: WonderBackend
): boolean {
  project.sync();

  let wonderBackendProject: Project;
  try {
    wonderBackendProject = GetOrAddWonderBackendProject(wonderBackend, project);
  } catch (ex) {
    console.log(ex);
    return false;
  }

  if (!ProjectsAreEqual(project, wonderBackendProject)) {
    // force overwrite. We pass in the source of truth project in order to avoid a
    // race condition where source of truth != wonder backend, source of truth
    // receives an update, thus the "cached" version of source of truth here
    // != project. So, on sync we'd see that everything still not equal.
    // Example:
    //    == original state ==
    //    GitHub: wondrous-dev, 3 issues
    //    WonderBE: wondrous-dev, 2 issues
    //
    //    Check equality.
    //
    //    == update to GitHub ==
    //    GitHub (live): wondrous-dev, 4 issues
    //    GitHub (here): wondrous-dev, 3 issues
    //
    // Thus, we want to update to (here) and catch (live) on next sync, or as a
    // update call.
    const updatedWonderBackendProject = wonderBackend.updateProject(project);

    // only possible reason two wouldn't be equal at this point would be a bug
    if (!ProjectsAreEqual(project, updatedWonderBackendProject)) {
      throw new Error(
        "Unable to update out of sync project " + project.title + " in backend."
      );
    }

    return true;
  } else {
    // TODO: add actual logging
    console.log("Project [" + project.title + "] in sync with backend.");
    return true;
  }
}
