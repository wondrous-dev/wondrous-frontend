import { Issue } from "./Issue";
import { PullRequest } from "./PullRequest";

/**
 * See response to "get repo" for all available fields:
 * https://docs.github.com/en/rest/reference/repos#get-a-repository
 */
export class Repository {
  name: string;

  id: number;

  issues: Issue[];

  pullRequests: PullRequest[];

  constructor(
    name: string,
    id: number,
    issues: Issue[],
    pullRequests: PullRequest[]
  ) {
    this.name = name;
    this.id = id;
    this.issues = issues;
    this.pullRequests = pullRequests;
  }
}

module.exports = {
  Repository,
};
