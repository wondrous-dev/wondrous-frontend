/*
 * See here: https://docs.github.com/en/rest/reference/orgs#get-an-organization
 * All pull requests are issues but not all issues are pull requests.
 */
export class PullRequest {
  title: string;
  id: number;
  number: number;

  constructor(
    title: string,
    id: number,
    number: number,
  ) {
    this.title = title;
    this.id = id;
    this.number = number;
  }
}

module.exports = {
  PullRequest
}
