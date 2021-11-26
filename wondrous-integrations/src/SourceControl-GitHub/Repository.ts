import { Issue } from "./Issue";
import { PullRequest } from "./PullRequest";

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
