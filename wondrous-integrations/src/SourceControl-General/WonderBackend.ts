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
 * SyncProjectWithWonder - sync latest state of truth with what we have in the
 *                         Wonder backend.
 *
 * @param  {type} project: Project             project to compare with
 * @param  {type} wonderBackend: WonderBackend the backend to sync
 * @return {type}                              whether or not this succeeded
 */
export function SyncProjectWithWonder(
  project: Project,
  wonderBackend: WonderBackend
): boolean {
  // update the project so we get the latest state
  project.sync();

  let wonderBackendProject: Project;
  try {
    wonderBackendProject = GetOrAddWonderBackendProject(wonderBackend, project);
  } catch (ex) {
    // TODO: add logging
    return false;
  }

  // no reason wonderBackendProject should be null unless unexpected things go wrong
  if (
    wonderBackendProject === null ||
    !ProjectsAreEqual(project, wonderBackendProject)
  ) {
    // force overwrite. We pass in the source of truth project in order to avoid a
    // race condition where source of truth != wonder backend, source of truth
    // receives an update, thus the "cached" version of source of truth here
    // != project. So, on sync we'd see that everything still not equal.
    // Example:
    //    (1) == original state ==
    //        GitHub: wondrous-dev, 3 issues
    //        WonderBE: wondrous-dev, 2 issues
    //
    //    (2) Check equality.
    //
    //    (3) == update to GitHub ==
    //        GitHub (live): wondrous-dev, 4 issues
    //        GitHub (here): wondrous-dev, 3 issues
    //
    //    (4) query live version of project from GitHub <---- what we want to avoid
    // Thus, we want to update to (here) and catch (live) on next sync, or as an
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
    // TODO: add logging
    // So here true means, was updated correctly. This true means the projects
    // are equivalent, i.e. in sync.  The other code path is for when they are
    // not equivalent, which force updates and then throws if the force update
    // did not work.
    return true;
  }
}
