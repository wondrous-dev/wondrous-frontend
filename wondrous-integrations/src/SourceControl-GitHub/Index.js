import { Issue } from "./Issue";
import { Organization } from "./Organization";
import { PullRequest } from "./PullRequest";
import { Repository } from "./Repository";
import { Octokit } from "octokit";

// authenticate via personal token for now
const octokit = new Octokit({ auth: process.env.GITHUB_AUTHTOKEN });

// private to this module
async function GetRepository(
  orgName: string,
  repoName: string,
  repoId: number
): Promise<Repository> {
  // if > 100 issues, will be paged
  const respIssues = await octokit.rest.issues.listForRepo({
    owner: orgName,
    repo: repoName,
  });
  const issues = respIssues.data
    .filter((i) => i.pull_request == null)
    .map((i) => new Issue(i.title, i.id, i.number));

  // if > 100 prs, will be paged
  const respPullRequests = await octokit.rest.pulls.list({
    owner: orgName,
    repo: repoName,
  });
  const pullRequests = respPullRequests.data.map(
    (pr) => new PullRequest(pr.title, pr.id, pr.number)
  );

  return new Repository(repoName, repoId, issues, pullRequests);
}

/**
 * GetOrganization - queries GitHub for Organization information, resolving all
 *                   sub info, such as Repositories, Issues, etc.
 *
 * @param  {type} orgName: string organization name
 * @return {type}                 a GitHub organization
 */
export async function GetOrganization(orgName: string): Promise<Organization> {
  const {
    data: { id },
  } = await octokit.rest.orgs.get({ org: orgName });
  // if > 100 repos, will be paged
  const respRepos = await octokit.rest.repos.listForOrg({ org: orgName });
  const repositories: Repository[] = [];

  for (const i in respRepos.data) {
    let r = respRepos.data[i];
    repositories.push(await GetRepository(orgName, r.name, r.id));
  }

  return new Organization(orgName, id, repositories);
}
